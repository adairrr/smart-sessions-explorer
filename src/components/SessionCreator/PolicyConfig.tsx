import { PolicyType } from '../../lib/constants'

interface PolicyConfigProps {
  policyType: PolicyType
}

export function PolicyConfig({ policyType }: PolicyConfigProps) {
  switch (policyType) {
    case PolicyType.VALUE_LIMIT:
      return (
        <div className="ml-6 p-3 bg-white rounded border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Value Limit Configuration</h4>
          {/* Add value limit config fields */}
          <p className="text-sm text-gray-500">Configuration coming soon</p>
        </div>
      )
    
    case PolicyType.USAGE_LIMIT:
      return (
        <div className="ml-6 p-3 bg-white rounded border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Usage Limit Configuration</h4>
          {/* Add usage limit config fields */}
          <p className="text-sm text-gray-500">Configuration coming soon</p>
        </div>
      )
    
    // Add other policy configurations...
    
    default:
      return null
  }
}
