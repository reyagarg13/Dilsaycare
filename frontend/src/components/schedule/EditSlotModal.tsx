import React, { useState } from 'react';
import { Button, Select, Modal } from '../ui';
import { generateTimeOptions, formatTimeForDisplay, isValidTimeRange } from '../../utils/dateUtils';
import type { UpdateSlotRequest } from '../../types';

interface EditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateSlotRequest) => void;
  onDelete: () => void;
  initialData?: {
    start_time: string;
    end_time: string;
    date: string;
    is_exception: boolean;
  };
  loading?: boolean;
}

export const EditSlotModal: React.FC<EditSlotModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<UpdateSlotRequest>({
    start_time: initialData?.start_time || '09:00',
    end_time: initialData?.end_time || '10:00',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const timeOptions = generateTimeOptions();

  const timeSelectOptions = timeOptions.map((time) => ({
    value: time,
    label: formatTimeForDisplay(time),
  }));

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        start_time: initialData.start_time,
        end_time: initialData.end_time,
      });
    }
  }, [initialData]);

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
      onUpdate(formData);
    }
  };

  const handleInputChange = (field: keyof UpdateSlotRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setErrors({});
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Slot">
      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {initialData?.is_exception && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                📅 This is a specific date modification. Changes will only affect {initialData.date}.
              </p>
            </div>
          )}

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

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              Delete Slot
            </Button>
            
            <div className="flex space-x-3">
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
                Update Slot
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="font-medium text-red-800 mb-2">Delete Slot</h4>
            <p className="text-sm text-red-700">
              {initialData?.is_exception 
                ? `Are you sure you want to delete this slot for ${initialData.date}? This will only affect this specific date.`
                : 'Are you sure you want to delete this slot? This will remove it from this specific date only.'
              }
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={loading}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};