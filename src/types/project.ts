export interface ASDetails {
  status: string;
  number: string;
  date: string;
}

export interface ARDetails {
  status: string;
  number: string;
  date: string;
  revisionDetails: string;
  numberOfFloors: string;
  totalArea: string;
}

export interface Contacts {
  aeName: string;
  aePhone: string;
  aeeName: string;
  aeePhone: string;
  contractorName: string;
  contractorPhone: string;
}

export interface HistoryEntry {
  id: string;
  event: string;
  date: string;
}

export interface Project {
  id: string;
  projectName: string;
  district: string;
  lac: string;
  asDetails: ASDetails;
  srDetails: string;
  arDetails: ARDetails;
  contacts: Contacts;
  designStatus: DesignStatus;
  history: HistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export enum DesignStatus {
  TENTATIVE_ONGOING = "01 Tentative Design Ongoing",
  TENTATIVE_ON_HOLD = "02 Tentative Design On Hold",
  TENTATIVE_ISSUED = "03 Tentative Design Issued",
  DETAILED_ONGOING = "04 Detailed Design Ongoing",
  DETAILED_ON_HOLD = "05 Detailed Design On Hold",
  DETAILED_ISSUED = "06 Detailed Design Issued",
  FILE_NOT_OPENED = "07 File Not Yet Opened",
  DISCARDED = "08 Discarded Work",
  RETURNED_TO_SITE = "09 Returned to Site",
}

export const DESIGN_STATUS_COLORS: Record<DesignStatus, string> = {
  [DesignStatus.TENTATIVE_ONGOING]: "#3b82f6", // blue
  [DesignStatus.TENTATIVE_ON_HOLD]: "#f59e0b", // amber
  [DesignStatus.TENTATIVE_ISSUED]: "#10b981", // emerald
  [DesignStatus.DETAILED_ONGOING]: "#8b5cf6", // violet
  [DesignStatus.DETAILED_ON_HOLD]: "#ef4444", // red
  [DesignStatus.DETAILED_ISSUED]: "#06b6d4", // cyan
  [DesignStatus.FILE_NOT_OPENED]: "#6b7280", // gray
  [DesignStatus.DISCARDED]: "#dc2626", // dark red
  [DesignStatus.RETURNED_TO_SITE]: "#ec4899", // pink
};

export const ALL_DESIGN_STATUSES = Object.values(DesignStatus);
