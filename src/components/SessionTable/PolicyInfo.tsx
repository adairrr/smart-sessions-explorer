import { Address } from 'viem'
import { getPolicyByAddress } from '../../lib/constants'

interface PolicyInfoProps {
  address: Address
}

export function PolicyInfo({ address }: PolicyInfoProps) {
  const policyInfo = getPolicyByAddress(address)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Policy:</span>
        <span className="font-medium">
          {policyInfo?.name || 'Unknown Policy'}
        </span>
      </div>
      {policyInfo?.description && (
        <div className="text-sm text-gray-600">
          {policyInfo.description}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Address:</span>
        <span className="font-mono text-sm break-all">{address}</span>
      </div>
    </div>
  )
}
