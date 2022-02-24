import { User } from "../auth/user.model";

export interface Exercise {
  id: string;
  name: string;
  duration: number;
  questions: number;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
  user?: {} | User;
}