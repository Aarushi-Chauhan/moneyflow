import { useState, useEffect, useCallback, useRef } from "react";
import { Transaction } from "@/types";
import { transactionService } from "@/services/transactionService";

export function useInfiniteTransactions(initialLimit = 20) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [search, setSearch] = useState("");
  const isInitialMount = useRef(true);

  const fetchTransactions = useCallback(async (currentPage: number, currentSearch: string, isRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransactions(currentPage, initialLimit, currentSearch);
      
      setTransactions(prev => isRefresh ? response.data : [...prev, ...response.data]);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch transactions"));
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  useEffect(() => {
    fetchTransactions(1, search, true);
  }, [search, fetchTransactions]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage, search);
    }
  }, [loading, hasMore, page, search, fetchTransactions]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchTransactions(1, search, true);
  }, [search, fetchTransactions]);

  return {
    transactions,
    hasMore,
    loading,
    error,
    loadMore,
    setSearch,
    refresh
  };
}
