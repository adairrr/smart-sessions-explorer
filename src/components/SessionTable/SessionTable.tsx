import { RefreshCcw } from 'lucide-react'
import { SessionRow } from './SessionRow'
import type { SessionData } from '../../types/session'
import { useQueryClient } from '@tanstack/react-query'

interface SessionTableProps {
  sessions: SessionData[]
  accountAddress: string
  isRefetching: boolean
}

export function SessionTable({ 
  sessions, 
  accountAddress, 
  isRefetching 
}: SessionTableProps) {
  const queryClient = useQueryClient()

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['sessions', accountAddress] })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Sessions</h2>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-gray-600">Disabled</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefetching}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
        >
          <RefreshCcw className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {sessions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enabled Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UserOp Policies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <SessionRow 
                  key={session.permissionId} 
                  session={session} 
                  accountAddress={accountAddress}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">
          No sessions found
        </p>
      )}
    </div>
  )
}
