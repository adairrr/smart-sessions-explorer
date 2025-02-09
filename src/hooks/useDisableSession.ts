import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Hash } from 'viem'
import { UserOperationCall } from 'permissionless'
import { getRemoveSessionAction } from '@rhinestone/module-sdk'
import { pimlicoClient } from '../utils/clients'
import { useSafeSmartAccount } from './useSafeSmartAccount'

export function useDisableSession(smartAccountAddress: string) {
  const queryClient = useQueryClient()
  const { smartAccountClient } = useSafeSmartAccount(smartAccountAddress)

  return useMutation({
    mutationFn: async (permissionId: string) => {
      if (!smartAccountClient) {
        throw new Error('Smart account client not initialized')
      }

      const calls: UserOperationCall[] = []

      const removeAction = getRemoveSessionAction({
        permissionId
      })

      calls.push({
        to: removeAction.to,
        data: removeAction.data,
        value: BigInt(removeAction.value.toString())
      })

      const userOpHash = await smartAccountClient.sendUserOperation({
        calls
      })

      let txHash: Hash | null = null
      if (userOpHash) {
        const receipt = await pimlicoClient.waitForUserOperationReceipt({
          hash: userOpHash
        })

        txHash = receipt.receipt.transactionHash
      }

      return txHash
    },
    onSuccess: () => {
      // Invalidate sessions query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['sessions', smartAccountAddress] })
    },
  })
}
