'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { DashboardChart } from '@/components/DashboardChart';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { PrintManager } from '@/components/PrintManager';
import { Plus, BarChart3, List, Printer, Cloud, CloudDownload } from 'lucide-react';
import { Project, DesignStatus, DESIGN_STATUS_COLORS } from '@/types/project';
import { pushProjectsToFirestore, pullProjectsFromFirestore } from '@/lib/firestore';

// Status abbreviations
const STATUS_ABBREVIATIONS: Record<DesignStatus, string> = {
  [DesignStatus.TENTATIVE_ONGOING]: 'TD Ongoing',
  [DesignStatus.TENTATIVE_ON_HOLD]: 'TD On Hold',
  [DesignStatus.TENTATIVE_ISSUED]: 'TD Issued',
  [DesignStatus.DETAILED_ONGOING]: 'DD Ongoing',
  [DesignStatus.DETAILED_ON_HOLD]: 'DD On Hold',
  [DesignStatus.DETAILED_ISSUED]: 'DD Issued',
  [DesignStatus.FILE_NOT_OPENED]: 'Not Opened',
  [DesignStatus.DISCARDED]: 'Discarded',
  [DesignStatus.RETURNED_TO_SITE]: 'Returned',
};

export default function Home() {
  const { projects, loading, addProject, updateProject, deleteProject, updateProjectHistory, replaceAllProjects } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [duplicateData, setDuplicateData] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'> | undefined>();
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');
  const [filterByStatus, setFilterByStatus] = useState<DesignStatus | null>(null);
  const [showPrintManager, setShowPrintManager] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setShowForm(false);
    setEditingProject(undefined);
    setDuplicateData(undefined);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDuplicateData(undefined);
    setShowForm(true);
  };

  const handleDuplicate = (project: Project) => {
    const { id, createdAt, updatedAt, ...projectData } = project;
    setDuplicateData(projectData);
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleUploadToCloud = async () => {
    if (syncing) return;
    
    const confirmed = window.confirm(
      `Upload ${projects.length} project(s) to cloud?\n\nThis will replace any existing data in the cloud with your local data.`
    );
    
    if (!confirmed) return;
    
    setSyncing(true);
    setSyncMessage(null);
    
    try {
      const message = await pushProjectsToFirestore(projects);
      setSyncMessage({ type: 'success', text: message });
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (error) {
      setSyncMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload to cloud' 
      });
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  const handleDownloadFromCloud = async () => {
    if (syncing) return;
    
    const confirmed = window.confirm(
      'Download projects from cloud?\n\nThis will replace your local data with data from the cloud. Your current local data will be lost.'
    );
    
    if (!confirmed) return;
    
    setSyncing(true);
    setSyncMessage(null);
    
    try {
      const cloudProjects = await pullProjectsFromFirestore();
      replaceAllProjects(cloudProjects);
      setSyncMessage({ 
        type: 'success', 
        text: `Successfully downloaded ${cloudProjects.length} project(s) from cloud` 
      });
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (error) {
      setSyncMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to download from cloud' 
      });
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setSyncing(false);
    }
  };

  // Calculate status counts
  const statusCounts = Object.values(DesignStatus).map((status) => ({
    status,
    abbreviation: STATUS_ABBREVIATIONS[status],
    count: projects.filter(p => p.designStatus === status).length,
    color: DESIGN_STATUS_COLORS[status],
  })).filter(item => item.count > 0); // Only show statuses with projects

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (view === 'list') {
        setView('dashboard');
        setFilterByStatus(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);

  // Push state when switching to list view
  const switchToListView = (status?: DesignStatus | null) => {
    setFilterByStatus(status || null);
    setView('list');
    window.history.pushState({ view: 'list' }, '', '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="screen-only">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Sync Message */}
          {syncMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              syncMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {syncMessage.text}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Projects Tracker
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your design projects</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadFromCloud}
                disabled={syncing}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                title="Download from Cloud"
              >
                <CloudDownload size={20} />
                {syncing ? 'Syncing...' : 'Download'}
              </button>
              <button
                onClick={handleUploadToCloud}
                disabled={syncing}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                title="Upload to Cloud"
              >
                <Cloud size={20} />
                {syncing ? 'Syncing...' : 'Upload'}
              </button>
              <button
                onClick={() => setShowPrintManager(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Printer size={20} />
                Print
              </button>
              <button
                onClick={() => {
                  setEditingProject(undefined);
                  setDuplicateData(undefined);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-md w-fit">
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>
          <button
            onClick={() => {
              setFilterByStatus(null);
              switchToListView();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'list'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={18} />
            Projects List
          </button>
        </div>
      </div>

        {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {view === 'dashboard' ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Status Overview</h2>
            <div className="h-[500px]">
              <DashboardChart projects={projects} />
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div 
                onClick={() => {
                  setFilterByStatus(null);
                  switchToListView();
                }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 text-center border-2 border-slate-200 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <p className="text-3xl font-bold text-slate-700">{projects.length}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">Total</p>
              </div>
              {statusCounts.map((item) => (
                <div
                  key={item.status}
                  onClick={() => {
                    switchToListView(item.status);
                  }}
                  className="rounded-xl p-4 text-center border-2 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
                  style={{ 
                    backgroundColor: `${item.color}15`,
                    borderColor: `${item.color}40`
                  }}
                >
                  <p className="text-3xl font-bold" style={{ color: item.color }}>
                    {item.count}
                  </p>
                  <p className="text-xs text-gray-700 font-medium mt-1 leading-tight">
                    {item.abbreviation}
                  </p>
                </div>
              ))}
            </div>
          </div>
            ) : (
              <ProjectList
                projects={projects}
                onEdit={handleEdit}
                onDelete={deleteProject}
                onDuplicate={handleDuplicate}
                onUpdateHistory={updateProjectHistory}
                initialFilter={filterByStatus}
              />
            )}
        </main>

        {/* Project Form Modal */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            initialData={duplicateData}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(undefined);
              setDuplicateData(undefined);
            }}
          />
        )}
      </div>

      {/* Print Manager */}
      {showPrintManager && (
        <PrintManager
          projects={projects}
          onClose={() => setShowPrintManager(false)}
        />
      )}
    </div>
  );
}
