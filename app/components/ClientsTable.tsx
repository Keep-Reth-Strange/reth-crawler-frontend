"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData> {
  data: TData[];
}

export function ClientsTable<TData extends ClientDistribution>({ data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "count", desc: true }]);
  const columns: ColumnDef<ClientDistribution>[] = [
    {
      accessorKey: "client",
      header: "Client",
    },
    {
      accessorKey: "count",
      header: "Count",
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: true,
    enableSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const totalClients = data.reduce((total, client) => total + client.count, 0);

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-medium">Total</TableCell>
            <TableCell>{totalClients}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
