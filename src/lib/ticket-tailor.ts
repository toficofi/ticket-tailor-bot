const basicCreds = btoa(`${process.env.TICKET_TAILOR_API_KEY}:`);

export async function get_ticket_total(
  event_id: string,
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

    return {
      total: data.total_issued_tickets,
    }
  } catch (error) {
    console.error("Failed to fetch ticket total:", error);
    throw error;
  }
}
