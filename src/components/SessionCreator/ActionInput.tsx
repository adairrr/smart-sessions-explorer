import { useEffect } from 'react'
import { toFunctionSelector } from 'viem'
import { PolicySelector } from './PolicySelector'
import { useFormContext } from 'react-hook-form'
import type { SessionFormData } from './types'

interface ActionInputProps {
  index: number
  onRemove: (index: number) => void
}

export function ActionInput({ index, onRemove }: ActionInputProps) {
  const { 
    register, 
    setValue, 
    watch, 
    trigger,
    formState: { errors } 
  } = useFormContext<SessionFormData>()

  const actionErrors = errors.actions?.[index]
  const actionData = watch(`actions.${index}`)

  const handleSelectorConversion = () => {
    try {
      const functionSelector = toFunctionSelector(actionData.actionTargetSelector)
      setValue(`actions.${index}.actionTargetSelector`, functionSelector)
      trigger(`actions.${index}`)
    } catch (error) {
      console.error('Invalid function signature')
    }
  }

  // Trigger validation whenever action data changes
  useEffect(() => {
    if (actionData) {
      trigger(`actions.${index}`)
    }
  }, [actionData, index, trigger])

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Action {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Address
          </label>
          <input
            {...register(`actions.${index}.actionTarget`)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0x..."
            onChange={(e) => {
              setValue(`actions.${index}.actionTarget`, e.target.value)
              trigger(`actions.${index}`)
            }}
          />
          {actionErrors?.actionTarget && (
            <p className="mt-1 text-sm text-red-600">
              {actionErrors.actionTarget.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Function Selector/Signature
          </label>
          <div className="mt-1 flex gap-2">
            <input
              {...register(`actions.${index}.actionTargetSelector`)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="function(uint256,address) or 0x..."
              onChange={(e) => {
                setValue(`actions.${index}.actionTargetSelector`, e.target.value)
                trigger(`actions.${index}`)
              }}
            />
            <button
              type="button"
              onClick={handleSelectorConversion}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Convert
            </button>
          </div>
          {actionErrors?.actionTargetSelector && (
            <p className="mt-1 text-sm text-red-600">
              {actionErrors.actionTargetSelector.message}
            </p>
          )}
        </div>

        <PolicySelector
          name={`actions.${index}.actionPolicies`}
          error={actionErrors?.actionPolicies?.message}
          onPolicyChange={() => trigger(`actions.${index}`)}
        />
      </div>
    </div>
  )
}
