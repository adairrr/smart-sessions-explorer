import { useReadContracts } from 'wagmi'
import { Address } from 'viem'
import { OWNABLE_VALIDATOR_ABI } from '../lib/abis/ownable-validator-abi'

interface OwnableValidatorDetails {
  owners: Address[]
  threshold: number
  isLoading: boolean
  error: Error | null
}

export function useOwnableValidatorDetails(
  validatorAddress: Address,
  accountAddress: Address | null
): OwnableValidatorDetails {
  const { data, isLoading, error } = useReadContracts({
    contracts: accountAddress ? [
      {
        address: validatorAddress,
        abi: OWNABLE_VALIDATOR_ABI,
        functionName: 'getOwners',
        args: [accountAddress],
      },
      {
        address: validatorAddress,
        abi: OWNABLE_VALIDATOR_ABI,
        functionName: 'threshold',
        args: [accountAddress],
      },
    ] : [],
    query: {
      enabled: Boolean(accountAddress),
    },
  })

  return {
    owners: (data?.[0]?.result || []) as Address[],
    threshold: Number(data?.[1]?.result || 0),
    isLoading,
    error: error as Error | null,
  }
}
