import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavouritesState {
  favouriteIds: string[];
  toggleFavourite: (listingId: string) => void;
  isFavourite: (listingId: string) => boolean;
  clearFavourites: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set) => ({
      favouriteIds: ['1', '3'], // Initial mock favourites for demo

      toggleFavourite: (listingId: string) => {
        set((state) => {
          const exists = state.favouriteIds.includes(listingId);
          return {
            favouriteIds: exists
              ? state.favouriteIds.filter((id) => id !== listingId)
              : [...state.favouriteIds, listingId],
          };
        });
      },

      isFavourite: (listingId: string) => {
        return false;
      },

      clearFavourites: () => {
        set({ favouriteIds: [] });
      },
    }),
    {
      name: 'campus_marketplace_favourites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectFavouriteIds = (state: FavouritesState) => state.favouriteIds;
export const selectIsFavourite = (listingId: string) => (state: FavouritesState) =>
  state.favouriteIds.includes(listingId);
export const selectFavouritesCount = (state: FavouritesState) =>
  state.favouriteIds.length;
