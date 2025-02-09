import { Address } from 'viem'

/**
 * Smart Sessions Module Address
 */
export const SMART_SESSIONS_ADDRESS = '0x00000000002B0eCfbD0496EE71e01257dA0E37DE' as const

/**
 * Policy Types
 */
export enum PolicyType {
  VALUE_LIMIT = 'VALUE_LIMIT',
  USAGE_LIMIT = 'USAGE_LIMIT',
  SUDO = 'SUDO',
  SPENDING_LIMITS = 'SPENDING_LIMITS',
  TIME_FRAME = 'TIME_FRAME',
  UNIVERSAL_ACTION = 'UNIVERSAL_ACTION',
}

/**
 * Policy Information
 */
export interface PolicyInfo {
  address: Address
  name: string
  description: string
}

/**
 * Policy Registry
 */
export const POLICIES: Record<PolicyType, PolicyInfo> = {
  [PolicyType.VALUE_LIMIT]: {
    address: '0x730DA93267E7E513e932301B47F2ac7D062abC83',
    name: 'Value Limit Policy',
    description: 'Limits the maximum value of transactions that can be executed',
  },
  [PolicyType.USAGE_LIMIT]: {
    address: '0x1F34eF8311345A3A4a4566aF321b313052F51493',
    name: 'Usage Limit Policy',
    description: 'Limits the number of times a session can be used',
  },
  [PolicyType.SUDO]: {
    address: '0x0000003111cD8e92337C100F22B7A9dbf8DEE301',
    name: 'Sudo Policy',
    description: 'Grants unlimited permissions within the scope of the session',
  },
  [PolicyType.SPENDING_LIMITS]: {
    address: '0x00000088D48cF102A8Cdb0137A9b173f957c6343',
    name: 'Spending Limits Policy',
    description: 'Sets spending limits for token transfers',
  },
  [PolicyType.TIME_FRAME]: {
    address: '0x8177451511dE0577b911C254E9551D981C26dc72',
    name: 'Time Frame Policy',
    description: 'Restricts session usage to specific time periods',
  },
  [PolicyType.UNIVERSAL_ACTION]: {
    address: '0x0000006DDA6c463511C4e9B05CFc34C1247fCF1F',
    name: 'Universal Action Policy',
    description: 'Allows any action within the session scope',
  },
} as const

/**
 * Helper function to get policy info by address
 */
export function getPolicyByAddress(address: Address): PolicyInfo | undefined {
  return Object.values(POLICIES).find(policy => policy.address === address)
}

/**
 * Individual policy address exports for backward compatibility
 */
export const VALUE_LIMIT_POLICY_ADDRESS = POLICIES[PolicyType.VALUE_LIMIT].address
export const USAGE_LIMIT_POLICY_ADDRESS = POLICIES[PolicyType.USAGE_LIMIT].address
export const SUDO_POLICY_ADDRESS = POLICIES[PolicyType.SUDO].address
export const SPENDING_LIMITS_POLICY_ADDRESS = POLICIES[PolicyType.SPENDING_LIMITS].address
export const TIME_FRAME_POLICY_ADDRESS = POLICIES[PolicyType.TIME_FRAME].address
export const UNIVERSAL_ACTION_POLICY_ADDRESS = POLICIES[PolicyType.UNIVERSAL_ACTION].address
