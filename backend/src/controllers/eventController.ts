import { getigdbAccessToken } from "../auth/igdbAuth";
import { Request, Response } from "express";

export async function getIgdbEvents(req: Request, res: Response) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
  }

  const url = "https://api.igdb.com/v4/events";
  const limit = 10;

  const body = `
    fields name, description, start_time, end_time, event_logo, event_logo.image_id, live_stream_url, event_networks.url;
    sort start_time desc;
    limit ${limit};
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Client-ID": clientID,
      },
      body,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch events from IGDB");
    }
    const events = await response.json();
    res.json(events);
  } catch (error) {
    console.error("Error fetching IGDB events:", error);

    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
  }
}
