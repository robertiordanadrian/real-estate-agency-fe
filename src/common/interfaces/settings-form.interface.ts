import { ERole } from "../enums/role.enums";

export interface ISettingsForm {
  name: string;
  email: string;
  role: ERole;
  password: string;
  confirmPassword: string;
}
