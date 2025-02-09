import { Address } from 'viem'
import { match } from 'ts-pattern'
import { ValidatorDetails as ValidatorDetailsType } from '../../hooks/useValidatorDetails'
import { OwnableValidatorInfo } from './ValidatorInfo'
import { OWNABLE_VALIDATOR_ADDRESS } from '@rhinestone/module-sdk'

interface ValidatorDetailsProps {
  validator: ValidatorDetailsType
  accountAddress: Address
}

export function ValidatorDetails({ validator, accountAddress }: ValidatorDetailsProps) {
  const ValidatorInfo = match(validator.address)
    .with(OWNABLE_VALIDATOR_ADDRESS, () => (
      <OwnableValidatorInfo 
        validatorAddress={validator.address} 
        accountAddress={accountAddress} 
      />
    ))
    .otherwise(() => null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <div className="text-sm font-medium text-gray-500">Validator Name</div>
          <div className="mt-1">{validator.name}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <div className="text-sm font-medium text-gray-500">Version</div>
          <div className="mt-1">{validator.version}</div>
        </div>
        <div className="col-span-2 bg-gray-50 p-4 rounded">
          <div className="text-sm font-medium text-gray-500">Address</div>
          <div className="mt-1 font-mono text-sm break-all">{validator.address}</div>
        </div>
      </div>
      
      {ValidatorInfo && (
        <div className="bg-gray-50 p-4 rounded">
          {ValidatorInfo}
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded">
        <div className="text-sm font-medium text-gray-500">Config Data</div>
        <div className="mt-1 font-mono text-sm break-all">{validator.configData}</div>
      </div>
    </div>
  )
}
