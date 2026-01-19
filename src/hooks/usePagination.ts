import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total_count: number;
  [key: string]: unknown;
};

type PaginationOptions = {
  defaultPerPage?: number;
  pageParam?: string;
  perPageParam?: string;
  windowSize?: number;
  syncOnInit?: boolean;
};

const parsePositiveInt = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

export const usePagination = (options: PaginationOptions = {}) => {
  const {
    defaultPerPage = 30,
    pageParam = 'page',
    perPageParam = 'per_page',
    windowSize = 5,
    syncOnInit = true,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInt(searchParams.get(pageParam), 1);
  const perPage = parsePositiveInt(searchParams.get(perPageParam), defaultPerPage);
  const [meta, setMetaState] = useState<PaginationMeta | null>(null);

  useEffect(() => {
    if (!syncOnInit) return;

    const pageRaw = searchParams.get(pageParam);
    const perPageRaw = searchParams.get(perPageParam);
    const shouldSync =
      pageRaw !== String(page) ||
      perPageRaw !== String(perPage);

    if (!shouldSync) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(pageParam, String(page));
      next.set(perPageParam, String(perPage));
      return next;
    });
  }, [page, perPage, pageParam, perPageParam, searchParams, setSearchParams, syncOnInit]);

  const updateParams = useCallback(
    (nextPage?: number, nextPerPage?: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextPage !== undefined) {
          next.set(pageParam, String(nextPage));
        }
        if (nextPerPage !== undefined) {
          next.set(perPageParam, String(nextPerPage));
        }
        return next;
      });
    },
    [pageParam, perPageParam, setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => updateParams(Math.max(1, nextPage), undefined),
    [updateParams],
  );

  const setPerPage = useCallback(
    (nextPerPage: number) => updateParams(1, Math.max(1, nextPerPage)),
    [updateParams],
  );

  const setMeta = useCallback((nextMeta: PaginationMeta | null) => {
    setMetaState(nextMeta);
  }, []);

  const adjustTotalCount = useCallback((delta: number) => {
    setMetaState((prev) => {
      if (!prev) return prev;
      const nextTotal = Math.max(0, prev.total_count + delta);
      return { ...prev, total_count: nextTotal };
    });
  }, []);

  const totalCount = meta?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const visiblePages = useMemo(() => {
    const safeWindow = Math.max(1, windowSize);
    const half = Math.floor(safeWindow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + safeWindow - 1);

    if (end - start + 1 < safeWindow) {
      start = Math.max(1, end - safeWindow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [page, totalPages, windowSize]);

  return {
    page,
    perPage,
    meta,
    totalCount,
    totalPages,
    canGoPrev,
    canGoNext,
    visiblePages,
    setPage,
    setPerPage,
    setMeta,
    adjustTotalCount,
  };
};
