import React from 'react';
import { formatTimeForDisplay, isDateToday } from '../../utils/dateUtils';
import type { Slot } from '../../types';

interface SlotCardProps {
  slot: Slot;
  date: string;
  onEdit: (slot: Slot, date: string) => void;
  onClick?: (slot: Slot, date: string) => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({
  slot,
  date,
  onEdit,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(slot, date);
    } else {
      onEdit(slot, date);
    }
  };

  const isToday = isDateToday(date);

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-300 group
        hover:shadow-lg hover:scale-[1.02] transform-gpu
        ${slot.is_exception 
          ? 'border-l-warning-500 bg-gradient-to-r from-warning-50 to-warning-25 hover:from-warning-100 hover:to-warning-50' 
          : 'border-l-primary-500 bg-gradient-to-r from-primary-50 to-primary-25 hover:from-primary-100 hover:to-primary-50'
        }
        ${isToday ? 'ring-2 ring-primary-200 shadow-md' : 'shadow-sm'}
      `}
    >
      {/* Time display */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-lg">
            {formatTimeForDisplay(slot.start_time)} - {formatTimeForDisplay(slot.end_time)}
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center mt-2">
            {slot.is_exception ? (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 border border-warning-200">
                <span className="inline-block w-2 h-2 bg-warning-500 rounded-full mr-1 animate-pulse"></span>
                Modified for this date
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mr-1"></span>
                Recurring slot
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-3">
          {isToday && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm">
              <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
              Today
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(slot, date);
            }}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white/60 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
    </div>
  );
};