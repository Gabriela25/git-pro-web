export interface User {
  id?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
  phone?: string;
  enabled?:boolean;
}