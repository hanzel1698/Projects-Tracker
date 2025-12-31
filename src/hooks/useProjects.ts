'use client';

import { useState, useEffect } from 'react';
import { Project, DesignStatus, HistoryEntry } from '@/types/project';

const STORAGE_KEY = 'projects-tracker-data';

// Simple UUID generator function
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Sample data for testing
const SAMPLE_PROJECTS: Project[] = [
  {
    id: generateId(),
    projectName: 'District Hospital Extension',
    district: 'Kozhikode',
    lac: 'Kozhikode North (LAC No. 27)',
    asDetails: {
      status: 'Approved',
      number: 'AS-2024-001',
      date: '2024-01-15'
    },
    srDetails: 'SR issued by Public Works Department on 10th Jan 2024',
    arDetails: {
      status: 'Approved',
      number: 'AR-2024-045',
      date: '2024-02-20',
      revisionDetails: 'R1 - Added emergency wing',
      numberOfFloors: '4',
      totalArea: '15000 sq.m'
    },
    contacts: {
      aeName: 'Rajesh Kumar',
      aePhone: '9876543210',
      aeeName: 'Priya Menon',
      aeePhone: '9876543211',
      contractorName: 'ABC Constructions',
      contractorPhone: '9876543212'
    },
    designStatus: DesignStatus.DETAILED_ONGOING,
    history: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: generateId(),
    projectName: 'Panchayat Office Building',
    district: 'Kannur',
    lac: 'Thalassery (LAC No. 13)',
    asDetails: {
      status: 'Pending',
      number: 'AS-2024-002',
      date: '2024-03-10'
    },
    srDetails: 'SR pending from local body',
    arDetails: {
      status: 'Under Review',
      number: 'AR-2024-078',
      date: '2024-04-15',
      revisionDetails: 'Original',
      numberOfFloors: '2',
      totalArea: '800 sq.m'
    },
    contacts: {
      aeName: 'Suresh Babu',
      aePhone: '9876543220',
      aeeName: 'Anjali Das',
      aeePhone: '9876543221',
      contractorName: 'Kerala Builders',
      contractorPhone: '9876543222'
    },
    designStatus: DesignStatus.TENTATIVE_ISSUED,
    history: [],
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-12-25')
  },
  {
    id: generateId(),
    projectName: 'Community Health Center',
    district: 'Malappuram',
    lac: 'Manjeri (LAC No. 37)',
    asDetails: {
      status: 'Approved',
      number: 'AS-2024-003',
      date: '2024-05-20'
    },
    srDetails: 'SR approved by Health Department',
    arDetails: {
      status: 'Issued',
      number: 'AR-2024-112',
      date: '2024-06-10',
      revisionDetails: 'R2 - Modified layout',
      numberOfFloors: '3',
      totalArea: '5000 sq.m'
    },
    contacts: {
      aeName: 'Mohammed Ali',
      aePhone: '9876543230',
      aeeName: 'Fathima Beevi',
      aeePhone: '9876543231',
      contractorName: 'Modern Constructions',
      contractorPhone: '9876543232'
    },
    designStatus: DesignStatus.DETAILED_ISSUED,
    history: [],
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-12-28')
  },
  {
    id: generateId(),
    projectName: 'Anganwadi Center',
    district: 'Wayanad',
    lac: 'Kalpetta (LAC No. 19)',
    asDetails: {
      status: 'Not Started',
      number: '',
      date: ''
    },
    srDetails: 'Awaiting SR from Women and Child Development Department',
    arDetails: {
      status: 'Not Started',
      number: '',
      date: '',
      revisionDetails: '',
      numberOfFloors: '1',
      totalArea: '200 sq.m'
    },
    contacts: {
      aeName: 'Thomas George',
      aePhone: '9876543240',
      aeeName: 'Mary Joseph',
      aeePhone: '9876543241',
      contractorName: '',
      contractorPhone: ''
    },
    designStatus: DesignStatus.FILE_NOT_OPENED,
    history: [],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: generateId(),
    projectName: 'Police Station Renovation',
    district: 'Palakkad',
    lac: 'Palakkad (LAC No. 56)',
    asDetails: {
      status: 'On Hold',
      number: 'AS-2024-004',
      date: '2024-08-05'
    },
    srDetails: 'SR on hold due to budget constraints',
    arDetails: {
      status: 'On Hold',
      number: 'AR-2024-145',
      date: '2024-09-12',
      revisionDetails: 'Original',
      numberOfFloors: '2',
      totalArea: '1200 sq.m'
    },
    contacts: {
      aeName: 'Vinod Kumar',
      aePhone: '9876543250',
      aeeName: 'Lakshmi Nair',
      aeePhone: '9876543251',
      contractorName: 'Supreme Builders',
      contractorPhone: '9876543252'
    },
    designStatus: DesignStatus.DETAILED_ON_HOLD,
    history: [],
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: generateId(),
    projectName: 'School Building Construction',
    district: 'Kasaragod',
    lac: 'Kasaragod (LAC No. 2)',
    asDetails: {
      status: 'Approved',
      number: 'AS-2024-005',
      date: '2024-10-01'
    },
    srDetails: 'SR approved by Education Department',
    arDetails: {
      status: 'In Progress',
      number: 'AR-2024-178',
      date: '2024-11-05',
      revisionDetails: 'Original',
      numberOfFloors: '3',
      totalArea: '8000 sq.m'
    },
    contacts: {
      aeName: 'Ashok Pillai',
      aePhone: '9876543260',
      aeeName: 'Reshma Das',
      aeePhone: '9876543261',
      contractorName: 'Excel Constructions',
      contractorPhone: '9876543262'
    },
    designStatus: DesignStatus.TENTATIVE_ONGOING,
    history: [],
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-12-30')
  }
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load projects from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if parsed data is valid and has the new structure
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if the first item has the new structure
          const hasNewStructure = parsed[0].asDetails && typeof parsed[0].asDetails === 'object';
          if (hasNewStructure) {
            setProjects(parsed.map((p: any) => ({
              ...p,
              history: p.history || [], // Add history field if missing
              createdAt: new Date(p.createdAt),
              updatedAt: new Date(p.updatedAt),
            })));
          } else {
            // Old structure detected, clear and load sample data
            console.log('Old data structure detected, loading sample data...');
            setProjects(SAMPLE_PROJECTS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
          }
        } else {
          // Empty array, load sample data
          setProjects(SAMPLE_PROJECTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
        }
      } catch (error) {
        console.error('Failed to parse stored projects:', error);
        setProjects(SAMPLE_PROJECTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      }
    } else {
      // Initialize with sample data if no stored data exists
      setProjects(SAMPLE_PROJECTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save projects to localStorage whenever they change
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, loading]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date() }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProjectHistory = (id: string, history: HistoryEntry[]) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, history, updatedAt: new Date() }
          : p
      )
    );
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    updateProjectHistory,
  };
}
