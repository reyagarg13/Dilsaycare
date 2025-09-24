import React from 'react';
import { formatDateForDisplay, isDateToday } from '../../utils/dateUtils';
import { SlotCard } from './SlotCard';
import type { DaySlots, Slot } from '../../types';

interface DayColumnProps {
  dayData: DaySlots;
  onEditSlot: (slot: Slot, date: string) => void;
  onAddSlot: (date: string) => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  dayData,
  onEditSlot,
  onAddSlot,
}) => {
  const isToday = isDateToday(dayData.date);
  const hasSlots = dayData.slots.length > 0;
  const canAddSlot = dayData.slots.length < 2; // Maximum 2 slots per day

  return (
    <div className={`
      bg-white rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md
      ${isToday 
        ? 'border-primary-200 shadow-glow bg-gradient-to-br from-white to-primary-25' 
        : 'border-gray-950/20 hover:border-gray-950/30'
      }
    `}>
      {/* Day header */}
      <div className={`
        px-4 py-4 border-b text-center rounded-t-xl
        ${isToday 
          ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200' 
          : 'bg-gray-50/70 border-gray-950/20'
        }
      `}>
        <div className={`font-semibold text-sm uppercase tracking-wide ${
          isToday ? 'text-primary-800' : 'text-gray-700'
        }`}>
          {formatDateForDisplay(dayData.date)}
        </div>
        {isToday && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-600 text-white mt-2">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            Today
          </div>
        )}
      </div>

      {/* Slots content */}
      <div className="p-4 min-h-[240px] flex flex-col">
        {hasSlots ? (
          <div className="space-y-3 flex-1">
            {dayData.slots.map((slot) => (
              <SlotCard
                key={`${slot.id}-${dayData.date}`}
                slot={slot}
                date={dayData.date}
                onEdit={onEditSlot}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">No slots scheduled</p>
              <p className="text-xs text-gray-400 mt-1">Click below to add one</p>
            </div>
          </div>
        )}

        {/* Add slot button */}
        {canAddSlot && (
          <button
            onClick={() => onAddSlot(dayData.date)}
            className={`
              w-full mt-4 py-3 border-2 border-dashed rounded-lg
              text-sm font-medium transition-all duration-200 group
              ${isToday 
                ? 'border-primary-300 text-primary-700 hover:border-primary-400 hover:bg-primary-50' 
                : 'border-gray-300 text-gray-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
              }
            `}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Time Slot
            </div>
          </button>
        )}

        {!canAddSlot && (
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Max 2 slots per day
            </div>
          </div>
        )}
      </div>
    </div>
  );
};