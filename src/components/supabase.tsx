import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY! as string;
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const fetchEvents = async () => {
    const eventMap: Record<string, string> = {};

    const { data, error } = await supabase.from("links").select("*");
    if (!error) {
      for (let i: number = 0; i < data.length; i++) {
        const eventID = data[i].event_id;

        if (eventID in eventMap) {
          data[i].event_name = eventMap[eventID];

          delete data[i].event_id;
        } else {
          const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("name")
            .eq('id', eventID)
            .single();

          if (!eventError && eventData) {
            const eventName = eventData.name;

            data[i].event_name = eventName;
            eventMap[eventID] = eventName;

            delete data[i].event_id;
          }
        }
      }

      console.log(data) 
    } else {
      data ?? [];
    }

    return data || [];
};

export default fetchEvents;

// fetchEvents()