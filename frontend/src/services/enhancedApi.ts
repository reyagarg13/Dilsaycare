import axios from 'axios';
import type { ApiResponse, DaySlots, CreateSlotRequest, UpdateSlotRequest } from '../types';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    
    // Create a more user-friendly error message
    let errorMessage = 'Something went wrong. Please try again.';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please check your connection.';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const serverMessage = error.response.data?.error?.message || error.response.data?.message;
      
      switch (status) {
        case 400:
          errorMessage = serverMessage || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in.';
          break;
        case 403:
          errorMessage = 'Access denied. You don\'t have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = serverMessage || `Request failed with status ${status}`;
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    }
    
    // Create a new error with the user-friendly message
    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name;
    enhancedError.cause = error;
    
    return Promise.reject(enhancedError);
  }
);

// Retry utility function
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries + 1} in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

export class ScheduleAPI {
  // Get slots for a specific week with retry mechanism
  static async getSlotsForWeek(weekStartDate: string): Promise<DaySlots[]> {
    try {
      const response = await withRetry(async () => {
        return await api.get<ApiResponse<DaySlots[]>>(`/slots/week/${weekStartDate}`);
      });
      
      // Handle the API response format correctly
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch week slots:', error);
      throw error; // Re-throw the enhanced error from interceptor
    }
  }

  // Create a new recurring slot with retry
  static async createSlot(data: CreateSlotRequest): Promise<any> {
    try {
      const response = await withRetry(async () => {
        return await api.post<ApiResponse<any>>('/slots', data);
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create slot');
      }
    } catch (error) {
      console.error('Failed to create slot:', error);
      throw error;
    }
  }

  // Update a slot for a specific date with retry
  static async updateSlotForDate(
    scheduleId: number,
    date: string,
    data: UpdateSlotRequest
  ): Promise<any> {
    try {
      const response = await withRetry(async () => {
        return await api.put<ApiResponse<any>>(`/slots/${scheduleId}/date/${date}`, data);
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update slot');
      }
    } catch (error) {
      console.error('Failed to update slot:', error);
      throw error;
    }
  }

  // Delete a slot for a specific date with retry
  static async deleteSlotForDate(scheduleId: number, date: string): Promise<void> {
    try {
      await withRetry(async () => {
        return await api.delete(`/slots/${scheduleId}/date/${date}`);
      });
    } catch (error) {
      console.error('Failed to delete slot:', error);
      throw error;
    }
  }

  // Delete entire recurring schedule with retry
  static async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      await withRetry(async () => {
        return await api.delete(`/slots/${scheduleId}`);
      });
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      throw error;
    }
  }

  // Health check with timeout and no retries
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return response.data.success === true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Manual retry function for components to use
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    return withRetry(operation, maxRetries);
  }
}

export default ScheduleAPI;