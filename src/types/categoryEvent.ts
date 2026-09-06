export type Category = 'hackathon' | 'symposium' | 'conference' | 'workshop';

export interface CategoryEvent {
  id: string;
  category: Category;
  title: string;
  organizer: string;
  institution?: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  submissionDeadline?: string;
  teamSize?: string;
  prize?: string;
  duration?: string;
  fee?: string;
  level?: string;
  researchArea?: string;
  topic?: string;
  tags: string[];
  status: 'Open' | 'Closed' | 'Upcoming';
}
