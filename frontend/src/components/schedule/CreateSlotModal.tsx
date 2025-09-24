import React, { useState } from 'react';
import { Button, Select, Modal } from '../ui';
import { DAY_NAMES } from '../../types';
import { generateTimeOptions, formatTimeForDisplay, isValidTimeRange } from '../../utils/dateUtils';
import type { CreateSlotRequest } from '../../types';

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSlotRequest) => void;
  loading?: boolean;
}

export const CreateSlotModal: React.FC<CreateSlotModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateSlotRequest>({
    day_of_week: 1, // Default to Monday
    start_time: '09:00',
    end_time: '10:00',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeOptions = generateTimeOptions();

  const dayOptions = DAY_NAMES.map((dayName, index) => ({
    value: index.toString(),
    label: dayName,
  }));

  const timeSelectOptions = timeOptions.map((time) => ({
    value: time,
    label: formatTimeForDisplay(time),
  }));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isValidTimeRange(formData.start_time, formData.end_time)) {
      newErrors.time = 'Start time must be before end time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateSlotRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Recurring Slot">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Day of Week"
          value={formData.day_of_week.toString()}
          onChange={(e) => handleInputChange('day_of_week', parseInt(e.target.value))}
          options={dayOptions}
          helper="This slot will repeat every week on this day"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Start Time"
            value={formData.start_time}
            onChange={(e) => handleInputChange('start_time', e.target.value)}
            options={timeSelectOptions}
            error={errors.start_time}
          />

          <Select
            label="End Time"
            value={formData.end_time}
            onChange={(e) => handleInputChange('end_time', e.target.value)}
            options={timeSelectOptions}
            error={errors.end_time}
          />
        </div>

        {errors.time && (
          <p className="text-sm text-red-600">{errors.time}</p>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create Recurring Slot
          </Button>
        </div>
      </form>
    </Modal>
  );
};