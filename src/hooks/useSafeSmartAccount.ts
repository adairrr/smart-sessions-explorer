import { useCallback, useEffect, useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { Address, Chain, Transport, http } from 'viem'
import { createSmartAccountClient, SmartAccountClient } from 'permissionless'
import { ToSafeSmartAccountReturnType, toSafeSmartAccount } from 'permissionless/accounts'
import { erc7579Actions } from 'permissionless/actions/erc7579'
import { Erc7579Actions } from 'permissionless/actions/erc7579'
import { entryPoint07Address } from 'viem/account-abstraction'
import {
  RHINESTONE_ATTESTER_ADDRESS,
  MOCK_ATTESTER_ADDRESS,
  getOwnableValidator,
  getSmartSessionsValidator,
} from '@rhinestone/module-sdk'
import { baseSepolia } from 'viem/chains'
import { pimlicoClient, pimlicoBaseSepoliaUrl, paymasterClient } from '../utils/clients'

export type SmartAccountClientType = SmartAccountClient<
  Transport,
  Chain,
  ToSafeSmartAccountReturnType<'0.7'>
> &
  Erc7579Actions<ToSafeSmartAccountReturnType<'0.7'>>

interface UseSafeSmartAccountResult {
  smartAccountClient: SmartAccountClientType | null
  isValidatorInstalled: boolean
  isLoading: boolean
  error: Error | null
}

export function useSafeSmartAccount(smartAccountAddress: Address | null): UseSafeSmartAccountResult {
  const { address: ownerAddress } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClientType | null>(null)
  const [isValidatorInstalled, setIsValidatorInstalled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const initializeSmartAccount = useCallback(async () => {
    if (!smartAccountAddress || !ownerAddress || !walletClient || !publicClient) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const ownableValidator = getOwnableValidator({
        owners: [ownerAddress],
        threshold: 1,
      })

      const safeAccount = await toSafeSmartAccount({
        client: publicClient,
        address: smartAccountAddress,
        owners: [walletClient],
        version: '1.4.1',
        entryPoint: {
          address: entryPoint07Address,
          version: '0.7',
        },
        safe4337ModuleAddress: '0x7579EE8307284F293B1927136486880611F20002',
        erc7579LaunchpadAddress: '0x7579011aB74c46090561ea277Ba79D510c6C00ff',
        attesters: [
          RHINESTONE_ATTESTER_ADDRESS,
          MOCK_ATTESTER_ADDRESS,
        ],
        attestersThreshold: 1,
        validators: [
          {
            address: ownableValidator.address,
            context: ownableValidator.initData,
          },
        ],
      })

      const client = createSmartAccountClient({
        account: safeAccount,
        paymaster: paymasterClient,
        chain: baseSepolia,
        userOperation: {
          estimateFeesPerGas: async () =>
            (await pimlicoClient.getUserOperationGasPrice()).fast,
        },
        bundlerTransport: http(pimlicoBaseSepoliaUrl),
      }).extend(erc7579Actions())

      setSmartAccountClient(client as SmartAccountClientType)

      // Check if validator is installed
      const isInstalled = await client.isModuleInstalled(
        getSmartSessionsValidator({})
      )
      setIsValidatorInstalled(isInstalled)

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize smart account'))
    } finally {
      setIsLoading(false)
    }
  }, [smartAccountAddress, ownerAddress, walletClient, publicClient])

  useEffect(() => {
    initializeSmartAccount()
  }, [initializeSmartAccount])

  return {
    smartAccountClient,
    isValidatorInstalled,
    isLoading,
    error,
  }
}
