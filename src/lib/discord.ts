import { TicketPurchaseData } from "../types";

export async function notify_discord(data: TicketPurchaseData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is not set");
  }

  const message = {
    content: `🎫  Sold a **${data.name}** ticket! Total: ${data.total}`,
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Failed to send Discord message:", error);
    });
}
