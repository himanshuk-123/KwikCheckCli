import { create } from 'zustand';
import { AppStepListDataRecord } from '../types';
import { fetchAppStepListApi } from '../api/valuation.api';

interface ValuationState {
  steps: AppStepListDataRecord[];
  isLoading: boolean;
  error: string | null;
  fetchSteps: (leadId: string) => Promise<void>;
  reset: () => void;
}

export const useValuationStore = create<ValuationState>((set) => ({
  steps: [],
  isLoading: false,
  error: null,

  fetchSteps: async (leadId: string) => {
    set({ isLoading: true, error: null, steps: [] });
    try {
      const data = await fetchAppStepListApi(leadId);
      set({ steps: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch steps', isLoading: false });
    }
  },

  reset: () => {
    set({ steps: [], isLoading: false, error: null });
  }
}));
