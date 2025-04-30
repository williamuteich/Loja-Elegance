import { Session } from "next-auth";

export interface UserInfo {
    name: string;
    email: string;
    image: string;
  }
  
  export type LoggedInSession = Session | null;
  