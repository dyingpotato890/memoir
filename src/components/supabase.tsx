import { createClient } from "@supabase/supabase-js";
import type { GroupedEvent, Link } from "../types/types";
import type { EventRecord, ReportItem } from "../types/db";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY! as string;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const groupLinksByEvent = (links: Link[], eventMeta: Record<string, EventRecord>): GroupedEvent[] => {
    const grouped: Record<string, GroupedEvent> = {};

    for (const link of links) {
        const name = link.event_name;
        if (!grouped[name]) {
            const meta = Object.values(eventMeta).find(e => e.name === name);
            grouped[name] = {
                eventName: name,
                startDate: meta?.start_date,
                endDate: meta?.end_date,
                links: [],
            };
        }
        grouped[name].links.push(link);
    }

    return Object.values(grouped);
};

export const fetchEvents = async (): Promise<GroupedEvent[]> => {
    const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("id, title, url, click_count, event_id, author, link_date");

    if (linksError || !linksData) return [];

    const eventIds = [...new Set(linksData.map((l) => l.event_id))];

    const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("id, name, start_date, end_date")
        .in("id", eventIds);

    if (eventsError || !eventsData) return [];

    const eventMeta: Record<string, EventRecord> = {};
    for (const e of eventsData) {
        eventMeta[e.id] = e;
    }

    const links: Link[] = linksData.map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        click_count: l.click_count,
        event_name: eventMeta[l.event_id]?.name ?? "Unknown",
        author: l.author ?? undefined,
        link_date: l.link_date ?? undefined,
    }));

    const groupedEvents = groupLinksByEvent(links, eventMeta);

    groupedEvents.sort((a, b) => {
        if (!a.startDate && !b.startDate) return a.eventName.localeCompare(b.eventName);
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    groupedEvents.forEach((event) => {
        event.links.sort((a, b) => {
            if (a.link_date && b.link_date) {
                const dateDiff = new Date(a.link_date).getTime() - new Date(b.link_date).getTime();
                if (dateDiff !== 0) return dateDiff;
            }
            if (a.link_date && !b.link_date) return -1;
            if (!a.link_date && b.link_date) return 1;
            return a.title.localeCompare(b.title);
        });
    });

    return groupedEvents;
};

export const incrementClickCount = async (linkId: number) => {
    const { data: currentLink, error: fetchError } = await supabase
        .from("links")
        .select("click_count")
        .eq("id", linkId)
        .single();

    if (fetchError) return;

    await supabase
        .from("links")
        .update({ click_count: currentLink.click_count + 1 })
        .eq("id", linkId);
};

export const submitReport = async (eventName: string, items: ReportItem[]): Promise<void> => {
    const { data: report, error: reportError } = await supabase
        .from("reports")
        .insert({ event_name: eventName })
        .select("id")
        .single();

    if (reportError || !report) throw new Error(reportError?.message ?? "Failed to create report");

    const itemRows = items.map(item => ({
        report_id: report.id,
        url: item.url,
        reason: item.reason,
        reporter_name: item.reporter_name,
    }));

    const { error: itemsError } = await supabase.from("report_items").insert(itemRows);

    if (itemsError) throw new Error(itemsError.message);
};