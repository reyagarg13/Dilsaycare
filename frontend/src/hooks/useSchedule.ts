import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScheduleAPI } from '../services/api';
import type { CreateSlotRequest, UpdateSlotRequest } from '../types';

// Query keys
export const QUERY_KEYS = {
  WEEK_SLOTS: 'weekSlots',
  HEALTH: 'health',
} as const;

// Hook to fetch week slots
export const useWeekSlots = (weekStartDate: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WEEK_SLOTS, weekStartDate],
    queryFn: () => ScheduleAPI.getSlotsForWeek(weekStartDate),
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

// Hook to create a new slot
export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSlotRequest) => ScheduleAPI.createSlot(data),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
  });
};

// Hook to update a slot for a specific date
export const useUpdateSlotForDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      scheduleId, 
      date, 
      data 
    }: { 
      scheduleId: number; 
      date: string; 
      data: UpdateSlotRequest; 
    }) => ScheduleAPI.updateSlotForDate(scheduleId, date, data),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
  });
};

// Hook to delete a slot for a specific date
export const useDeleteSlotForDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ scheduleId, date }: { scheduleId: number; date: string }) => 
      ScheduleAPI.deleteSlotForDate(scheduleId, date),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
  });
};

// Hook to delete entire schedule
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scheduleId: number) => ScheduleAPI.deleteSchedule(scheduleId),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
  });
};

// Hook for API health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.HEALTH],
    queryFn: () => ScheduleAPI.healthCheck(),
    staleTime: 60000, // 1 minute
    retry: false,
  });
};