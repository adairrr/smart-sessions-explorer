import { useReadContracts } from 'wagmi'
import { SMART_SESSIONS_ABI } from '../lib/smart-sessions-abi'
import { SMART_SESSIONS_ADDRESS } from '../lib/constants'
import type { PermissionId, SessionData } from '../types/session'

export function useSessionDetails(accountAddress: string | null) {
  const { data: sessionsData, isError, isLoading, isRefetching } = useReadContracts({
    contracts: accountAddress ? [
      {
        address: SMART_SESSIONS_ADDRESS,
        abi: SMART_SESSIONS_ABI,
        functionName: 'getPermissionIDs',
        args: [accountAddress],
      },
    ] : [],
    query: {
      enabled: Boolean(accountAddress),
    },
  })

  const permissionIds = (sessionsData?.[0]?.result || []) as PermissionId[]

  const { data: sessionDetails } = useReadContracts({
    contracts: accountAddress && permissionIds.length > 0
      ? [
          ...permissionIds.flatMap((permissionId) => [
            {
              address: SMART_SESSIONS_ADDRESS,
              abi: SMART_SESSIONS_ABI,
              functionName: 'getEnabledActions',
              args: [accountAddress, permissionId],
            },
            {
              address: SMART_SESSIONS_ADDRESS,
              abi: SMART_SESSIONS_ABI,
              functionName: 'getUserOpPolicies',
              args: [accountAddress, permissionId],
            },
            {
              address: SMART_SESSIONS_ADDRESS,
              abi: SMART_SESSIONS_ABI,
              functionName: 'getERC1271Policies',
              args: [accountAddress, permissionId],
            },
            {
              address: SMART_SESSIONS_ADDRESS,
              abi: SMART_SESSIONS_ABI,
              functionName: 'isPermissionEnabled',
              args: [permissionId, accountAddress],
            },
          ]),
        ]
      : [],
    query: {
      enabled: Boolean(accountAddress) && permissionIds.length > 0,
    },
  })

  const sessions: SessionData[] = permissionIds.map((permissionId, index) => ({
    permissionId,
    enabledActions: (sessionDetails?.[index * 4]?.result || []) as `0x${string}`[],
    userOpPolicies: (sessionDetails?.[index * 4 + 1]?.result || []) as `0x${string}`[],
    erc1271Policies: (sessionDetails?.[index * 4 + 2]?.result || []) as `0x${string}`[],
    isEnabled: (sessionDetails?.[index * 4 + 3]?.result || false) as boolean,
    actionPolicies: [],
  }))

  return {
    sessions,
    isLoading,
    isError,
    isRefetching,
  }
}
