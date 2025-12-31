'use client';

import { useState, useMemo } from 'react';
import { X, Eye, Printer, Settings } from 'lucide-react';
import { Project, DesignStatus, ALL_DESIGN_STATUSES } from '@/types/project';
import { DISTRICTS, LACS_BY_DISTRICT, District } from '@/constants/districts';

interface PrintConfigProps {
  projects: Project[];
  onClose: () => void;
  onPrint: (config: PrintConfiguration) => void;
}

export interface PrintConfiguration {
  // Page style
  pageStyle: 'portrait' | 'landscape';
  pageSize: 'A4' | 'A3';
  fontSize: 'small' | 'medium' | 'large';
  
  // Filters
  designStatus: string;
  district: string;
  lac: string;
  asDateFrom: string;
  asDateTo: string;
  
  // Grouping
  groupBy: 'none' | 'designStatus' | 'district' | 'lac';
  
  // Columns
  selectedColumns: string[];
  columnOrder: string[];
  
  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AVAILABLE_COLUMNS = [
  { id: 'projectName', label: 'Project Name' },
  { id: 'district', label: 'District' },
  { id: 'lac', label: 'LAC' },
  { id: 'designStatus', label: 'Design Status' },
  { id: 'asStatus', label: 'AS Status' },
  { id: 'asNumber', label: 'AS Number' },
  { id: 'asDate', label: 'AS Date' },
  { id: 'arStatus', label: 'AR Status' },
  { id: 'arNumber', label: 'AR Number' },
  { id: 'arDate', label: 'AR Date' },
  { id: 'arFloors', label: 'No. of Floors' },
  { id: 'arArea', label: 'Total Area' },
  { id: 'aeeName', label: 'AEE Name' },
  { id: 'aeePhone', label: 'AEE Phone' },
  { id: 'contractorName', label: 'Contractor' },
  { id: 'updatedAt', label: 'Last Updated' },
  { id: 'projectHistory', label: 'Project History' },
];

export function PrintConfig({ projects, onClose, onPrint }: PrintConfigProps) {
  const [config, setConfig] = useState<PrintConfiguration>({
    pageStyle: 'landscape',
    pageSize: 'A4',
    fontSize: 'small',
    designStatus: '',
    district: '',
    lac: '',
    asDateFrom: '',
    asDateTo: '',
    groupBy: 'none',
    selectedColumns: ['projectName', 'district', 'lac', 'designStatus', 'asDate', 'arDate'],
    columnOrder: ['projectName', 'district', 'lac', 'designStatus', 'asDate', 'arDate'],
    sortBy: 'projectName',
    sortOrder: 'asc',
  });

  // Get available LACs based on selected district
  const availableLACs = useMemo(() => {
    if (config.district && LACS_BY_DISTRICT[config.district as District]) {
      return LACS_BY_DISTRICT[config.district as District];
    }
    return [];
  }, [config.district]);

  const handleConfigChange = (key: keyof PrintConfiguration, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      // Reset LAC when district changes
      if (key === 'district') {
        newConfig.lac = '';
      }
      return newConfig;
    });
  };

  const handleColumnToggle = (columnId: string) => {
    setConfig(prev => {
      const isSelected = prev.selectedColumns.includes(columnId);
      if (isSelected) {
        return {
          ...prev,
          selectedColumns: prev.selectedColumns.filter(id => id !== columnId),
          columnOrder: prev.columnOrder.filter(id => id !== columnId),
        };
      } else {
        return {
          ...prev,
          selectedColumns: [...prev.selectedColumns, columnId],
          columnOrder: [...prev.columnOrder, columnId],
        };
      }
    });
  };

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const newOrder = [...prev.columnOrder];
      const currentIndex = newOrder.indexOf(columnId);
      
      if (direction === 'up' && currentIndex > 0) {
        [newOrder[currentIndex], newOrder[currentIndex - 1]] = 
        [newOrder[currentIndex - 1], newOrder[currentIndex]];
      } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
        [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
        [newOrder[currentIndex + 1], newOrder[currentIndex]];
      }
      
      return { ...prev, columnOrder: newOrder };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Printer className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Print Configuration</h2>
              <p className="text-sm text-gray-600 mt-1">Customize your PDF export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Page Settings & Filters */}
            <div className="space-y-6">
              {/* Page Style */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Page Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Orientation
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfigChange('pageStyle', 'portrait')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          config.pageStyle === 'portrait'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        Portrait
                      </button>
                      <button
                        onClick={() => handleConfigChange('pageStyle', 'landscape')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          config.pageStyle === 'landscape'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={config.fontSize}
                      onChange={(e) => handleConfigChange('fontSize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Size
                    </label>
                    <select
                      value={config.pageSize}
                      onChange={(e) => handleConfigChange('pageSize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="A4">A4 (210mm × 297mm)</option>
                      <option value="A3">A3 (297mm × 420mm)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Design Status
                    </label>
                    <select
                      value={config.designStatus}
                      onChange={(e) => handleConfigChange('designStatus', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">All Statuses</option>
                      {ALL_DESIGN_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <select
                      value={config.district}
                      onChange={(e) => handleConfigChange('district', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">All Districts</option>
                      {DISTRICTS.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {availableLACs.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LAC
                      </label>
                      <select
                        value={config.lac}
                        onChange={(e) => handleConfigChange('lac', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="">All LACs</option>
                        {availableLACs.map((lac) => (
                          <option key={lac} value={lac}>
                            {lac}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AS Date From
                      </label>
                      <input
                        type="date"
                        value={config.asDateFrom}
                        onChange={(e) => handleConfigChange('asDateFrom', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AS Date To
                      </label>
                      <input
                        type="date"
                        value={config.asDateTo}
                        onChange={(e) => handleConfigChange('asDateTo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group By */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grouping</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group By
                  </label>
                  <select
                    value={config.groupBy}
                    onChange={(e) => handleConfigChange('groupBy', e.target.value as PrintConfiguration['groupBy'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="none">No Grouping</option>
                    <option value="designStatus">Design Status</option>
                    <option value="district">District</option>
                    <option value="lac">LAC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Columns & Sorting */}
            <div className="space-y-6">
              {/* Column Selection */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Column Selection & Order</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select columns and arrange their order (selected: {config.selectedColumns.length})
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {config.columnOrder.map((columnId, index) => {
                    const column = AVAILABLE_COLUMNS.find(c => c.id === columnId);
                    if (!column) return null;
                    
                    return (
                      <div
                        key={columnId}
                        className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={config.selectedColumns.includes(columnId)}
                          onChange={() => handleColumnToggle(columnId)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="flex-1 text-sm font-medium text-gray-700">
                          {column.label}
                        </span>
                        {config.selectedColumns.includes(columnId) && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveColumn(columnId, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveColumn(columnId, 'down')}
                              disabled={index === config.columnOrder.length - 1}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              ↓
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Add unselected columns at the end */}
                  {AVAILABLE_COLUMNS.filter(col => !config.columnOrder.includes(col.id)).map(column => (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => handleColumnToggle(column.id)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-700">
                        {column.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sorting</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={config.sortBy}
                      onChange={(e) => handleConfigChange('sortBy', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      {AVAILABLE_COLUMNS.map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfigChange('sortOrder', 'asc')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          config.sortOrder === 'asc'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        Ascending
                      </button>
                      <button
                        onClick={() => handleConfigChange('sortOrder', 'desc')}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                          config.sortOrder === 'desc'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        Descending
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
            onClick={() => onPrint(config)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
          >
            <Eye size={18} />
            Preview & Print
          </button>
        </div>
      </div>
    </div>
  );
}
