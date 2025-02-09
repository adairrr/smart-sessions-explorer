import { useState } from 'react'
import { WalletConnector } from './components/WalletConnector'
import { AccountInput } from './components/AccountInput'
import { SessionTable } from './components/SessionTable/SessionTable'
import { SessionCreator } from './components/SessionCreator/SessionCreator'
import { useSessionDetails } from './hooks/useSessionDetails'
import { Address } from 'viem'

export function App() {
  const [accountAddress, setAccountAddress] = useState<Address | null>(null)
  const { 
    sessions, 
    isLoading, 
    isError, 
    isRefetching 
  } = useSessionDetails(accountAddress)

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">
            Smart Account Session Inspector
          </h1>
          <WalletConnector />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <AccountInput onSubmit={setAccountAddress} />
        </div>

        {accountAddress && (
          <SessionCreator smartAccountAddress={accountAddress} />
        )}

        {isLoading && (
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Loading sessions...</p>
          </div>
        )}

        {isError && (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-red-500">Error loading sessions</p>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <SessionTable 
              sessions={sessions}
              accountAddress={accountAddress!} 
              isRefetching={isRefetching}
            />
          </div>
        )}
      </div>
    </div>
  )
}
