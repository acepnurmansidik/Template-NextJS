import { AddressInfo } from "./facility";

interface ContactInfo {
  phone: string;
  email: string;
  manager_name: string;
}

interface Location {
  type: string;
  coordinates: number[];
}
export interface FormDataBranchProps {
  name: string;
  notes: string;
  description: string;
  contact_info: ContactInfo;
  address: AddressInfo;
  location: Location;
  // Hanya dipakai oleh update form (create default aktif).
  is_active?: boolean;
}
