import React, { useState, useCallback } from 'react';
import { Button } from '../ui';
import { CreateSlotModal } from './CreateSlotModal';
import { EditSlotModal } from './EditSlotModal';
import { 
  getCurrentWeekStart
} from '../../utils/dateUtils';
import { 
  useWeekSlots, 
  useCreateSlot, 
  useUpdateSlotForDate, 
  useDeleteSlotForDate 
} from '../../hooks/useSchedule';
import type { Slot, CreateSlotRequest, UpdateSlotRequest } from '../../types';

interface WeekViewProps {
  onLoadNextWeek?: (weekStart: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = () => {
  const [currentWeekStart] = useState(getCurrentWeekStart());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    slot: Slot;
    date: string;
  } | null>(null);

  // API hooks
  const { data: weekData, isLoading, error, refetch } = useWeekSlots(currentWeekStart);
  const createSlotMutation = useCreateSlot();
  const updateSlotMutation = useUpdateSlotForDate();
  const deleteSlotMutation = useDeleteSlotForDate();

  const handleCreateSlot = useCallback((data: CreateSlotRequest) => {
    createSlotMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateModal(false);
        refetch();
      },
      onError: (error) => {
        console.error('Failed to create slot:', error);
      },
    });
  }, [createSlotMutation, refetch]);

  const handleUpdateSlot = useCallback((data: UpdateSlotRequest) => {
    if (!selectedSlot) return;

    updateSlotMutation.mutate({
      scheduleId: selectedSlot.slot.schedule_id || selectedSlot.slot.id,
      date: selectedSlot.date,
      data,
    }, {
      onSuccess: () => {
        setShowEditModal(false);
        setSelectedSlot(null);
        refetch();
      },
      onError: (error) => {
        console.error('Failed to update slot:', error);
      },
    });
  }, [selectedSlot, updateSlotMutation, refetch]);

  const handleDeleteSlot = useCallback(() => {
    if (!selectedSlot) return;

    deleteSlotMutation.mutate({
      scheduleId: selectedSlot.slot.schedule_id || selectedSlot.slot.id,
      date: selectedSlot.date,
    }, {
      onSuccess: () => {
        setShowEditModal(false);
        setSelectedSlot(null);
        refetch();
      },
      onError: (error) => {
        console.error('Failed to delete slot:', error);
      },
    });
  }, [selectedSlot, deleteSlotMutation, refetch]);

  const handleEditSlot = (slot: Slot, date: string) => {
    setSelectedSlot({ slot, date });
    setShowEditModal(true);
  };

  const handleAddSlot = (_date: string) => {
    setShowCreateModal(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Schedule</h3>
          <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
          <Button onClick={() => refetch()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-950/20 px-4 py-3 flex items-center justify-between">
        <button className="p-2">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">Your Schedule</h1>
        
        <Button variant="secondary" className="text-sm">
          Save
        </Button>
      </header>

      {/* Simple Calendar Widget */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-950/20 p-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="font-medium">September 2025</span>
        </div>
      </div>

      {/* Schedule List */}
      <div className="p-4 space-y-4">
        {weekData && weekData.slice(1, 6).map((dayData) => {
          const dayName = new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'short' });
          const dayDate = new Date(dayData.date).getDate().toString().padStart(2, '0');
          const isToday = new Date(dayData.date).toDateString() === new Date().toDateString();
          
          return (
            <div key={dayData.date} className="bg-white rounded-lg shadow-sm border border-gray-950/20">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                    {dayName}, {dayDate}
                  </div>
                  <div className="text-sm text-gray-500">September</div>
                  {isToday && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      (Today)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {dayData.slots.length > 0 ? (
                  <div className="space-y-2">
                    {dayData.slots.map((slot) => (
                      <div
                        key={`${slot.id}-${dayData.date}`}
                        onClick={() => handleEditSlot(slot, dayData.date)}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-gray-900 font-medium">
                          {slot.start_time} - {slot.end_time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddSlot(dayData.date)}
                    className="w-full p-3 text-gray-900 font-medium bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    00:00 - 00:00
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-950/20">
        <div className="grid grid-cols-2">
          <button className="flex flex-col items-center justify-center py-3 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span className="text-xs font-medium">Schedule</span>
          </button>
        </div>
      </div>

      <div className="h-20"></div>

      {/* Modals */}
      <CreateSlotModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSlot}
        loading={createSlotMutation.isPending}
      />

      {selectedSlot && (
        <EditSlotModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSlot(null);
          }}
          onUpdate={handleUpdateSlot}
          onDelete={handleDeleteSlot}
          initialData={{
            start_time: selectedSlot.slot.start_time,
            end_time: selectedSlot.slot.end_time,
            date: selectedSlot.date,
            is_exception: selectedSlot.slot.is_exception,
          }}
          loading={updateSlotMutation.isPending || deleteSlotMutation.isPending}
        />
      )}
    </div>
  );
};