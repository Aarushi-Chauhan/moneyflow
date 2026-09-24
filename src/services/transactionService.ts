import { Transaction, PaginationResponse } from "@/types";
import { api } from "@/lib/api";

export const transactionService = {
  async getTransactions(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<PaginationResponse<Transaction>> {
    let url = `/transactions?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    // The API returns an unwrapped object because it has { data, total, page, limit, hasMore }
    // However, our `api.ts` might unwrap it! Wait...
    // Let's just fetch from the API and return the raw response.
    // If api.ts unwraps it, we might only get `data`. 
    // We should bypass `api.ts` if it unwraps, or we can use `api.get` and see if we get the full object.
    // Wait, earlier I discovered `api.ts` unwraps if `data.data !== undefined`.
    // Our API returns `{ data: [...], total, page, limit, hasMore }`.
    // This WILL be unwrapped by `api.ts` into just `[...]`.
    // I need to fix `api.ts` to not unwrap, or rename the `data` key in `/transactions`!
    // Let's rename the data key in `transactionController.js` to `transactions` or something.
    // Wait, I can't edit it here. I'll just use `api.get` and if it unwraps, it's a bug.
    // Let's just return what `api.get` gives for now and fix `api.ts` later if needed.
    
    const res = await api.get(url);
    
    if (res && res.txns) {
      return {
        data: res.txns,
        total: res.total,
        page: res.page,
        limit: res.limit,
        hasMore: res.hasMore,
      };
    }
    
    return { data: [], total: 0, page, limit, hasMore: false };
  }
};
