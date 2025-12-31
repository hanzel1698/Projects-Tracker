'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { HistoryEntry } from '@/types/project';

interface ProjectHistoryProps {
  projectName: string;
  history: HistoryEntry[];
  onSave: (history: HistoryEntry[]) => void;
  onClose: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function ProjectHistory({ projectName, history, onSave, onClose }: ProjectHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>(
    history.length > 0 ? history : [{ id: generateId(), event: '', date: '' }]
  );

  const handleAddRow = () => {
    setEntries([...entries, { id: generateId(), event: '', date: '' }]);
  };

  const handleRemoveRow = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleChange = (id: string, field: 'event' | 'date', value: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSave = () => {
    // Filter out empty entries before saving
    const validEntries = entries.filter(entry => entry.event.trim() !== '' || entry.date !== '');
    onSave(validEntries);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project History</h2>
            <p className="text-sm text-gray-600 mt-1">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_200px_80px] gap-4 mb-4 pb-3 border-b-2 border-gray-300">
              <div className="font-semibold text-gray-900">Event</div>
              <div className="font-semibold text-gray-900">Date</div>
              <div className="font-semibold text-gray-900">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-[1fr_200px_80px] gap-4 items-center">
                  {/* Event Input */}
                  <input
                    type="text"
                    value={entry.event}
                    onChange={(e) => handleChange(entry.id, 'event', e.target.value)}
                    placeholder="Enter event description"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  />

                  {/* Date Picker */}
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleChange(entry.id, 'date', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  />

                  {/* Actions */}
                  <div className="flex gap-2">
                    {index === entries.length - 1 && (
                      <button
                        onClick={handleAddRow}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Add new row"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                    {entries.length > 1 && (
                      <button
                        onClick={() => handleRemoveRow(entry.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
          >
            Save History
          </button>
        </div>
      </div>
    </div>
  );
}
