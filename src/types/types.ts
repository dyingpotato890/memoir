export interface Link {
    id: number;
    title: string;
    url: string;
    click_count: number;
    event_name: string;
    author?: string;
    link_date?: string;
}

export interface GroupedEvent {
    eventName: string;
    startDate?: string;
    endDate?: string;
    links: Link[];
}

export type EventLink = GroupedEvent['links'][number];