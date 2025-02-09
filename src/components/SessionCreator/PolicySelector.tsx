import { PolicyType, POLICIES } from '../../lib/constants'
import { PolicyConfig } from './PolicyConfig'
import { useFormContext } from 'react-hook-form'
import type { SessionFormData } from './types'

interface PolicySelectorProps {
  name: string
  error?: string
  onPolicyChange?: () => void
}

export function PolicySelector({ name, error, onPolicyChange }: PolicySelectorProps) {
  const { watch, setValue } = useFormContext<SessionFormData>()
  const selectedPolicies = watch(name) || []

  const handlePolicyToggle = (policy: PolicyType) => {
    const newPolicies = selectedPolicies.includes(policy)
      ? selectedPolicies.filter(p => p !== policy)
      : [...selectedPolicies, policy]
    setValue(name, newPolicies)
    onPolicyChange?.()
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Policies
      </label>
      
      <div className="space-y-2">
        {Object.entries(POLICIES).map(([type, policy]) => (
          <div key={type} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`${name}-${type}`}
                checked={selectedPolicies.includes(type as PolicyType)}
                onChange={() => handlePolicyToggle(type as PolicyType)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`${name}-${type}`} className="text-sm">
                {policy.name}
              </label>
            </div>
            
            {selectedPolicies.includes(type as PolicyType) && (
              <PolicyConfig policyType={type as PolicyType} name={name} />
            )}
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
