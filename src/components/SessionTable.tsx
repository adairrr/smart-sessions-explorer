import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import type { SessionDetails } from '../types/session'

const columnHelper = createColumnHelper<SessionDetails>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Session ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('target', {
    header: 'Target',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('selector', {
    header: 'Selector',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('validator', {
    header: 'Validator',
    cell: (info) => info.getValue(),
  }),
]

interface SessionTableProps {
  data: SessionDetails[]
}

export function SessionTable({ data }: SessionTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
