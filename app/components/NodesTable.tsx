import type { ColumnDef, SortingState, PaginationState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRef, useState } from "react";
import { useVirtual } from "react-virtual";

interface DataTableProps<TData> {
  data: TData[];
}

export function NodesTable<TData extends NodeRecord>({ data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "count", desc: true }]);
  const columns: ColumnDef<NodeRecord>[] = [
    {
      accessorKey: "enode_url",
      header: "Enode URL",
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "tcp_port",
      header: "TCP Port",
    },
    {
      accessorKey: "client_version",
      header: "Client Version",
    },
    {
      accessorKey: "eth_version",
      header: "ETH Version",
    },
    {
      accessorKey: "capabilities",
      header: "Capabilities",
    },
    {
      accessorKey: "chain",
      header: "Chain",
    },
    {
      accessorKey: "total_difficulty",
      header: "Total Difficulty",
    },
    {
      accessorKey: "best_block",
      header: "Best Block",
    },
    {
      accessorKey: "genesis_block_hash",
      header: "Genesis Block Hash",
    },
    {
      accessorKey: "last_seen",
      header: "Last Seen",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "city",
      header: "City",
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    sortDescFirst: true,
    enableSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  return (
    <div className="rounded-md border mt-4" ref={tableContainerRef}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-medium">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {paddingTop > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingTop}px` }} />
            </TableRow>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center gap-2">
        <button className="border rounded p-1" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {"<<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
    </div>
  );
}
