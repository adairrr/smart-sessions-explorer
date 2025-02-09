import { useState } from 'react'
import { Address } from 'viem'
import { ValidatorDetails as ValidatorDetailsComponent } from './ValidatorDetails'
import { ValidatorDetails } from '../../hooks/useValidatorDetails'

interface PolicyTabsProps {
  validator: ValidatorDetails | null
  accountAddress: string
  userOpPolicies: Address[]
  erc1271Policies: Address[]
  actionPolicies: {
    actionId: `0x${string}`
    policies: Address[]
  }[]
  enabledActions: `0x${string}`[]
}

export function PolicyTabs({ 
  validator, 
  accountAddress,
  userOpPolicies, 
  erc1271Policies, 
  actionPolicies, 
  enabledActions 
}: PolicyTabsProps) {
  const [activeTab, setActiveTab] = useState('validator')

  const tabs = [
    { id: 'validator', label: 'Validator Details' },
    { id: 'userOp', label: 'UserOp Policies' },
    { id: 'erc1271', label: 'ERC1271 Policies' },
    { id: 'action', label: 'Action Policies' },
    { id: 'enabled', label: 'Enabled Actions' },
  ]

  return (
    <div className="mt-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.id === 'userOp' && userOpPolicies.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                  {userOpPolicies.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'validator' && validator && (
          <ValidatorDetailsComponent 
            validator={validator} 
            accountAddress={accountAddress}
          />
        )}

        {activeTab === 'userOp' && (
          <div className="space-y-4">
            {userOpPolicies.length === 0 ? (
              <p className="text-gray-500 italic">No UserOp policies found</p>
            ) : (
              userOpPolicies.map((policy, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div className="font-mono text-sm break-all">{policy}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'erc1271' && (
          <div className="space-y-2">
            {erc1271Policies.length === 0 ? (
              <p className="text-gray-500 italic">No ERC1271 policies found</p>
            ) : (
              erc1271Policies.map((policy, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-mono text-sm break-all">{policy}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'action' && (
          <div className="space-y-4">
            {actionPolicies.length === 0 ? (
              <p className="text-gray-500 italic">No action policies found</p>
            ) : (
              actionPolicies.map((action, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-2">Action ID: {action.actionId}</div>
                  <div className="space-y-2">
                    {action.policies.map((policy, pIndex) => (
                      <div key={pIndex} className="pl-4 font-mono text-sm break-all">
                        {policy}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'enabled' && (
          <div className="space-y-2">
            {enabledActions.length === 0 ? (
              <p className="text-gray-500 italic">No enabled actions found</p>
            ) : (
              enabledActions.map((action, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-mono text-sm break-all">{action}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
