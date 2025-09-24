import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { CreateSlotModal } from './CreateSlotModal';
import { EditSlotModal } from './EditSlotModal';
import { 
  getCurrentWeekStart, 
  addDays, 
  formatDate 
} from '../../utils/dateUtils';
import { 
  useWeekSlots, 
  useCreateSlot, 
  useUpdateSlotForDate, 
  useDeleteSlotForDate 
} from '../../hooks/useSchedule';
import type { Slot, CreateSlotRequest, UpdateSlotRequest } from '../../types';
import { Calendar, Plus, Clock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface WeekViewProps {
  onLoadNextWeek?: (weekStart: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(getCurrentWeekStart());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    slot: Slot;
    date: string;
  } | null>(null);
  
  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // API hooks
  const { data: weekData, isLoading, error, refetch } = useWeekSlots(currentWeekStart);
  const createSlotMutation = useCreateSlot();
  const updateSlotMutation = useUpdateSlotForDate();
  const deleteSlotMutation = useDeleteSlotForDate();
  
  // Animation on mount
  useEffect(() => {
    if (!hasAnimated.current && !isLoading) {
      hasAnimated.current = true;
      
      // Animate header entrance
      anime({
        targets: headerRef.current,
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart',
      });
      
      // Animate calendar entrance
      anime({
        targets: calendarRef.current,
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 600,
        delay: 200,
        easing: 'easeOutQuart',
      });
      
      // Animate slots entrance
      anime({
        targets: '.slot-card',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 500,
        delay: anime.stagger(100, {start: 400}),
        easing: 'easeOutQuart',
      });
    }
  }, [isLoading]);
  
  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(currentWeekStart), i);
    return {
      date: formatDate(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: date.toDateString() === new Date().toDateString(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    };
  });
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = addDays(new Date(currentWeekStart), direction === 'next' ? 7 : -7);
    setCurrentWeekStart(formatDate(newWeekStart));
    
    // Animate transition
    anime({
      targets: '.week-content',
      translateX: direction === 'next' ? [50, 0] : [-50, 0],
      opacity: [0.7, 1],
      duration: 400,
      easing: 'easeOutQuart',
    });
  };

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50"
      >
        <Card className="text-center max-w-md">
          <CardContent className="pt-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Issue</h3>
            <p className="text-gray-600 mb-6">Unable to load your schedule. Please check your connection.</p>
            <Button onClick={() => refetch()} variant="gradient" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-gray-600 text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your schedule...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Header */}
      <motion.header 
        ref={headerRef}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-40"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                DilsayCare Scheduler
              </h1>
              <p className="text-sm text-gray-600">Manage your weekly appointments</p>
            </div>
          </motion.div>
          
          <Button 
            onClick={() => setShowCreateModal(true)} 
            variant="gradient" 
            className="shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Slot
          </Button>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-6 py-8 week-content">
        {/* Week Navigation */}
        <motion.div 
          ref={calendarRef}
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                onClick={() => navigateWeek('prev')}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {new Date(currentWeekStart).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
                <p className="text-gray-600">Week of {new Date(currentWeekStart).toLocaleDateString()}</p>
              </div>
              
              <motion.button
                onClick={() => navigateWeek('next')}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Week Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((day, index) => (
                <motion.div
                  key={day.date}
                  className={`
                    text-center p-3 rounded-xl transition-all duration-200
                    ${day.isToday 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                      : day.isWeekend 
                        ? 'bg-gray-100 text-gray-500' 
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                    }
                  `}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-medium text-xs mb-1">{day.dayName}</div>
                  <div className={`font-bold ${day.isToday ? 'text-white' : 'text-gray-900'}`}>
                    {day.dayNumber}
                  </div>
                  {day.isToday && (
                    <motion.div 
                      className="w-1 h-1 bg-white rounded-full mx-auto mt-1"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Schedule Slots */}
        <div ref={slotsRef} className="space-y-4">
          <AnimatePresence>
            {weekData && weekDates.filter(day => !day.isWeekend).map((day) => {
              const dayData = weekData.find(d => d.date === day.date);
              
              return (
                <motion.div
                  key={day.date}
                  className="slot-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  layout
                >
                  <Card hover={false}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            day.isToday ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <span>{day.dayName}, {day.dayNumber}</span>
                          {day.isToday && (
                            <motion.span 
                              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Today
                            </motion.span>
                          )}
                        </CardTitle>
                        <Button 
                          onClick={() => handleAddSlot(day.date)} 
                          variant="ghost" 
                          size="sm"
                          className="opacity-60 hover:opacity-100"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {dayData && dayData.slots.length > 0 ? (
                        <div className="space-y-3">
                          {dayData.slots.map((slot, index) => (
                            <motion.div
                              key={`${slot.id}-${day.date}`}
                              className="group p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 cursor-pointer transition-all duration-200"
                              onClick={() => handleEditSlot(slot, day.date)}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Clock className="w-5 h-5 text-blue-600" />
                                  <span className="font-semibold text-gray-900">
                                    {slot.start_time} - {slot.end_time}
                                  </span>
                                  {slot.is_exception && (
                                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                      Modified
                                    </span>
                                  )}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => handleAddSlot(day.date)}
                          className="w-full p-6 text-center border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                          <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                            Add your first slot for {day.dayName}
                          </p>
                        </motion.button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

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