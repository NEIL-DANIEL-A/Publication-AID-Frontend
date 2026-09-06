import type { Category, CategoryEvent } from '../types/categoryEvent';
import { mockByCategory } from '../data/mockEvents';

export function getEvents(category: Category, search = '', filters: Record<string, string> = {}): CategoryEvent[] {
  let data = [...mockByCategory[category]];

  if (search) {
    const q = search.toLowerCase();
    data = data.filter((e) => `${e.title} ${e.organizer} ${e.location} ${e.tags.join(' ')}`.toLowerCase().includes(q));
  }

  if (filters.mode) data = data.filter((e) => e.mode === filters.mode);
  if (filters.location) data = data.filter((e) => e.location.toLowerCase().includes(filters.location.toLowerCase()));
  if (filters.status) data = data.filter((e) => e.status === filters.status);
  if (filters.level && (category === 'workshop')) data = data.filter((e) => e.level === filters.level);
  if (filters.topic) data = data.filter((e) => e.topic === filters.topic || e.researchArea === filters.topic);

  return data;
}

export function getEventById(id: string): CategoryEvent | null {
  for (const cat of Object.keys(mockByCategory) as Category[]) {
    const found = mockByCategory[cat].find((e) => e.id === id);
    if (found) return found;
  }
  return null;
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const data = items.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit };
}
