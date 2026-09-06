import type { CategoryEvent } from '../types/categoryEvent';

export const mockHackathons: CategoryEvent[] = [
  { id: 'hack-001', category: 'hackathon', title: 'AI Innovation Hackathon', organizer: 'Tech Community', location: 'Chennai, India', mode: 'Offline', startDate: '2026-10-15', endDate: '2026-10-16', registrationDeadline: '2026-10-10', teamSize: '2–4', prize: '₹50,000', tags: ['AI', 'ML', 'Innovation'], status: 'Open' },
  { id: 'hack-002', category: 'hackathon', title: 'Cloud Computing Challenge', organizer: 'AWS Community', location: 'Online', mode: 'Online', startDate: '2026-11-02', endDate: '2026-11-03', registrationDeadline: '2026-10-28', teamSize: '1–3', prize: '₹1,00,000', tags: ['Cloud', 'AWS'], status: 'Upcoming' },
  { id: 'hack-003', category: 'hackathon', title: 'Campus Startup Hack', organizer: 'Startup India', location: 'Bengaluru, India', mode: 'Hybrid', startDate: '2026-09-20', endDate: '2026-09-21', registrationDeadline: '2026-09-15', teamSize: '3–5', prize: '₹75,000', tags: ['Startup', 'Pitch'], status: 'Open' },
  { id: 'hack-004', category: 'hackathon', title: 'Generative AI Buildathon', organizer: 'OpenAI Collective', location: 'Hyderabad, India', mode: 'Online', startDate: '2026-10-28', endDate: '2026-10-29', registrationDeadline: '2026-10-22', teamSize: '2–4', prize: '₹60,000', tags: ['GenAI', 'LLM'], status: 'Open' },
  { id: 'hack-005', category: 'hackathon', title: 'Sustainable Tech Hackathon', organizer: 'GreenTech', location: 'Delhi, India', mode: 'Offline', startDate: '2026-11-12', endDate: '2026-11-13', registrationDeadline: '2026-11-05', teamSize: '2–6', prize: '₹80,000', tags: ['Sustainability', 'IoT'], status: 'Upcoming' },
  { id: 'hack-006', category: 'hackathon', title: 'FinTech Hack', organizer: 'Razorpay', location: 'Mumbai, India', mode: 'Hybrid', startDate: '2026-12-01', endDate: '2026-12-02', registrationDeadline: '2026-11-25', teamSize: '2–4', prize: '₹1,20,000', tags: ['FinTech', 'Payments'], status: 'Upcoming' },
];

export const mockSymposiums: CategoryEvent[] = [
  { id: 'sym-001', category: 'symposium', title: 'International Symposium on Artificial Intelligence', organizer: 'IIT Madras', institution: 'IIT Madras', location: 'Chennai, India', mode: 'Offline', startDate: '2026-11-10', endDate: '2026-11-12', registrationDeadline: '2026-10-30', researchArea: 'AI', tags: ['AI', 'Research'], status: 'Open' },
  { id: 'sym-002', category: 'symposium', title: 'Research Symposium on Emerging Technologies', organizer: 'IISc', institution: 'IISc Bengaluru', location: 'Bengaluru, India', mode: 'Hybrid', startDate: '2026-10-05', endDate: '2026-10-06', registrationDeadline: '2026-09-28', researchArea: 'Emerging Tech', tags: ['Tech', 'Research'], status: 'Open' },
  { id: 'sym-003', category: 'symposium', title: 'Student Research Symposium', organizer: 'Anna University', institution: 'Anna University', location: 'Chennai, India', mode: 'Offline', startDate: '2026-09-25', endDate: '2026-09-25', registrationDeadline: '2026-09-18', researchArea: 'Multidisciplinary', tags: ['Student', 'Research'], status: 'Closed' },
  { id: 'sym-004', category: 'symposium', title: 'Computing and Innovation Symposium', organizer: 'BITS Pilani', institution: 'BITS Pilani', location: 'Online', mode: 'Online', startDate: '2026-12-05', endDate: '2026-12-06', registrationDeadline: '2026-11-28', researchArea: 'Computing', tags: ['Computing'], status: 'Upcoming' },
  { id: 'sym-005', category: 'symposium', title: 'Symposium on Sustainable Development', organizer: 'TERI', institution: 'TERI School', location: 'Delhi, India', mode: 'Offline', startDate: '2026-11-20', endDate: '2026-11-21', registrationDeadline: '2026-11-10', researchArea: 'Sustainability', tags: ['Sustainability'], status: 'Upcoming' },
];

export const mockConferences: CategoryEvent[] = [
  { id: 'conf-001', category: 'conference', title: 'International Conference on Computer Science', organizer: 'IEEE', institution: 'IEEE CS', location: 'Bengaluru, India', mode: 'Hybrid', startDate: '2026-12-10', endDate: '2026-12-12', registrationDeadline: '2026-11-30', submissionDeadline: '2026-10-15', researchArea: 'Computer Science', tags: ['CS', 'IEEE'], status: 'Open' },
  { id: 'conf-002', category: 'conference', title: 'Conference on AI and Data Science', organizer: 'ACM', institution: 'ACM India', location: 'Hyderabad, India', mode: 'Offline', startDate: '2026-11-18', endDate: '2026-11-20', registrationDeadline: '2026-11-05', submissionDeadline: '2026-09-20', researchArea: 'AI/DS', tags: ['AI', 'Data Science'], status: 'Open' },
  { id: 'conf-003', category: 'conference', title: 'International Conference on Cloud Computing', organizer: 'Springer', institution: 'Springer Nature', location: 'Online', mode: 'Online', startDate: '2026-10-20', endDate: '2026-10-22', registrationDeadline: '2026-10-10', submissionDeadline: '2026-08-15', researchArea: 'Cloud', tags: ['Cloud'], status: 'Closed' },
  { id: 'conf-004', category: 'conference', title: 'Emerging Technologies Conference', organizer: 'Elsevier', institution: 'Elsevier', location: 'Chennai, India', mode: 'Offline', startDate: '2026-12-18', endDate: '2026-12-19', registrationDeadline: '2026-12-05', submissionDeadline: '2026-11-01', researchArea: 'Emerging Tech', tags: ['Tech'], status: 'Upcoming' },
  { id: 'conf-005', category: 'conference', title: 'Conference on Cybersecurity', organizer: 'ISACA', institution: 'ISACA Chennai', location: 'Mumbai, India', mode: 'Hybrid', startDate: '2026-11-05', endDate: '2026-11-06', registrationDeadline: '2026-10-25', submissionDeadline: '2026-09-10', researchArea: 'Security', tags: ['Security'], status: 'Open' },
];

export const mockWorkshops: CategoryEvent[] = [
  { id: 'ws-001', category: 'workshop', title: 'AWS Cloud Workshop', organizer: 'AWS', location: 'Chennai, India', mode: 'Offline', startDate: '2026-10-08', endDate: '2026-10-08', registrationDeadline: '2026-10-05', duration: '1 Day', topic: 'Cloud', level: 'Beginner', fee: 'Free', tags: ['AWS', 'Cloud'], status: 'Open' },
  { id: 'ws-002', category: 'workshop', title: 'Hands-on Generative AI Workshop', organizer: 'Google', location: 'Online', mode: 'Online', startDate: '2026-11-15', endDate: '2026-11-15', registrationDeadline: '2026-11-10', duration: '4 Hours', topic: 'GenAI', level: 'Intermediate', fee: '₹500', tags: ['GenAI'], status: 'Open' },
  { id: 'ws-003', category: 'workshop', title: 'Machine Learning Bootcamp', organizer: 'UpGrad', location: 'Bengaluru, India', mode: 'Offline', startDate: '2026-10-12', endDate: '2026-10-14', registrationDeadline: '2026-10-08', duration: '3 Days', topic: 'ML', level: 'Advanced', fee: '₹2000', tags: ['ML'], status: 'Upcoming' },
  { id: 'ws-004', category: 'workshop', title: 'Web Development Workshop', organizer: 'Meta', location: 'Hyderabad, India', mode: 'Hybrid', startDate: '2026-11-22', endDate: '2026-11-23', registrationDeadline: '2026-11-18', duration: '2 Days', topic: 'Web', level: 'Beginner', fee: 'Free', tags: ['Web'], status: 'Open' },
  { id: 'ws-005', category: 'workshop', title: 'Cybersecurity Fundamentals Workshop', organizer: 'Cisco', location: 'Delhi, India', mode: 'Offline', startDate: '2026-12-02', endDate: '2026-12-02', registrationDeadline: '2026-11-28', duration: '1 Day', topic: 'Security', level: 'Beginner', fee: '₹1000', tags: ['Security'], status: 'Upcoming' },
];

export const mockByCategory = {
  hackathon: mockHackathons,
  symposium: mockSymposiums,
  conference: mockConferences,
  workshop: mockWorkshops,
};

export const allMockEvents: CategoryEvent[] = [...mockHackathons, ...mockSymposiums, ...mockConferences, ...mockWorkshops];
