export interface Link {
    id: number;
    title: string;
    url: string;
    click_count: number;
    event_name: string;
}

export interface GroupedEvent {
    eventName: string;
    links: Link[];
}

export type EventLink = GroupedEvent['links'][number];