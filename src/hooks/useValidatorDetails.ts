import { useReadContracts } from 'wagmi'
import { SMART_SESSIONS_ABI } from '../lib/smart-sessions-abi'
import { SMART_SESSIONS_ADDRESS } from '../lib/constants'
import type { PermissionId } from '../types/session'
import { useModuleInfo } from './useModuleInfo'

export interface ValidatorDetails {
  address: `0x${string}`
  configData: `0x${string}`
  name: string
  version: string
}

export function useValidatorDetails(accountAddress: string | null, permissionId: PermissionId | null) {
  const { data: validatorData, isLoading: isLoadingValidator } = useReadContracts({
    contracts: [
      {
        address: SMART_SESSIONS_ADDRESS,
        abi: SMART_SESSIONS_ABI,
        functionName: 'getSessionValidatorAndConfig',
        args: accountAddress && permissionId ? [accountAddress, permissionId] : undefined,
      },
    ],
    query: {
      enabled: Boolean(accountAddress) && Boolean(permissionId),
    },
  })

  const validatorAddress = validatorData?.[0]?.result?.[0] as `0x${string}` | undefined
  const validatorConfig = validatorData?.[0]?.result?.[1] as `0x${string}` | undefined

  const { moduleInfo, isLoading: isLoadingModuleInfo } = useModuleInfo(validatorAddress)

  return {
    validator: validatorAddress && validatorConfig && moduleInfo
      ? {
          address: validatorAddress,
          configData: validatorConfig,
          name: moduleInfo.name,
          version: moduleInfo.version,
        }
      : null,
    isLoading: isLoadingValidator || isLoadingModuleInfo,
  }
}
