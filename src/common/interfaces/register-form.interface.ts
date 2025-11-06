import { ERole } from "common/enums/role.enums";

export interface IRegisterForm {
  name: string;
  email: string;
  phone: string;
  role: ERole;
  password?: string;
  profileImage?: File | null;
}
