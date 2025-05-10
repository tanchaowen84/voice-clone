'use client';

import { getUsersAction } from '@/actions/get-users';
import type { User } from '@/components/admin/users-table';
import { UsersTable } from '@/components/admin/users-table';
import type { SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function UsersPageClient() {
  const t = useTranslations();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getUsersAction({
          pageIndex,
          pageSize,
          search,
          sorting,
        });

        if (result?.data?.success) {
          setData(result.data.data?.items || []);
          setTotal(result.data.data?.total || 0);
        } else {
          const errorMessage = result?.data?.error || 'Failed to fetch users';
          toast.error(errorMessage);
          setData([]);
          setTotal(0);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('An unexpected error occurred while fetching users');
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageIndex, pageSize, search, sorting]);

  return (
    <>
      <UsersTable
        data={data}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        search={search}
        loading={loading}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        onSortingChange={setSorting}
      />
    </>
  );
}
