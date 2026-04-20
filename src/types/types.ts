export interface Link {
    id: number;
    title: string;
    url: string;
    click_count: number;
    event_name: string;
    author?: string;       // nullable — per-link attribution
    link_date?: string;    // nullable — day-specific date within a range event (e.g. IV day 1, day 2)
}

export interface GroupedEvent {
    eventName: string;
    startDate?: string;    // from events table
    endDate?: string;      // from events table
    links: Link[];
}

export type EventLink = GroupedEvent['links'][number];