'use client';

import { useState, useMemo, useEffect } from 'react';
import { Project, DESIGN_STATUS_COLORS, DesignStatus, ALL_DESIGN_STATUSES, HistoryEntry } from '@/types/project';
import { DISTRICTS, LACS_BY_DISTRICT, District } from '@/constants/districts';
import { Edit2, Trash2, Copy, ChevronDown, ChevronUp, Filter, X, History } from 'lucide-react';
import { ProjectHistory } from './ProjectHistory';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onDuplicate: (project: Project) => void;
  onUpdateHistory: (projectId: string, history: HistoryEntry[]) => void;
  initialFilter?: DesignStatus | null;
}

interface Filters {
  designStatus: string;
  district: string;
  lac: string;
  asDateFrom: string;
  asDateTo: string;
  arAreaMin: string;
  arAreaMax: string;
}

export function ProjectList({ projects, onEdit, onDelete, onDuplicate, onUpdateHistory, initialFilter }: ProjectListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [historyModalProject, setHistoryModalProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<Filters>({
    designStatus: '',
    district: '',
    lac: '',
    asDateFrom: '',
    asDateTo: '',
    arAreaMin: '',
    arAreaMax: '',
  });

  // Apply initial filter when component mounts or initialFilter changes
  useEffect(() => {
    if (initialFilter) {
      setFilters(prev => ({
        ...prev,
        designStatus: initialFilter
      }));
      setShowFilters(true); // Auto-open filters to show what's applied
    }
  }, [initialFilter]);

  // Get available LACs based on selected district
  const availableLACs = useMemo(() => {
    if (filters.district && LACS_BY_DISTRICT[filters.district as District]) {
      return LACS_BY_DISTRICT[filters.district as District];
    }
    return [];
  }, [filters.district]);

  // Filter projects based on criteria
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Design Status filter
      if (filters.designStatus && project.designStatus !== filters.designStatus) {
        return false;
      }

      // District filter
      if (filters.district && project.district !== filters.district) {
        return false;
      }

      // LAC filter
      if (filters.lac && project.lac !== filters.lac) {
        return false;
      }

      // AS Date range filter
      if (filters.asDateFrom && project.asDetails.date) {
        if (new Date(project.asDetails.date) < new Date(filters.asDateFrom)) {
          return false;
        }
      }
      if (filters.asDateTo && project.asDetails.date) {
        if (new Date(project.asDetails.date) > new Date(filters.asDateTo)) {
          return false;
        }
      }

      // AR Area filter
      if (filters.arAreaMin && project.arDetails.totalArea) {
        const area = parseFloat(project.arDetails.totalArea.replace(/[^\d.]/g, ''));
        if (!isNaN(area) && area < parseFloat(filters.arAreaMin)) {
          return false;
        }
      }
      if (filters.arAreaMax && project.arDetails.totalArea) {
        const area = parseFloat(project.arDetails.totalArea.replace(/[^\d.]/g, ''));
        if (!isNaN(area) && area > parseFloat(filters.arAreaMax)) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Reset LAC when district changes
      if (key === 'district') {
        newFilters.lac = '';
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      designStatus: '',
      district: '',
      lac: '',
      asDateFrom: '',
      asDateTo: '',
      arAreaMin: '',
      arAreaMax: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No projects yet. Create your first project!</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-indigo-600" />
            <span className="font-semibold text-gray-900">Filters</span>
            {hasActiveFilters && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showFilters && (
          <div className="p-6 space-y-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Design Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Design Status
                </label>
                <select
                  value={filters.designStatus}
                  onChange={(e) => handleFilterChange('designStatus', e.target.value)}
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

              {/* District Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  District
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
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

              {/* LAC Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  LAC
                </label>
                <select
                  value={filters.lac}
                  onChange={(e) => handleFilterChange('lac', e.target.value)}
                  disabled={!filters.district}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All LACs</option>
                  {availableLACs.map((lac) => (
                    <option key={lac} value={lac}>
                      {lac}
                    </option>
                  ))}
                </select>
              </div>

              {/* AS Date From */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AS Date From
                </label>
                <input
                  type="date"
                  value={filters.asDateFrom}
                  onChange={(e) => handleFilterChange('asDateFrom', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* AS Date To */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AS Date To
                </label>
                <input
                  type="date"
                  value={filters.asDateTo}
                  onChange={(e) => handleFilterChange('asDateTo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* AR Area Min */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Min Area (sq.m)
                </label>
                <input
                  type="number"
                  value={filters.arAreaMin}
                  onChange={(e) => handleFilterChange('arAreaMin', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* AR Area Max */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Max Area (sq.m)
                </label>
                <input
                  type="number"
                  value={filters.arAreaMax}
                  onChange={(e) => handleFilterChange('arAreaMax', e.target.value)}
                  placeholder="∞"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-indigo-600">{filteredProjects.length}</span> of <span className="font-bold">{projects.length}</span> projects
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No projects match the selected filters.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => {
        const isExpanded = expandedId === project.id;
        return (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div
              className="h-2"
              style={{ backgroundColor: DESIGN_STATUS_COLORS[project.designStatus] }}
            />
            <div className="p-6">
              <div 
                className="flex items-start justify-between mb-4 cursor-pointer"
                onClick={() => toggleExpand(project.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {project.projectName}
                    </h3>
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span className="font-medium">{project.district}</span>
                    <span>•</span>
                    <span>{project.lac}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: DESIGN_STATUS_COLORS[project.designStatus] }}
                    >
                      {project.designStatus}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setHistoryModalProject(project)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Project History"
                  >
                    <History size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDuplicate(project)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Copy project"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this project?')) {
                        onDelete(project.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
              {(project.asDetails.status || project.asDetails.number || project.asDetails.date) && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">AS Details:</span>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                    {project.asDetails.status && <div><span className="font-medium">Status:</span> {project.asDetails.status}</div>}
                    {project.asDetails.number && <div><span className="font-medium">No:</span> {project.asDetails.number}</div>}
                    {project.asDetails.date && <div><span className="font-medium">Date:</span> {new Date(project.asDetails.date).toLocaleDateString()}</div>}
                  </div>
                </div>
              )}
              {project.srDetails && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">SR Details:</span>
                  <p className="text-sm text-gray-700">{project.srDetails}</p>
                </div>
              )}
              {(project.arDetails.status || project.arDetails.number || project.arDetails.date) && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">AR Details:</span>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 mb-2">
                    {project.arDetails.status && <div><span className="font-medium">Status:</span> {project.arDetails.status}</div>}
                    {project.arDetails.number && <div><span className="font-medium">No:</span> {project.arDetails.number}</div>}
                    {project.arDetails.date && <div><span className="font-medium">Date:</span> {new Date(project.arDetails.date).toLocaleDateString()}</div>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                    {project.arDetails.revisionDetails && <div><span className="font-medium">Revision:</span> {project.arDetails.revisionDetails}</div>}
                    {project.arDetails.numberOfFloors && <div><span className="font-medium">Floors:</span> {project.arDetails.numberOfFloors}</div>}
                    {project.arDetails.totalArea && <div><span className="font-medium">Area:</span> {project.arDetails.totalArea}</div>}
                  </div>
                </div>
              )}
              {(project.contacts.aeName || project.contacts.aeeName || project.contacts.contractorName) && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Contacts:</span>
                  <div className="space-y-1 text-sm text-gray-700">
                    {project.contacts.aeName && (
                      <div><span className="font-medium">AE:</span> {project.contacts.aeName} {project.contacts.aePhone && `(${project.contacts.aePhone})`}</div>
                    )}
                    {project.contacts.aeeName && (
                      <div><span className="font-medium">AEE:</span> {project.contacts.aeeName} {project.contacts.aeePhone && `(${project.contacts.aeePhone})`}</div>
                    )}
                    {project.contacts.contractorName && (
                      <div><span className="font-medium">Contractor:</span> {project.contacts.contractorName} {project.contacts.contractorPhone && `(${project.contacts.contractorPhone})`}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
              )}

              {isExpanded && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                  <span className="text-xs text-gray-500">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
        </div>
      )}

      {/* Project History Modal */}
      {historyModalProject && (
        <ProjectHistory
          projectName={historyModalProject.projectName}
          history={historyModalProject.history || []}
          onSave={(history) => onUpdateHistory(historyModalProject.id, history)}
          onClose={() => setHistoryModalProject(null)}
        />
      )}
    </div>
  );
}
