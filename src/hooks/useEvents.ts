import { useState, useEffect } from 'react';
import { fetchEvents } from '../components/supabase';
import type { GroupedEvent } from '../types/types';

export const useEvents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);

    useEffect(() => {
        fetchEvents().then((data) => {
            setGroupedEvents(data);
            setIsLoading(false);
        });
    }, []);

    return { isLoading, groupedEvents };
};