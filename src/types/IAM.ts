import { RoleApiDaum } from "./role";

export interface IAMFormDataDaum {
  user_id: string;
  role_id: string;
}

export interface BodyIAMResponseApiDaum {
  success: string;
  message: string;
  data: IAMFormDataDaum[];
}
