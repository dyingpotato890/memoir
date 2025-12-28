import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY! as string;
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

interface Link {
  id: number;
  title: string;
  url: string;
  click_count: number;
  event_name: string;
}

interface GroupedEvent {
  eventName: string;
  links: Link[];
}

const groupLinksByEvent = (allLinks: Link[]): GroupedEvent[] => {
  const groupedData: GroupedEvent[]  = []; 

  for (let i: number = 0; i < allLinks.length; i++) {
    const event = allLinks[i];
    const eventName = event.event_name;

    // console.log(event.event_name);
    const group = groupedData.find(g => g.eventName === eventName);

    if (group) {
      group.links.push(event);
    } else {
      groupedData.push({
        eventName,
        links: [event],
      });
    }
  }

  return groupedData;
};

export const fetchEvents = async () : Promise<GroupedEvent[]> => {
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

      const groupedEvents = groupLinksByEvent(data);

      groupedEvents.sort((a, b) => 
        a.eventName.localeCompare(b.eventName)
      );

      // Sort links within each event alphabetically by title
      groupedEvents.forEach(event => {
        event.links.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      });

      return groupedEvents;
    } else {
      data ?? [];
    }

    return [];
};

export const incrementClickCount = async (linkId: number) => {
  // Get the current click count
  const { data: currentLink, error: fetchError } = await supabase
    .from('links')
    .select('click_count')
    .eq('id', linkId)
    .single();

  if (fetchError) {
    console.error('Error fetching link:', fetchError);
    return;
  }

  const newCount = currentLink.click_count + 1;

  const { error: updateError } = await supabase
    .from('links')
    .update({ click_count: newCount })
    .eq('id', linkId);

  if (updateError) {
    console.error('Error updating click count:', updateError);
  }
};

// export default fetchEvents;

// fetchEvents()