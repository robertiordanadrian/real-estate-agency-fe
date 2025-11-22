import { ERole } from "@/common/enums/role/role.enums";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: ERole;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}
