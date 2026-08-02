export interface SupplierAddress {
  street?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
}

export interface SupplierContact {
  phone?: string[];
  email?: string;
  contact_person?: string;
}

export interface SupplierApiDaum {
  _id: string;
  code: string;
  name: string;
  slug: string;
  contact_info?: SupplierContact;
  address?: SupplierAddress;
  is_active: boolean;
  created_at?: string;
}

export interface SupplierPayload {
  name: string;
  code?: string;
  contact_info?: SupplierContact;
  address?: SupplierAddress;
  is_active?: boolean;
}

export interface FormDataSupplierProps {
  name: string;
  code: string;
  contact_info: {
    phone: string;
    email: string;
    contact_person: string;
  };
  address: {
    street: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
  };
}
