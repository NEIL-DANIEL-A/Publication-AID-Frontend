import { AnimatePresence, motion, Variants } from 'framer-motion';
import type { Event } from '../types/event';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  onViewDetail?: (id: string) => void;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function EventGrid({ events, onViewDetail }: EventGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            layout
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <EventCard event={event} onViewDetail={onViewDetail} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
