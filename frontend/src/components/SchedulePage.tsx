import React, { useState } from 'react';
import { 
  Menu, 
  Plus,
  Trash2,
  Home,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui';
import { 
  getCurrentWeekStart
} from '../utils/dateUtils';
import { 
  useWeekSlots
} from '../hooks/useEnhancedSchedule';
import type { Slot, DaySlots } from '../types';

// Mock data that matches the design (Tuesday-Sunday from the image)
const mockWeekData: DaySlots[] = [
  {
    date: '2025-09-02', // Tuesday
    slots: []
  },
  {
    date: '2025-09-03', // Wednesday
    slots: []
  },
  {
    date: '2025-09-04', // Thursday
    slots: []
  },
  {
    date: '2025-09-05', // Friday
    slots: []
  },
  {
    date: '2025-09-06', // Saturday
    slots: []
  },
  {
    date: '2025-09-07', // Sunday
    slots: []
  }
];
// Example: If you want to add a slot, make sure to include is_exception (and optionally schedule_id/exception_id):
// slots: [{ id: 1, start_time: '09:00', end_time: '10:00', is_exception: false }]

// Mobile Calendar Component
const MobileCalendar: React.FC = () => {
  return (
    <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-950/20 p-4">
      {/* Calendar grid headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar dates - exactly matching the image */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Previous month date */}
        <div className="text-center text-sm text-gray-400 py-2">31</div>
        
        {/* September 2025 dates */}
        <div className="text-center text-sm text-gray-900 py-2 font-medium">1</div>
        <div className="text-center text-sm py-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold mx-auto">
            2
          </div>
        </div>
        <div className="text-center text-sm text-gray-900 py-2 font-medium">3</div>
        <div className="text-center text-sm text-gray-900 py-2 font-bold">4</div>
        <div className="text-center text-sm text-gray-900 py-2 font-medium">5</div>
        <div className="text-center text-sm text-gray-900 py-2 font-medium">6</div>
      </div>
      
      {/* Month selector */}
      <div className="text-center">
        <button className="flex items-center justify-center text-sm font-medium text-gray-900 mx-auto">
          September 2025
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Day Schedule Card Component
interface DayCardProps {
  date: string;
  slots: Slot[];
  onAddSlot: (date: string) => void;
  onEditSlot: (slot: Slot, date: string) => void;
  isToday?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ date, slots, onAddSlot, onEditSlot, isToday }) => {
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = new Date(date).getDate().toString().padStart(2, '0');
  const monthName = new Date(date).toLocaleDateString('en-US', { month: 'short' });
  
  return (
    <div className="bg-white border-b border-gray-950/10 px-4 py-4">
      <div className="flex items-center">
        {/* Left: Date info */}
        <div className="flex-shrink-0 w-20">
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {dayName}, {dayNumber}
          </div>
          <div className="text-sm text-gray-500">{monthName}</div>
          {isToday && (
            <div className="text-xs text-blue-600 font-medium">(Today)</div>
          )}
        </div>
        
        {/* Center: Time input */}
        <div className="flex-1 mx-4">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onEditSlot(slot, date)}
                className="w-full text-left px-4 py-2 bg-gray-50 border border-gray-950/20 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                {slot.start_time} - {slot.end_time}
              </button>
            ))
          ) : (
            <button
              onClick={() => onAddSlot(date)}
              className="w-full text-left px-4 py-2 bg-gray-50 border border-gray-950/20 rounded-lg text-sm text-gray-500"
            >
              00:00 - 00:00
            </button>
          )}
        </div>
        
        {/* Right: Action buttons */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          <button
            onClick={() => onAddSlot(date)}
            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          {slots.length > 0 && (
            <button className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-full flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Layout Component
const MobileScheduleLayout: React.FC<{
  weekData: DaySlots[];
  onAddSlot: (date: string) => void;
  onEditSlot: (slot: Slot, date: string) => void;
}> = ({ weekData, onAddSlot, onEditSlot }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-950/20 px-4 py-3 flex items-center justify-between">
        <button className="p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">Your Schedule</h1>
        
        <Button variant="secondary" className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-700">
          Save
        </Button>
      </header>

      {/* Calendar Widget */}
      <MobileCalendar />

      {/* Day Schedule Cards */}
      <div className="mt-4">
        {weekData.map((dayData) => (
          <DayCard
            key={dayData.date}
            date={dayData.date}
            slots={dayData.slots}
            onAddSlot={onAddSlot}
            onEditSlot={onEditSlot}
            isToday={dayData.date === today}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-950/20">
        <div className="grid grid-cols-2">
          <button className="flex flex-col items-center justify-center py-3 text-gray-400">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3 text-blue-600">
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Schedule</span>
          </button>
        </div>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export const SchedulePage: React.FC = () => {
  const [currentWeekStart] = useState(getCurrentWeekStart());

  // API hooks
  const { 
    data: weekData, 
    isLoading, 
    error
  } = useWeekSlots(currentWeekStart);

  // Handlers
  const handleEditSlot = (slot: Slot, date: string) => {
    console.log('Edit slot:', slot, date);
    // TODO: Implement edit functionality
  };

  const handleAddSlot = (date: string) => {
    console.log('Add slot for date:', date);
    // TODO: Implement add functionality
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Schedule</h3>
          <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  // Use mock data if API data is not available
  const displayData = weekData && weekData.length > 0 ? weekData : mockWeekData;

  return (
    <MobileScheduleLayout
      weekData={displayData}
      onAddSlot={handleAddSlot}
      onEditSlot={handleEditSlot}
    />
  );
};

export default SchedulePage;