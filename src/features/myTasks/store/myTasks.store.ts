import { create } from 'zustand';
import { fetchMyTasksApi } from '../api/myTasks.api';
import { LeadListStatuswiseRespDataRecord } from '../types';
import { VEHICLE_TYPE_LIST_MAPPING } from '../../../constants';

interface MyTasksState {
  // Data State
  countsByVehicle: Record<string, number>;
  tasks: LeadListStatuswiseRespDataRecord[];

  // UI State
  currentVehicle: string;
  pageNumber: number;
  pageSize: number;

  // Status State
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>; // Fetches ALL to count, then triggers first page
  setVehicle: (vehicleType: string) => void;
  setPage: (page: number) => void;
  fetchPaginatedTasks: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_PAGE_SIZE = 10;
const INITIAL_VEHICLE = "2W";

export const useMyTasksStore = create<MyTasksState>((set, get) => ({
  countsByVehicle: {},
  tasks: [],
  currentVehicle: INITIAL_VEHICLE,
  pageNumber: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  isLoading: false,
  isInitializing: false,
  error: null,

  reset: () => set({
    tasks: [],
    isLoading: true,
    error: null,
    countsByVehicle: {},
    pageNumber: 1,
    currentVehicle: INITIAL_VEHICLE
  }),

  initialize: async () => {
    set({ isInitializing: true, error: null });
    try {
      // 1. Fetch ALL records (no pagination)
      const response = await fetchMyTasksApi();

      if (response.Error !== '0') {
        set({ error: response.MESSAGE || 'Init failed', isInitializing: false });
        return;
      }

      const allData = response.DataRecord || [];

      // 2. Compute Counts per Vehicle Type
      const counts: Record<string, number> = {};
      allData.forEach((item) => {
        // Map API vehicle type to UI key (e.g., 1 -> "2W")
        const mappedType = VEHICLE_TYPE_LIST_MAPPING[item.VehicleType.toString()];
        if (mappedType && typeof mappedType === 'string') {
          counts[mappedType] = (counts[mappedType] || 0) + 1;
        }
      });

      set({ countsByVehicle: counts, isInitializing: false });

      // 3. Trigger initial fetch for default vehicle
      get().fetchPaginatedTasks();

    } catch (error: any) {
      set({ error: error.message, isInitializing: false });
    }
  },

  setVehicle: (vehicleType: string) => {
    set({ currentVehicle: vehicleType, pageNumber: 1, tasks: [], isLoading: true });
    get().fetchPaginatedTasks();
  },

  setPage: (page: number) => {
    set({ pageNumber: page });
    get().fetchPaginatedTasks();
  },

  fetchPaginatedTasks: async () => {
    const { currentVehicle, pageNumber, pageSize } = get();
    set({ isLoading: true, error: null });

    try {
      // Get mapped API value for vehicle (e.g., "2W" -> 1)
      const apiVehicleType = VEHICLE_TYPE_LIST_MAPPING[currentVehicle];

      const response = await fetchMyTasksApi(
        pageNumber,
        pageSize,
        apiVehicleType?.toString()
      );

      if (response.Error !== '0') {
        set({ error: response.MESSAGE || 'Fetch failed', isLoading: false });
        return;
      }

      set({
        tasks: response.DataRecord || [],
        isLoading: false
      });

    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
