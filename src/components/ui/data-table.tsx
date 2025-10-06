"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  loading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  showColumnVisibility?: boolean
  showPagination?: boolean
  pageSize?: number
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  loading = false,
  emptyMessage = "No results found",
  emptyDescription = "Try adjusting your search or filters",
  showColumnVisibility = true,
  showPagination = true,
  pageSize = 10,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className={cn("space-y-4 fade-in", className)}>
      {/* Screen reader announcement for search results - WCAG 4.1.3 */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {table.getFilteredRowModel().rows.length} results found
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pl-9 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
          </div>
        )}

        {/* Column visibility */}
        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px] bg-slate-900 border-slate-800">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-slate-300 focus:bg-slate-800 focus:text-white"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table - Mobile-safe horizontal scroll */}
      <div className="rounded-lg border border-slate-800/50 overflow-hidden bg-slate-900/30">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <div className="inline-block min-w-full align-middle">
            <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm font-medium text-slate-300">
                      {emptyMessage}
                    </p>
                    <p className="text-sm text-slate-500">
                      {emptyDescription}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && !loading && table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-slate-400">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-slate-300">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
