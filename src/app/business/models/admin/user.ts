import {AppRole} from "./app-role";
import {WilayaRegion} from "../referencial/wilaya-region";

export class User {
  id: number;
  username: string;
  fullName: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  phone: string;
  department: string;
  address: string;
  regionId: string;
  enabled: boolean;
  roleSet: AppRole[];
  wilayaSet: WilayaRegion[];

}
