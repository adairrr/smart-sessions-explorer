import { useReadContracts } from 'wagmi'
import { VALIDATOR_ABI } from '../lib/validator-abi'
import { Address } from 'viem'

export interface ModuleInfo {
  name: string
  version: string
}

export function useModuleInfo(moduleAddress: Address | undefined) {
  const { data: moduleInfo, isLoading } = useReadContracts({
    contracts: moduleAddress
      ? [
          {
            address: moduleAddress,
            abi: VALIDATOR_ABI,
            functionName: 'name',
          },
          {
            address: moduleAddress,
            abi: VALIDATOR_ABI,
            functionName: 'version',
          },
        ]
      : [],
    query: {
      enabled: Boolean(moduleAddress),
    },
  })

  return {
    moduleInfo: moduleAddress
      ? {
          name: (moduleInfo?.[0]?.result as string) || 'Unknown',
          version: (moduleInfo?.[1]?.result as string) || 'Unknown',
        }
      : null,
    isLoading,
  }
}
