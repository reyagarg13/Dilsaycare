import axios from 'axios';
import type { ApiResponse } from '../types';
import type { DaySlots, CreateSlotRequest, UpdateSlotRequest } from '../types';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ScheduleAPI {
  // Get slots for a specific week
  static async getSlotsForWeek(weekStartDate: string): Promise<DaySlots[]> {
    try {
      const response = await api.get<ApiResponse<DaySlots[]>>(`/slots/week/${weekStartDate}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch week slots:', error);
      throw new Error('Failed to fetch week slots');
    }
  }

  // Create a new recurring slot
  static async createSlot(data: CreateSlotRequest): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>('/slots', data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to create slot';
      throw new Error(message);
    }
  }

  // Update a slot for a specific date
  static async updateSlotForDate(
    scheduleId: number,
    date: string,
    data: UpdateSlotRequest
  ): Promise<any> {
    try {
      const response = await api.put<ApiResponse<any>>(`/slots/${scheduleId}/date/${date}`, data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update slot';
      throw new Error(message);
    }
  }

  // Delete a slot for a specific date
  static async deleteSlotForDate(scheduleId: number, date: string): Promise<void> {
    try {
      await api.delete(`/slots/${scheduleId}/date/${date}`);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to delete slot';
      throw new Error(message);
    }
  }

  // Delete entire recurring schedule
  static async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      await api.delete(`/slots/${scheduleId}`);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to delete schedule';
      throw new Error(message);
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default ScheduleAPI;