import { useCallback } from 'react'
import { Address, Hash } from 'viem'
import { match } from 'ts-pattern'
import { UserOperationCall } from 'permissionless'
import { 
  OWNABLE_VALIDATOR_ADDRESS, 
  encodeValidationData,
  getSmartSessionsValidator,
  getSudoPolicy,
  getEnableSessionsAction,
} from '@rhinestone/module-sdk'
import { baseSepolia } from 'viem/chains'
import { PolicyType } from '../lib/constants'
import { pimlicoClient } from '../utils/clients'
import { SessionFormData } from '../components/SessionCreator/types'
import { useSafeSmartAccount } from './useSafeSmartAccount'

export function useSessionCreator(smartAccountAddress: Address) {
  const { 
    smartAccountClient, 
    isValidatorInstalled, 
    isLoading: isClientLoading,
    error: clientError 
  } = useSafeSmartAccount(smartAccountAddress)

  const getPolicyForType = useCallback((policyType: PolicyType) => {
    return match(policyType)
      .with(PolicyType.SUDO, () => getSudoPolicy())
      .otherwise(() => undefined)
  }, [])

  const createSession = useCallback(async (data: SessionFormData) => {
    if (!smartAccountClient) {
      throw new Error('No smart account client')
    }

    const session = {
      sessionValidator: OWNABLE_VALIDATOR_ADDRESS,
      sessionValidatorInitData: encodeValidationData({
        threshold: 1,
        owners: [data.sessionOwner],
      }),
      salt: '0x' + Array(64).fill('0').join(''),
      userOpPolicies: [getSudoPolicy()],
      erc7739Policies: {
        allowedERC7739Content: [],
        erc1271Policies: [],
      },
      actions: data.actions.map(action => ({
        actionTarget: action.actionTarget as Address,
        actionTargetSelector: action.actionTargetSelector,
        actionPolicies: action.actionPolicies
          .map(getPolicyForType)
          .filter((policy): policy is NonNullable<ReturnType<typeof getPolicyForType>> => 
            policy !== undefined
          ),
      })),
      chainId: BigInt(baseSepolia.id),
      permitERC4337Paymaster: true,
    }

    let userOpHash: Hash | undefined

    // Check if we need to install the validator
    if (!isValidatorInstalled) {
      console.log('Installing validator...')
      const validator = getSmartSessionsValidator({})
      const installOp = await smartAccountClient.installModule(validator)
      
      const receipt = await smartAccountClient.waitForUserOperationReceipt({
        hash: installOp,
      })
      console.log('Validator installation receipt:', receipt)
    }

    // Enable the session
    console.log('Enabling session...')
    const calls: UserOperationCall[] = []

    const enableSessionAction = getEnableSessionsAction({
      sessions: [session]
    })

    calls.push({
      to: enableSessionAction.to,
      data: enableSessionAction.data,
      value: BigInt(enableSessionAction.value.toString())
    })

    userOpHash = await smartAccountClient.sendUserOperation({
      calls
    })

    let txHash: Hash | null = null
    if (userOpHash) {
      const receipt = await pimlicoClient.waitForUserOperationReceipt({
        hash: userOpHash
      })

      txHash = receipt.receipt.transactionHash
      console.log('Session enabled! Transaction hash:', txHash)
      return txHash
    }
  }, [smartAccountClient, isValidatorInstalled, getPolicyForType])

  return {
    createSession,
    isValidatorInstalled,
    isLoading: isClientLoading,
    error: clientError,
  }
}
