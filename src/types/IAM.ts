export interface IAMFormDataDaum {
  user_id: string;
  role_id: string;
}

export interface BodyIAMResponseApiDaum {
  success: string;
  message: string;
  data: IAMApiDaum[];
}

export interface IAMApiDaum {
  user_id: Record<string, any>;
  role_id: Record<string, any>;
}
