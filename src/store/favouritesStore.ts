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
    (set, get) => ({
      favouriteIds: ['1', '3'], // Initial mock favourites for demo

      toggleFavourite: (listingId: string) => {
        const current = get().favouriteIds;
        const exists = current.includes(listingId);
        if (exists) {
          set({ favouriteIds: current.filter((id) => id !== listingId) });
        } else {
          set({ favouriteIds: [...current, listingId] });
        }
      },

      isFavourite: (listingId: string) => {
        return get().favouriteIds.includes(listingId);
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
