'use client';

import { useMemo } from 'react';
import { Project, DESIGN_STATUS_COLORS } from '@/types/project';
import { PrintConfiguration } from './PrintConfig';

interface PrintPreviewProps {
  projects: Project[];
  config: PrintConfiguration;
}

// Helper function to format dates as DD-MM-YYYY
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export function PrintPreview({ projects, config }: PrintPreviewProps) {
  // Apply filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (config.designStatus && project.designStatus !== config.designStatus) {
        return false;
      }
      if (config.district && project.district !== config.district) {
        return false;
      }
      if (config.lac && project.lac !== config.lac) {
        return false;
      }
      if (config.asDateFrom && project.asDetails.date) {
        if (new Date(project.asDetails.date) < new Date(config.asDateFrom)) {
          return false;
        }
      }
      if (config.asDateTo && project.asDetails.date) {
        if (new Date(project.asDetails.date) > new Date(config.asDateTo)) {
          return false;
        }
      }
      return true;
    });
  }, [projects, config]);

  // Apply sorting
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (config.sortBy) {
        case 'projectName':
          aValue = a.projectName;
          bValue = b.projectName;
          break;
        case 'district':
          aValue = a.district;
          bValue = b.district;
          break;
        case 'lac':
          aValue = a.lac;
          bValue = b.lac;
          break;
        case 'designStatus':
          aValue = a.designStatus;
          bValue = b.designStatus;
          break;
        case 'asDate':
          aValue = a.asDetails.date || '';
          bValue = b.asDetails.date || '';
          break;
        case 'arDate':
          aValue = a.arDetails.date || '';
          bValue = b.arDetails.date || '';
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = a.projectName;
          bValue = b.projectName;
      }

      if (aValue < bValue) return config.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return config.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredProjects, config.sortBy, config.sortOrder]);

  // Group projects
  const groupedProjects = useMemo(() => {
    if (config.groupBy === 'none') {
      return { 'All Projects': sortedProjects };
    }

    const groups: Record<string, Project[]> = {};
    sortedProjects.forEach((project) => {
      let groupKey: string;
      switch (config.groupBy) {
        case 'designStatus':
          groupKey = project.designStatus;
          break;
        case 'district':
          groupKey = project.district;
          break;
        case 'lac':
          groupKey = project.lac;
          break;
        default:
          groupKey = 'All Projects';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(project);
    });

    return groups;
  }, [sortedProjects, config.groupBy]);

  // Get column value
  const getColumnValue = (project: Project, columnId: string): string => {
    switch (columnId) {
      case 'projectName':
        return project.projectName;
      case 'district':
        return project.district;
      case 'lac':
        return project.lac;
      case 'designStatus':
        return project.designStatus;
      case 'asStatus':
        return project.asDetails.status || '-';
      case 'asNumber':
        return project.asDetails.number || '-';
      case 'asDate':
        return project.asDetails.date ? formatDate(project.asDetails.date) : '-';
      case 'arStatus':
        return project.arDetails.status || '-';
      case 'arNumber':
        return project.arDetails.number || '-';
      case 'arDate':
        return project.arDetails.date ? formatDate(project.arDetails.date) : '-';
      case 'arFloors':
        return project.arDetails.numberOfFloors || '-';
      case 'arArea':
        return project.arDetails.totalArea || '-';
      case 'aeeName':
        return project.contacts.aeeName || '-';
      case 'aeePhone':
        return project.contacts.aeePhone || '-';
      case 'contractorName':
        return project.contacts.contractorName || '-';
      case 'updatedAt':
        return formatDate(project.updatedAt);
      case 'projectHistory':
        return ''; // Handle separately with JSX
      default:
        return '-';
    }
  };

  // Get column label
  const getColumnLabel = (columnId: string): string => {
    const labels: Record<string, string> = {
      projectName: 'Project Name',
      district: 'District',
      lac: 'LAC',
      designStatus: 'Design Status',
      asStatus: 'AS Status',
      asNumber: 'AS Number',
      asDate: 'AS Date',
      arStatus: 'AR Status',
      arNumber: 'AR Number',
      arDate: 'AR Date',
      arFloors: 'No. of Floors',
      arArea: 'Total Area',
      aeeName: 'AEE Name',
      aeePhone: 'AEE Phone',
      contractorName: 'Contractor',
      updatedAt: 'Last Updated',
      projectHistory: 'Project History',
    };
    return labels[columnId] || columnId;
  };

  const fontSizeClass = config.fontSize === 'small' ? 'text-xs' : config.fontSize === 'large' ? 'text-base' : 'text-sm';

  // Calculate column widths based on column type
  const getColumnWidth = (columnId: string): string => {
    const widthMap: Record<string, string> = {
      projectName: '12%',
      district: '6%',
      lac: '6%',
      designStatus: '8%',
      asStatus: '6%',
      asNumber: '6%',
      asDate: '6%',
      arStatus: '6%',
      arNumber: '6%',
      arDate: '6%',
      arFloors: '4%',
      arArea: '6%',
      aeeName: '8%',
      aeePhone: '7%',
      contractorName: '10%',
      updatedAt: '7%',
      projectHistory: '20%',
    };
    return widthMap[columnId] || 'auto';
  };

  const totalColumns = config.selectedColumns.length + 1; // +1 for serial number
  const serialWidth = '3%';

  // Get page size CSS
  const getPageSizeCSS = () => {
    switch (config.pageSize) {
      case 'A3':
        return config.pageStyle === 'portrait' ? '297mm 420mm' : '420mm 297mm';
      case 'A4':
      default:
        return config.pageStyle === 'portrait' ? '210mm 297mm' : '297mm 210mm';
    }
  };

  // Get page dimensions for preview
  const getPageDimensions = () => {
    const margin = 20; // 20mm margins (1cm on each side = 2cm total)
    switch (config.pageSize) {
      case 'A3':
        return {
          width: config.pageStyle === 'portrait' ? '297mm' : '420mm',
          height: config.pageStyle === 'portrait' ? '420mm' : '297mm',
          contentWidth: config.pageStyle === 'portrait' ? 'calc(297mm - 40mm)' : 'calc(420mm - 40mm)',
        };
      case 'A4':
      default:
        return {
          width: config.pageStyle === 'portrait' ? '210mm' : '297mm',
          height: config.pageStyle === 'portrait' ? '297mm' : '210mm',
          contentWidth: config.pageStyle === 'portrait' ? 'calc(210mm - 40mm)' : 'calc(297mm - 40mm)',
        };
    }
  };

  const pageDimensions = getPageDimensions();

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: ${getPageSizeCSS()};
            margin: 1cm;
            @top-right {
              content: "Page " counter(page) " of " counter(pages);
              font-size: 10pt;
              color: #000;
            }
          }
          .page-preview {
            width: 100% !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            page-break-after: auto;
          }
          .page-break-indicator {
            display: none !important;
          }
          
          /* Hide the inline page number display during print */
          .page-number {
            display: none !important;
          }
        }
        @media screen {
          .page-preview {
            width: ${pageDimensions.width};
            min-height: ${pageDimensions.height};
            margin: 20px auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            box-sizing: border-box;
            page-break-after: always;
          }
          .page-break-indicator {
            margin: 20px auto;
            padding: 10px;
            background: #f3f4f6;
            border: 2px dashed #9ca3af;
            text-align: center;
            color: #6b7280;
            font-weight: bold;
            width: ${pageDimensions.width};
            box-sizing: border-box;
          }
        }
      `}</style>
      
      <div className="page-preview" style={{ color: '#000', visibility: 'visible', opacity: 1 }}>
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-800 pb-4" style={{ visibility: 'visible' }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#000', visibility: 'visible' }}>Projects Report</h1>
            <div className="mt-2 text-sm flex flex-wrap gap-4" style={{ color: '#000', visibility: 'visible' }}>
              <span>Generated: {formatDate(new Date())}</span>
              <span>Total Projects: {sortedProjects.length}</span>
              {config.designStatus && <span>Status: {config.designStatus}</span>}
              {config.district && <span>District: {config.district}</span>}
              {config.groupBy !== 'none' && <span>Grouped by: {config.groupBy}</span>}
            </div>
          </div>
          <div className="text-sm page-number" style={{ color: '#000' }}>
            Page <span className="page-current">1</span> of <span className="page-total">1</span>
          </div>
        </div>
      </div>

      {/* Single Table */}
      <div className="overflow-x-auto">
        <table 
          className={`w-full border-collapse border border-gray-300 ${fontSizeClass}`}
          style={{ tableLayout: 'fixed' }}
        >
          <colgroup>
            <col style={{ width: serialWidth }} />
            {config.selectedColumns.map((columnId) => (
              <col key={columnId} style={{ width: getColumnWidth(columnId) }} />
            ))}
          </colgroup>
          <thead>
            {/* Main header row with grouped columns */}
            <tr className="bg-gray-300">
              <th 
                className="border border-gray-300 px-2 py-2 text-center font-bold" 
                style={{ color: '#000', borderWidth: '2px', borderStyle: 'solid', borderColor: '#000' }}
                rowSpan={2}
              >
                #
              </th>
              {config.selectedColumns.map((columnId, idx) => {
                const asColumns = ['asStatus', 'asNumber', 'asDate'];
                const arColumns = ['arStatus', 'arNumber', 'arDate', 'arFloors', 'arArea'];
                const isASColumn = asColumns.includes(columnId);
                const isARColumn = arColumns.includes(columnId);
                
                // Check if this is the first AS or AR column
                const isFirstASColumn = isASColumn && config.selectedColumns.slice(0, idx).every(id => !asColumns.includes(id));
                const isFirstARColumn = isARColumn && config.selectedColumns.slice(0, idx).every(id => !arColumns.includes(id));
                
                // Count how many AS/AR columns are selected
                const asColCount = config.selectedColumns.filter(id => asColumns.includes(id)).length;
                const arColCount = config.selectedColumns.filter(id => arColumns.includes(id)).length;
                
                if (isFirstASColumn && asColCount > 0) {
                  return (
                    <th 
                      key={`as-group-${columnId}`}
                      className="border border-gray-300 px-2 py-2 text-center font-bold" 
                      style={{ color: '#000', borderWidth: '2px', borderStyle: 'solid', borderColor: '#000' }}
                      colSpan={asColCount}
                    >
                      AS Details
                    </th>
                  );
                } else if (isFirstARColumn && arColCount > 0) {
                  return (
                    <th 
                      key={`ar-group-${columnId}`}
                      className="border border-gray-300 px-2 py-2 text-center font-bold" 
                      style={{ color: '#000', borderWidth: '2px', borderStyle: 'solid', borderColor: '#000' }}
                      colSpan={arColCount}
                    >
                      AR Details
                    </th>
                  );
                } else if (!isASColumn && !isARColumn) {
                  return (
                    <th 
                      key={`single-${columnId}`}
                      className="border border-gray-300 px-2 py-2 text-center font-bold" 
                      style={{ color: '#000', borderWidth: '2px', borderStyle: 'solid', borderColor: '#000' }}
                      rowSpan={2}
                    >
                      {getColumnLabel(columnId)}
                    </th>
                  );
                }
                return null;
              })}
            </tr>
            
            {/* Sub-header row with individual column names */}
            <tr className="bg-gray-200">
              {config.selectedColumns.map((columnId) => {
                const asColumns = ['asStatus', 'asNumber', 'asDate'];
                const arColumns = ['arStatus', 'arNumber', 'arDate', 'arFloors', 'arArea'];
                const isASColumn = asColumns.includes(columnId);
                const isARColumn = arColumns.includes(columnId);
                
                // Only render sub-headers for AS/AR columns
                if (isASColumn || isARColumn) {
                  return (
                    <th
                      key={columnId}
                      className="border border-gray-300 px-2 py-2 text-left font-semibold"
                      style={{ color: '#000', borderWidth: '2px', borderStyle: 'solid', borderColor: '#000' }}
                    >
                      {getColumnLabel(columnId)}
                    </th>
                  );
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedProjects).map(([groupName, groupProjects], groupIndex) => (
              <>
                {/* Group header row */}
                {config.groupBy !== 'none' && (
                  <tr key={`group-${groupName}`} className="bg-gray-200">
                    <td 
                      colSpan={config.selectedColumns.length + 1}
                      className="border border-gray-300 px-3 py-2 font-bold text-left"
                      style={{ color: '#000', borderWidth: '2px', borderStyle: 'solid', borderColor: '#000' }}
                    >
                      {groupName} ({groupProjects.length})
                    </td>
                  </tr>
                )}
                
                {/* Data rows for this group */}
                {groupProjects.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-2 py-2" style={{ color: '#000' }}>
                      {index + 1}
                    </td>
                    {config.selectedColumns.map((columnId) => (
                      <td
                        key={columnId}
                        className="border border-gray-300 px-2 py-2 break-words"
                        style={{ color: '#000' }}
                      >
                        {columnId === 'projectHistory' ? (
                          <div>
                            {project.history.map((entry, idx) => (
                              <div key={entry.id} style={{ color: '#000' }}>
                                {formatDate(entry.date)}: {entry.event}
                              </div>
                            ))}
                          </div>
                        ) : (
                          getColumnValue(project, columnId)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {sortedProjects.length === 0 && (
        <div className="text-center py-12" style={{ color: '#000' }}>
          No projects match the selected filters.
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-center print-footer" style={{ color: '#666' }}>
        <p>Projects Tracker - Generated on {formatDate(new Date())} at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
      </div>
    </div>
    </>
  );
}
