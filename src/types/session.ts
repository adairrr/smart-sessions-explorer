import { Address } from 'viem'
import { PolicyType } from '../lib/constants'

export type PermissionId = `0x${string}`
export type ActionId = `0x${string}`

export interface SessionData {
  permissionId: PermissionId
  enabledActions: `0x${string}`[]
  userOpPolicies: Address[]
  erc1271Policies: Address[]
  actionPolicies: {
    actionId: ActionId
    policies: Address[]
  }[]
  isEnabled: boolean
}
