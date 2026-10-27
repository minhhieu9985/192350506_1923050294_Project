import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '../services/api/mockApi';
import { Listing } from '../types';

export const LISTINGS_QUERY_KEY = ['listings'];

export function useListings() {
  return useQuery<Listing[], Error>({
    queryKey: LISTINGS_QUERY_KEY,
    queryFn: mockApi.fetchListings,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useListingDetail(id: string) {
  return useQuery<Listing | null, Error>({
    queryKey: ['listing', id],
    queryFn: () => mockApi.fetchListingById(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newListing: Omit<Listing, 'id' | 'createdAt'>) =>
      mockApi.createListing(newListing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEY });
    },
  });
}

export function useUpdateStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      mockApi.updateStock(id, stock),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEY });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['listing', data.id] });
      }
    },
  });
}
