import { Database } from './database.types';

export * from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type BloodRequest = Database['public']['Tables']['blood_requests']['Row'];
export type DonationResponse = Database['public']['Tables']['donation_responses']['Row'];
export type DonationFeedback = Database['public']['Tables']['donation_feedback']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];

export interface UserSessionState {
  userId: string | null;
  email: string | null;
  role: 'user' | 'admin';
  onboardingCompleted: boolean;
  isAvailableToDonate: boolean;
}
