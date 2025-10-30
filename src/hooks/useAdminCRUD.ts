import { useCallback, useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { ApiResponse } from '@/types';

interface UseCRUDOptions<T> {
  endpoint: string;
  onSuccess?: (data: T | T[]) => void;
  onError?: (error: Error) => void;
}

interface UseCRUDReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  createItem: (item: Omit<T, 'id'>) => Promise<T | null>;
  updateItem: (id: string, item: Partial<T>) => Promise<T | null>;
  deleteItem: (id: string) => Promise<boolean>;
  setData: (data: T[]) => void;
  clearError: () => void;
}

export const useAdminCRUD = <T extends { id: string }>(
  options: UseCRUDOptions<T>
): UseCRUDReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get<T[] | ApiResponse<T[]>>(
        `/${options.endpoint}/`
      );

      // Handle both response formats: T[] or ApiResponse<T[]>
      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setData(dataArray);
      options.onSuccess?.(dataArray);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      options.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const createItem = useCallback(
    async (item: Omit<T, 'id'>): Promise<T | null> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await axiosClient.post<T | ApiResponse<T>>(
          `/${options.endpoint}/`,
          item
        );

        // Handle both response formats: T or ApiResponse<T>
        const newItem = (response.data as any).data || response.data;

        if (newItem && newItem.id) {
          setData((prev) => [...prev, newItem as T]);
          options.onSuccess?.(newItem);
          return newItem as T;
        }
        return null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const updateItem = useCallback(
    async (id: string, item: Partial<T>): Promise<T | null> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await axiosClient.put<T | ApiResponse<T>>(
          `/${options.endpoint}/${id}/`,
          item
        );

        // Handle both response formats: T or ApiResponse<T>
        const updatedItem = (response.data as any).data || response.data;

        if (updatedItem && updatedItem.id) {
          setData((prev) =>
            prev.map((existing) =>
              existing.id === id ? updatedItem as T : existing
            )
          );
          options.onSuccess?.(updatedItem);
          return updatedItem as T;
        }
        return null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        setIsLoading(true);

        await axiosClient.delete(`/${options.endpoint}/${id}/`);
        setData((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    setData,
    clearError,
  };
};
