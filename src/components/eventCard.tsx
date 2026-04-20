import { LinkButton } from './linkButton';
import type { GroupedEvent } from '../types/types';

interface Props {
    event: GroupedEvent;
}

export const EventCard = ({ event }: Props) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50" />
            <h2
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {event.eventName}
            </h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
        </div>
        <div className="space-y-3">
            {event.links.map((link) => (
                <LinkButton key={link.id} link={link} />
            ))}
        </div>
    </div>
);