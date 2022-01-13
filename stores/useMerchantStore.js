import create from "zustand";

import {
  getCategories,
  getRecommended,
  getSearchResults,
  getMerchant,
  getStore,
} from "services";
import { alerts } from "utils/global-texts";

const [useMerchantStore] = create((set, get) => ({
  isLoading: {
    categories: false,
    recommended: false,
    searchResults: false,
    merchant: false,
    store: false,
  },
  response: {
    categories: null,
    recommended: null,
    searchResults: null,
    merchant: null,
    store: null,
  },
  errors: {
    categories: null,
    recommended: null,
    searchResults: null,
    merchant: null,
    store: null,
  },
  // might not necessarily be a "refresh"
  refreshMerchantStates: () => {
    return {
      ...get(),
    };
  },
  resetStates: (dataType) => {
    set({
      isLoading: { ...get().isLoading, [dataType]: false },
      response: { ...get().response, [dataType]: null },
      errors: { ...get().errors, [dataType]: null },
    });
  },
  fetchSearchResults: async (searchTerm, category, countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, searchResults: true } });
      const res = await getSearchResults(searchTerm, category, countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, searchResults: false },
          response: { ...get().response, searchResults: res.data },
          errors: { ...get().errors, searchResults: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, searchResults: false },
          response: { ...get().response, searchResults: null },
          errors: { ...get().errors, searchResults: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, searchResults: false },
        response: { ...get().response, searchResults: null },
        errors: {
          ...get().errors,
          searchResults: err?.response?.data?.error ?? alerts.genericError,
        },
      });

      throw err;
    }
  },
  fetchCategories: async () => {
    try {
      set({ isLoading: { ...get().isLoading, categories: true } });
      const res = await getCategories();

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, categories: false },
          response: { ...get().response, categories: res.data },
          errors: { ...get().errors, categories: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, categories: false },
          response: { ...get().response, categories: null },
          errors: { ...get().errors, categories: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, categories: false },
        response: { ...get().response, categories: null },
        errors: { ...get().errors, categories: err.response.data.error },
      });

      throw err;
    }
  },
  fetchRecommended: async (countryCode) => {
    try {
      set({ isLoading: { ...get().isLoading, recommended: true } });
      const res = await getRecommended(countryCode);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, recommended: false },
          response: { ...get().response, recommended: res.data },
          errors: { ...get().errors, recommended: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, recommended: false },
          response: { ...get().response, recommended: null },
          errors: { ...get().errors, recommended: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, recommended: false },
        response: { ...get().response, recommended: null },
        errors: { ...get().errors, recommended: err.response.data.error },
      });

      throw err;
    }
  },
  fetchMerchant: async (slug) => {
    try {
      set({ isLoading: { ...get().isLoading, merchant: true } });
      const res = await getMerchant(slug);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, merchant: false },
          response: { ...get().response, merchant: res.data },
          errors: { ...get().errors, merchant: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, merchant: false },
          response: { ...get().response, merchant: null },
          errors: { ...get().errors, merchant: res.error },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, merchant: false },
        response: { ...get().response, merchant: null },
        errors: { ...get().errors, merchant: err.response.data.error },
      });

      throw err;
    }
  },
  fetchStore: async (storeId) => {
    try {
      set({ isLoading: { ...get().isLoading, store: true } });

      const res = await getStore(storeId);

      if (res.success) {
        set({
          isLoading: { ...get().isLoading, store: false },
          response: { ...get().response, store: res.data },
          errors: { ...get().errors, store: null },
        });
      } else {
        set({
          isLoading: { ...get().isLoading, store: false },
          response: { ...get().response, store: null },
          errors: {
            ...get().errors,
            store: res?.error ?? res?.message ?? alerts.genericError,
          },
        });
      }
    } catch (err) {
      set({
        isLoading: { ...get().isLoading, store: false },
        response: { ...get().response, store: null },
        errors: {
          ...get().errors,
          store: {
            code: err?.code ?? null,
            data: err?.response?.data ?? err?.message ?? alerts.genericError,
          },
        },
      });

      throw err;
    }
  },
}));

export default useMerchantStore;
