import 'dotenv/config';
import { supabase } from '../services/supabase';

const SAMPLE_EVENTS = [
  {
    title: 'AI Innovation Hackathon 2026',
    organizer: 'TechCorp Labs',
    type: 'Hackathon',
    hackathon_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(), // 2 days left
    registration_url: 'https://devpost.com',
    mode: 'Online',
    venue: null,
    registration_fee: 'Free',
    eligibility: 'Open to all students & developers',
    min_team_size: 1,
    max_team_size: 4,
    platform: 'Devpost',
  },
  {
    title: 'Full-Stack Web Development Workshop',
    organizer: 'CodeAcademy Guild',
    type: 'Workshop',
    hackathon_date: new Date(Date.now() + 10 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    registration_url: 'https://unstop.com',
    mode: 'Offline',
    venue: 'Auditorium Hall B, Tech Campus, Cityville',
    registration_fee: 'Free',
    eligibility: 'Beginner & Intermediate Coders',
    min_team_size: 1,
    max_team_size: 1,
    platform: 'Unstop',
  },
  {
    title: 'Global AI & Cloud Summit 2026',
    organizer: 'Cloud Native Foundation',
    type: 'Conference',
    hackathon_date: new Date(Date.now() + 20 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    registration_url: 'https://hack2skill.com',
    mode: 'Hybrid',
    venue: 'Convention Center, Metro City & Online Stream',
    registration_fee: 'Paid',
    eligibility: 'Researchers, Engineers & Students',
    min_team_size: 1,
    max_team_size: 2,
    platform: 'Hack2Skill',
  },
  {
    title: 'National Algorithmic Coding Championship',
    organizer: 'Competitive Coders Club',
    type: 'Competition',
    hackathon_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 1 * 86400000).toISOString(), // 1 day left (urgent)
    registration_url: 'https://unstop.com',
    mode: 'Online',
    venue: null,
    registration_fee: 'Free',
    eligibility: 'Undergraduate Computer Science Students',
    min_team_size: 1,
    max_team_size: 3,
    platform: 'Unstop',
  },
  {
    title: 'UiPath Automation Challenge 2026',
    organizer: 'UiPath Academic Alliance',
    type: 'Hackathon',
    hackathon_date: new Date(Date.now() + 12 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
    registration_url: 'https://devpost.com',
    mode: 'Online',
    venue: null,
    registration_fee: 'Free',
    eligibility: 'RPA Enthusiasts & Automation Developers',
    min_team_size: 2,
    max_team_size: 5,
    platform: 'Devpost',
  },
];

async function seed() {
  console.log('Seeding sample events into Supabase events table...');
  const { data, error } = await supabase
    .from('events')
    .insert(SAMPLE_EVENTS)
    .select('*');

  if (error) {
    console.error('Error seeding events:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${data.length} sample events!`);
  process.exit(0);
}

seed();
