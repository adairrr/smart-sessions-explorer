import { useFieldArray, useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Address } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { ActionInput } from './ActionInput'
import { sessionFormSchema, type SessionFormData } from './types'
import { useSessionCreator } from '../../hooks/useSessionCreator'
import { useState } from 'react'

interface SessionCreatorProps {
  smartAccountAddress: Address
}

export function SessionCreator({ smartAccountAddress }: SessionCreatorProps) {
  const { 
    createSession, 
    isValidatorInstalled, 
    isLoading: isClientLoading, 
    error: clientError 
  } = useSessionCreator(smartAccountAddress)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const methods = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      sessionOwner: '',
      actions: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'actions',
  })

  const generateNewKey = () => {
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)
    methods.setValue('sessionOwner', account.address)
    console.log('Private key (save this):', privateKey)
  }

  const onSubmit = async (data: SessionFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setTxHash(null)

    try {
      const hash = await createSession(data)
      if (hash) {
        setTxHash(hash)
        methods.reset()
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create session')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isClientLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Loading smart account client...</p>
      </div>
    )
  }

  if (clientError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-red-500">Error: {clientError.message}</p>
      </div>
    )
  }

  if (!isValidatorInstalled) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-yellow-500">Smart Sessions validator will be installed during session creation</p>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Session</h2>
          {txHash && (
            <a 
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              View Transaction ↗
            </a>
          )}
        </div>
        
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{submitError}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Smart Account Address
            </label>
            <input
              type="text"
              value={smartAccountAddress}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Session Owner Address
            </label>
            <div className="mt-1 flex gap-2">
              <input
                {...methods.register('sessionOwner')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                placeholder="0x..."
              />
              <button
                type="button"
                onClick={generateNewKey}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Generate Key
              </button>
            </div>
            {methods.formState.errors.sessionOwner && (
              <p className="mt-1 text-sm text-red-600">
                {methods.formState.errors.sessionOwner.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Actions</h3>
              <button
                type="button"
                onClick={() => append({
                  actionTarget: '',
                  actionTargetSelector: '',
                  actionPolicies: [],
                })}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Action
              </button>
            </div>

            {fields.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No actions added. Click "Add Action" to start.
              </p>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <ActionInput
                    key={field.id}
                    index={index}
                    onRemove={remove}
                  />
                ))}
              </div>
            )}

            {methods.formState.errors.actions && (
              <p className="text-sm text-red-600">
                {methods.formState.errors.actions.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!methods.formState.isValid || isSubmitting}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Session...' : 'Create Session'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
