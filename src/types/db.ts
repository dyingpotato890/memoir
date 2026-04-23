export interface ReportItem {
    url: string;
    reason: string;
    reporter_name: string | null;
}

export interface EventRecord {
    id: string;
    name: string;
    start_date?: string;
    end_date?: string;
}