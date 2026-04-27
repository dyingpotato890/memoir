export interface ReportItem {
    filename: string;
    reason: string;
}

export interface EventRecord {
    id: string;
    name: string;
    start_date?: string;
    end_date?: string;
}