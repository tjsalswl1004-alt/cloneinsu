export type ClaimStatus = 'DRAFT' | 'SENT' | 'FAILED' | 'PAID';

export interface Customer {
  id: number;
  name: string;
  idFront: string;
  idBack?: string;
  phone: string;
  createdAt?: string;
}

export interface InsuranceCompany {
  id: number;
  name: string;
  shortName: string;
  category: string;
  color: string;
  vfax: boolean;
}

export interface ClaimAccount {
  accountType: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

export interface ClaimSignature {
  signMethod: string;
  signatureData?: string;
}

export interface Attachment {
  id: number;
  originalName: string;
  fileSize: number;
}

export interface Claim {
  id: number;
  customer: Customer;
  insuranceCompany: InsuranceCompany;
  sameAsInsured?: boolean;
  accidentType?: string;
  accidentDate?: string;
  accidentDetail?: string;
  autoInsuranceClaimed?: boolean;
  autoInsuranceCompany?: string;
  ownVehicleInsurance?: string;
  vehiclePlateNumber?: string;
  hospitalName?: string;
  amount?: number | null;
  status: ClaimStatus;
  account?: ClaimAccount;
  signature?: ClaimSignature;
  attachments?: Attachment[];
  attachmentCount?: number;
  createdAt: string;
}

export interface ClaimStats {
  totalAmount: number;
  total: number;
  sent: number;
  paid: number;
  completionRate: number;
}
