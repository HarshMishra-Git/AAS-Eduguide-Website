import { QueryClient, QueryFunction } from "@tanstack/react-query";

interface ApiError {
  status: number;
  message: string;
  errors?: any[];
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData: ApiError;
    try {
      const jsonError = await res.json();
      errorData = {
        status: res.status,
        message: jsonError.message || res.statusText,
        errors: jsonError.errors
      };
    } catch {
      errorData = {
        status: res.status,
        message: res.statusText || 'Unknown error'
      };
    }
    const error = new Error(errorData.message) as Error & ApiError;
    error.status = errorData.status;
    error.errors = errorData.errors;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
