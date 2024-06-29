const basicCreds = btoa(`${process.env.TICKET_TAILOR_API_KEY}:`);

export async function get_ticket_limit_and_total(
  event_id: string,
  ticket_type_id: string
) {
  const url = `https://api.tickettailor.com/v1/events/${event_id}`;
  const headers = {
    Authorization: `Basic ${basicCreds}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, { method: "GET", headers: headers });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: any = await response.json();
    const ticketsTypes = data.ticket_types;

    for (const ticketType of ticketsTypes) {
      if (ticketType.id === ticket_type_id) {
        return {
          limit: ticketType.quantity_total,
          total: ticketType.quantity_issued,
        };
      }
    }

    throw new Error(`Ticket type ${ticket_type_id} for event ${event_id} not found`);
  } catch (error) {
    console.error("Failed to fetch ticket limit and total:", error);
    throw error;
  }
}
