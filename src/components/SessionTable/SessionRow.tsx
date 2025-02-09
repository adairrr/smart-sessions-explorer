import { useState } from 'react'
import { PolicyTabs } from './PolicyTabs'
import { useValidatorDetails } from '../../hooks/useValidatorDetails'
import { useDisableSession } from '../../hooks/useDisableSession'
import type { SessionData } from '../../types/session'

interface SessionRowProps {
  session: SessionData
  accountAddress: string
}

export function SessionRow({ session, accountAddress }: SessionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { validator, isLoading: isLoadingValidator } = useValidatorDetails(
    accountAddress,
    isExpanded ? session.permissionId : null
  )
  const disableSession = useDisableSession(accountAddress)

  const handleDisable = async () => {
    try {
      await disableSession.mutateAsync(session.permissionId)
    } catch (error) {
      console.error('Failed to disable session:', error)
    }
  }

  return (
    <>
      <tr className={`group hover:bg-gray-50 ${session.isEnabled ? 'bg-green-50' : 'bg-gray-50'}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={`w-3 h-3 rounded-full ${session.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {session.permissionId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {session.enabledActions.length}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {session.userOpPolicies.length}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
          {session.isEnabled && (
            <button
              className="text-red-600 hover:text-red-800 disabled:text-gray-400"
              onClick={handleDisable}
              disabled={disableSession.isPending}
            >
              {disableSession.isPending ? 'Revoking...' : 'Revoke'}
            </button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr className={session.isEnabled ? 'bg-green-50' : 'bg-gray-50'}>
          <td colSpan={5} className="px-6 py-4">
            {isLoadingValidator ? (
              <div className="text-center py-4">Loading validator details...</div>
            ) : (
              <PolicyTabs
                validator={validator}
                accountAddress={accountAddress}
                userOpPolicies={session.userOpPolicies}
                erc1271Policies={session.erc1271Policies}
                actionPolicies={session.actionPolicies}
                enabledActions={session.enabledActions}
              />
            )}
          </td>
        </tr>
      )}
    </>
  )
}
