import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import type { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import copy from "copy-to-clipboard";
import { formatISO9075 } from "date-fns";
import * as React from "react";
import { useRef } from "react";
import { useVirtual } from "react-virtual";

interface DataTableProps<TData> {
  data: TData[];
}

export function NodesTable<TData extends NodeRecord>({ data }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "count", desc: true }]);
  const { toast } = useToast();
  const columns: ColumnDef<NodeRecord>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info: unknown) => {
        const infoCasted = info as CellContext<NodeRecord, string>;
        return (
          <Link to={`/node/${infoCasted.getValue()}`}>
            <span>{infoCasted.getValue().substring(0, 10)}...</span>
          </Link>
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Host
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "country",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newSort = column.getIsSorted() === "asc" ? "desc" : "asc";
              return setSorting([{ id: "country", desc: newSort === "desc" }]);
            }}
          >
            Country
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "client_version",
      accessorFn: (row: NodeRecord) => row.client_version,
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Client
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info: unknown) => {
        const infoCasted = info as CellContext<NodeRecord, string>;
        return <p>{infoCasted.getValue().split("/")[0]}</p>;
      },
    },
    {
      accessorKey: "client_version",
      accessorFn: (row: NodeRecord) => row.client_version,
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Version
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info: unknown) => {
        const infoCasted = info as CellContext<NodeRecord, string>;
        const value = infoCasted.getValue();
        if (value) {
          const parts = value.split("/");
          if (parts[1]) {
            return <p>{parts[1].split("-")[0].slice(1)}</p>;
          }
        }
        return <p></p>;
      },
    },
    {
      accessorKey: "client_version",
      accessorFn: (row: NodeRecord) => row.client_version,
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            OS
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info: unknown) => {
        const infoCasted = info as CellContext<NodeRecord, string>;
        const value = infoCasted.getValue();
        if (value) {
          const parts = value.split("/");
          if (parts[2]) {
            return <p>{parts[2].split("-")[0].replace(/^\w/, (c) => c.toUpperCase())}</p>;
          }
        }
        return <p></p>;
      },
    },
    {
      accessorKey: "last_seen",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last Seen
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info: unknown) => {
        const infoCasted = info as CellContext<NodeRecord, string>;
        return <p>{formatISO9075(new Date(infoCasted.getValue().split('.')[0].replace(' ', 'T')), { representation: "date" })}</p>;
      },
    },
    {
      accessorKey: "actions",
      header: () => null,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center">
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const host = window.location.host;
                const id = row.getValue("id");
                const link = `https://${host}/node/${id}`;
                copy(link);
                toast({
                  title: "Link copied to clipboard",
                });
              }}
            >
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getPaginationRowModel: getPaginationRowModel(),
    enableGlobalFilter: true,
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
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div id="top-bar" className="flex items-center gap-2">
          <Input
            placeholder="Search"
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div id="pagination" className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center space-x-4">
            <div className="flex-shrink-0">Go to page</div>
            <Input
              type="number"
              min={1}
              max={table.getPageCount()}
              onChange={(event) => {
                const pageNumber = event.target.value ? Number(event.target.value) - 1 : 0;
                table.setPageIndex(pageNumber);
              }}
              className="max-w-sm"
            />
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-9"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-9"
          >
            Next
          </Button>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="border p-2 rounded mr-4 w-[250px]">
              <SelectValue placeholder="Show X" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, i) => (
            <TableRow key={`header-${i}`}>
              {headerGroup.headers.map((header, j) => (
                <TableHead key={`head-${header.id}-${j}`} className="font-medium">
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
          {virtualRows.map((virtualRow, i) => {
            const row = rows[virtualRow.index];
            return (
              <TableRow key={`row-${row.id}-${i}`} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, j) => (
                  <TableCell key={`cell-${cell.id}-${i}-${j}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <div className="p-2">{data?.length} Total Nodes</div>
    </div>
  );
}
