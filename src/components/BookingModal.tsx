import React, { useState } from 'react';
import { BookingDetails, TimeSlot } from '../types/schedule';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: BookingDetails) => void;
  timeSlot: TimeSlot;
  initialBooking?: BookingDetails;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  timeSlot,
  initialBooking
}) => {
  const [surgeon, setSurgeon] = useState(initialBooking?.surgeon || '');
  const [nurses, setNurses] = useState<string[]>(initialBooking?.nurses || []);
  const [anaesthetist, setAnaesthetist] = useState(initialBooking?.anaesthetist || '');
  const [nurseInput, setNurseInput] = useState('');

  const handleAddNurse = () => {
    if (nurseInput.trim() && nurses.length < 4) {
      setNurses([...nurses, nurseInput.trim()]);
      setNurseInput('');
    }
  };

  const handleRemoveNurse = (index: number) => {
    setNurses(nurses.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (surgeon.trim() && nurses.length > 0) {
      onSave({
        surgeon: surgeon.trim(),
        nurses,
        anaesthetist: anaesthetist.trim() || undefined
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">
            {initialBooking ? 'Edit Room Schedule' : 'Add Room Schedule'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {timeSlot.type} - Room {timeSlot.id.split('-')[2]}
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Surgeon */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Surgeon *
            </label>
            <input
              type="text"
              value={surgeon}
              onChange={(e) => setSurgeon(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dr. John Doe"
            />
          </div>

          {/* Nurses */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nurses * (Max 4)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nurseInput}
                onChange={(e) => setNurseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddNurse()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nurse name"
                disabled={nurses.length >= 4}
              />
              <button
                onClick={handleAddNurse}
                disabled={nurses.length >= 4 || !nurseInput.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Add
              </button>
            </div>
            
            {/* Nurse list */}
            <div className="space-y-1">
              {nurses.map((nurse, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">{nurse}</span>
                  <button
                    onClick={() => handleRemoveNurse(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Anaesthetist */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anaesthetist (Optional)
            </label>
            <input
              type="text"
              value={anaesthetist}
              onChange={(e) => setAnaesthetist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dr. Emily White"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!surgeon.trim() || nurses.length === 0}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {initialBooking ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}; 