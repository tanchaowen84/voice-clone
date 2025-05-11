'use client';

import { banUserAction } from '@/actions/ban-user';
import { unbanUserAction } from '@/actions/unban-user';
import { UserDetailViewer } from '@/components/admin/user-detail-viewer';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/formatter';
import { getStripeDashboardCustomerUrl } from '@/lib/urls/urls';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MailCheckIcon,
  MailQuestionIcon,
  MoreVerticalIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: any;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="cursor-pointer flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {title}
        <ArrowUpDownIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  createdAt: Date;
  updatedAt: Date;
  customerId: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <UserDetailViewer
          user={user}
          onBan={async (userId, reason, expiresAt) => {
            const result = await banUserAction({ userId, reason, expiresAt });
            if (!result) {
              throw new Error('Failed to ban user');
            }
            if (result.validationErrors) {
              throw new Error(
                Object.values(result.validationErrors).join(', ')
              );
            }
            if (result.serverError) {
              throw new Error(result.serverError);
            }
            return result;
          }}
          onUnban={async (userId) => {
            const result = await unbanUserAction({ userId });
            if (!result) {
              throw new Error('Failed to unban user');
            }
            if (result.validationErrors) {
              throw new Error(
                Object.values(result.validationErrors).join(', ')
              );
            }
            if (result.serverError) {
              throw new Error(result.serverError);
            }
            return result;
          }}
        />
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 pl-3">
          <Badge
            variant="outline"
            className="text-sm px-1.5 cursor-pointer hover:bg-accent"
            onClick={() => {
              navigator.clipboard.writeText(user.email);
              toast.success('Email copied to clipboard');
            }}
          >
            {user.emailVerified ? (
              <MailCheckIcon className="stroke-green-500 dark:stroke-green-400" />
            ) : (
              <MailQuestionIcon className="stroke-red-500 dark:stroke-red-400" />
            )}
            {user.email}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const role = user.role || 'user';
      return (
        <div className="flex items-center gap-2 pl-3">
          <Badge
            variant={role === 'admin' ? 'default' : 'outline'}
            className="px-1.5"
          >
            {role}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 pl-3">
          {formatDate(user.createdAt)}
        </div>
      );
    },
  },
  {
    accessorKey: 'customerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer ID" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 pl-3">
          {user.customerId ? (
            <a
              href={getStripeDashboardCustomerUrl(user.customerId)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:underline-offset-4"
            >
              {user.customerId}
            </a>
          ) : (
            '-'
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'banned',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 pl-3">
          <Badge variant="outline" className="px-1.5 hover:bg-accent">
            {user.banned ? (
              <UserRoundXIcon className="stroke-red-500 dark:stroke-red-400" />
            ) : (
              <UserRoundCheckIcon className="stroke-green-500 dark:stroke-green-400" />
            )}
            {user.banned ? 'Banned' : 'Active'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'banReason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ban Reason" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 pl-3">
          {user.banReason || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'banExpires',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ban Expires" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2 pl-3">
          {user.banExpires ? formatDate(user.banExpires) : '-'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {user.banned ? (
              <DropdownMenuItem className="cursor-pointer">
                Unban User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="cursor-pointer">
                Ban User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface UsersTableProps {
  data: User[];
  total: number;
  pageIndex: number;
  pageSize: number;
  search: string;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (search: string) => void;
  onSortingChange?: (sorting: SortingState) => void;
}

/**
 * https://ui.shadcn.com/docs/components/data-table
 */
export function UsersTable({
  data,
  total,
  pageIndex,
  pageSize,
  search,
  loading,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSortingChange,
}: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater;
      if (next.pageIndex !== pageIndex) onPageChange(next.pageIndex);
      if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="w-full flex-col justify-start gap-6 space-y-4">
      <div className="flex items-center justify-between px-4 lg:px-6 gap-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(event) => {
            onSearch(event.target.value);
            onPageChange(0);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              {/* <IconLayoutColumns /> */}
              <span className="inline">Columns</span>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {/* empty here for now */}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  onPageSizeChange(Number(value));
                  onPageChange(0);
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="w-20 cursor-pointer"
                  id="rows-per-page"
                >
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {pageIndex + 1} of {Math.max(1, Math.ceil(total / pageSize))}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="cursor-pointer hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(0)}
                disabled={pageIndex === 0}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer size-8"
                size="icon"
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer size-8"
                size="icon"
                onClick={() => onPageChange(pageIndex + 1)}
                disabled={pageIndex + 1 >= Math.ceil(total / pageSize)}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer hidden size-8 lg:flex"
                size="icon"
                onClick={() =>
                  onPageChange(Math.max(0, Math.ceil(total / pageSize) - 1))
                }
                disabled={pageIndex + 1 >= Math.ceil(total / pageSize)}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
