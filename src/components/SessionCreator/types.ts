import { z } from 'zod'
import { isAddress } from 'viem'
import { PolicyType } from '../../lib/constants'

const addressValidation = (value: string) => 
  isAddress(value, { strict: false }) || 'Invalid address'

export const actionSchema = z.object({
  actionTarget: z.string()
    .min(1, 'Target address is required')
    .refine(addressValidation, {
      message: 'Invalid target address',
    }),
  actionTargetSelector: z.string()
    .min(1, 'Function selector is required')
    .regex(/^0x[a-fA-F0-9]+$/, 'Invalid function selector format'),
  actionPolicies: z.array(z.nativeEnum(PolicyType))
    .min(1, 'At least one policy is required')
})

export const sessionFormSchema = z.object({
  sessionOwner: z.string()
    .min(1, 'Session owner address is required')
    .refine(addressValidation, {
      message: 'Invalid session owner address',
    }),
  actions: z.array(actionSchema)
    .min(1, 'At least one action is required')
})

export type SessionFormData = z.infer<typeof sessionFormSchema>
export type ActionFormData = z.infer<typeof actionSchema>
