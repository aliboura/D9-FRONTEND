import {AppRole} from "./app-role";
import {WilayaRegion} from "../referencial/wilaya-region";

export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  regionId: string;
  wilayaID: string;
  imgProfile: string;
  enabled: boolean;
  expired: boolean;
  credentials: boolean;
  locked: boolean;
  roleSet: WilayaRegion[];
  wilayaSet: AppRole[];
}
