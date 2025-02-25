require("dotenv").config();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Import the framework and instantiate it
import Fastify from "fastify";
import { get_ticket_total } from "./lib/ticket-tailor";
import { notify_discord } from "./lib/discord";
const fastify = Fastify({
  logger: true,
  trustProxy: true,
});

fastify.get("/", async function handler(request, reply) {
  return {};
});

fastify.post("/webhook/ticket-tailor", async function handler(request, reply) {
  const body = request.body as any;
  process_event(body);
  return {};
});

async function process_event(event: any) {
  if (event.event.toLowerCase() !== "order.created") {
    return;
  }

  const ticketsData = event.payload.issued_tickets;

  const event_id = event.payload.event_summary.event_id;

  for (const ticket of ticketsData) {
    await process_ticket(event_id, ticket);
  }
}

async function process_ticket(event_id: string, ticket: any) {
  const { total } = await get_ticket_total(event_id);

  const name = ticket.description;

  console.log(`Ticket purchase data:\nName: ${name}\nTotal: ${total}`);
  await notify_discord({ name, total });
}

async function main() {
  try {
    await fastify.listen({ port, host: process.env.HOST ?? "localhost" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
