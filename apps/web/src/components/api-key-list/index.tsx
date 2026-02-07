import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DotsThreeIcon, PenIcon, TrashIcon } from "@phosphor-icons/react";
import type { ApiKey } from "@yellow-rpc/schema";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BaseIcon, EthereumIcon, OptimismIcon } from "../icons";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "key",
    cell: ({ row }) => {
      const truncatedKey = `${row.original.maskedKey}...`;
      return truncatedKey;
    },
    header: "Token",
  },
  {
    accessorKey: "chain",
    cell: ({ row }) => {
      const chain = row.original.chain;
      const data = (() => {
        if (chain === "ethereum")
          return { icon: EthereumIcon, label: "Ethereum" } as const;
        if (chain === "optimism")
          return { icon: OptimismIcon, label: "Optimism" } as const;
        return { icon: BaseIcon, label: "Base" } as const;
      })();

      return (
        <div className="flex flex-row items-center gap-2">
          <data.icon className="size-6 rounded-full" />
          <span>{data.label}</span>
        </div>
      );
    },
    header: "Chain",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusText = (() => {
        if (status === "active")
          return { children: "Active", variant: "success" } as const;
        return { children: "Expired", variant: "destructive" } as const;
      })();

      return <Badge {...statusText} />;
    },
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return format(row.original.createdAt, "PPP");
    },
    header: "Created",
  },
  {
    accessorKey: "expiredAt",
    cell: ({ row }) => {
      return format(row.original.expiresAt, "PPP");
    },
    header: "Expires",
  },
  {
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button className="h-8 w-8 p-0" variant="ghost" />}
          >
            <span className="sr-only">Open menu</span>
            <DotsThreeIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <PenIcon />
                Edit API Key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                Delete API Key
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    id: "actions",
  },
];

type ApiKeyListProps = {
  apiKeys: ApiKey[];
};
export const ApiKeyList = ({ apiKeys }: ApiKeyListProps) => {
  const table = useReactTable({
    columns,
    data: apiKeys,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden">
      <Table className="overflow-hidden border-separate border-spacing-y-2">
        <TableHeader className="[&_th:first-child]:rounded-l-xl [&_th:last-child]:rounded-r-xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-muted border-none hover:bg-muted"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="px-4" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="[&_td:first-child]:rounded-l-xl [&_td:last-child]:rounded-r-xl"
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="px-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="h-24 text-center rounded-xl"
                colSpan={columns.length}
              >
                No API Keys found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
