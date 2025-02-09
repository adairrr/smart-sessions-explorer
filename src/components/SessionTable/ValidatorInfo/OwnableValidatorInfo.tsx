import { Address } from 'viem'
import { useOwnableValidatorDetails } from '../../../hooks/useOwnableValidatorDetails'

interface OwnableValidatorInfoProps {
  validatorAddress: Address
  accountAddress: Address
}

export function OwnableValidatorInfo({ validatorAddress, accountAddress }: OwnableValidatorInfoProps) {
  const { owners, threshold, isLoading, error } = useOwnableValidatorDetails(
    validatorAddress,
    accountAddress
  )

  if (isLoading) {
    return <div className="text-gray-500">Loading validator details...</div>
  }

  if (error) {
    return <div className="text-red-500">Error loading validator details: {error.message}</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">Threshold</h4>
        <p className="mt-1">{threshold}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">Owners</h4>
        <div className="mt-1 space-y-2">
          {owners.map((owner, index) => (
            <div key={index} className="font-mono text-sm break-all">
              {owner}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
