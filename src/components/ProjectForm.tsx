'use client';

import { useState, useEffect } from 'react';
import { Project, DesignStatus, ALL_DESIGN_STATUSES, ASDetails, ARDetails, Contacts } from '@/types/project';
import { DISTRICTS, LACS_BY_DISTRICT, District } from '@/constants/districts';
import { X } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  initialData?: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const defaultASDetails: ASDetails = { status: '', number: '', date: '' };
const defaultARDetails: ARDetails = { status: '', number: '', date: '', revisionDetails: '', numberOfFloors: '', totalArea: '' };
const defaultContacts: Contacts = { aeName: '', aePhone: '', aeeName: '', aeePhone: '', contractorName: '', contractorPhone: '' };

export function ProjectForm({ project, initialData, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    projectName: initialData?.projectName || project?.projectName || '',
    district: initialData?.district || project?.district || '',
    lac: initialData?.lac || project?.lac || '',
    asDetails: initialData?.asDetails || project?.asDetails || defaultASDetails,
    srDetails: initialData?.srDetails || project?.srDetails || '',
    arDetails: initialData?.arDetails || project?.arDetails || defaultARDetails,
    contacts: initialData?.contacts || project?.contacts || defaultContacts,
    designStatus: initialData?.designStatus || project?.designStatus || DesignStatus.FILE_NOT_OPENED,
    history: initialData?.history || project?.history || [],
  });

  const [availableLACs, setAvailableLACs] = useState<string[]>([]);

  useEffect(() => {
    if (formData.district && LACS_BY_DISTRICT[formData.district as District]) {
      setAvailableLACs(LACS_BY_DISTRICT[formData.district as District]);
    } else {
      setAvailableLACs([]);
    }
  }, [formData.district]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'district') {
      setFormData((prev) => ({
        ...prev,
        district: value,
        lac: '', // Reset LAC when district changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNestedChange = (
    category: 'asDetails' | 'arDetails' | 'contacts',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
              placeholder="Enter project name"
            />
          </div>

          {/* District & LAC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
              >
                <option value="">Select District</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                LAC *
              </label>
              <select
                name="lac"
                value={formData.lac}
                onChange={handleChange}
                required
                disabled={!formData.district}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select LAC</option>
                {availableLACs.map((lac) => (
                  <option key={lac} value={lac}>
                    {lac}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AS Details */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AS Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AS Status
                </label>
                <input
                  type="text"
                  value={formData.asDetails.status}
                  onChange={(e) => handleNestedChange('asDetails', 'status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Status"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AS No.
                </label>
                <input
                  type="text"
                  value={formData.asDetails.number}
                  onChange={(e) => handleNestedChange('asDetails', 'number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AS Date
                </label>
                <input
                  type="date"
                  value={formData.asDetails.date}
                  onChange={(e) => handleNestedChange('asDetails', 'date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SR Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              SR Details
            </label>
            <textarea
              name="srDetails"
              value={formData.srDetails}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
              placeholder="Enter SR details"
            />
          </div>

          {/* AR Details */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AR Details</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AR Status
                </label>
                <input
                  type="text"
                  value={formData.arDetails.status}
                  onChange={(e) => handleNestedChange('arDetails', 'status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Status"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AR No.
                </label>
                <input
                  type="text"
                  value={formData.arDetails.number}
                  onChange={(e) => handleNestedChange('arDetails', 'number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AR Date
                </label>
                <input
                  type="date"
                  value={formData.arDetails.date}
                  onChange={(e) => handleNestedChange('arDetails', 'date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Revision Details
                </label>
                <input
                  type="text"
                  value={formData.arDetails.revisionDetails}
                  onChange={(e) => handleNestedChange('arDetails', 'revisionDetails', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Revision details"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  No. of Floors
                </label>
                <input
                  type="text"
                  value={formData.arDetails.numberOfFloors}
                  onChange={(e) => handleNestedChange('arDetails', 'numberOfFloors', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Total Area
                </label>
                <input
                  type="text"
                  value={formData.arDetails.totalArea}
                  onChange={(e) => handleNestedChange('arDetails', 'totalArea', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Area"
                />
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contacts</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    AE Name
                  </label>
                  <input
                    type="text"
                    value={formData.contacts.aeName}
                    onChange={(e) => handleNestedChange('contacts', 'aeName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    AE Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contacts.aePhone}
                    onChange={(e) => handleNestedChange('contacts', 'aePhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    AEE Name
                  </label>
                  <input
                    type="text"
                    value={formData.contacts.aeeName}
                    onChange={(e) => handleNestedChange('contacts', 'aeeName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    AEE Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contacts.aeePhone}
                    onChange={(e) => handleNestedChange('contacts', 'aeePhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contractor Name
                  </label>
                  <input
                    type="text"
                    value={formData.contacts.contractorName}
                    onChange={(e) => handleNestedChange('contacts', 'contractorName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contractor Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contacts.contractorPhone}
                    onChange={(e) => handleNestedChange('contacts', 'contractorPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Design Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Design Status *
            </label>
            <select
              name="designStatus"
              value={formData.designStatus}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 bg-white"
            >
              {ALL_DESIGN_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
