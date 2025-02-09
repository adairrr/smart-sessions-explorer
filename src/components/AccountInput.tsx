import { useState } from 'react'
import { isAddress } from 'viem'

interface AccountInputProps {
  onSubmit: (address: string) => void
}

export function AccountInput({ onSubmit }: AccountInputProps) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAddress(address)) {
      setError('Invalid address')
      return
    }
    setError('')
    onSubmit(address)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-lg">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter smart account address"
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Inspect Sessions
      </button>
    </form>
  )
}
