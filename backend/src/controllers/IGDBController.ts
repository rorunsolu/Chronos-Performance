import { getigdbAccessToken } from "../auth/igdbAuth";
import { Request, Response } from "express";
//! Always add offset 0 to each body otherwise the results will start at position 22 and give 33 results if the limit is set to 33 for example.
// The default limit is 10 results per request and the max is 500
// Source: https://api-docs.igdb.com/#pagination

export async function searchGamesByQuery(query: string) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
    // prevents the overload nonsense with the headers
  }

  const url = "https://api.igdb.com/v4/games";
  const body = `
  search "${query}"; 
  fields name, cover.image_id, rating, genres.name, url, websites.url, websites.category;
  where cover != null & cover.image_id != null & websites.category = (13,16,17,18);
  limit 20; 
  offset 0;
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Client-ID": clientID,
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(
        `Error (IGDBController) searching games: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error (IGDBController) searching games:", error);
    throw new Error("Error (IGDBController) searching games");
  }
}

const fetchLimit = 20;

export async function getHomepageGames(req: Request, res: Response) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
  }

  const offset = Number(req.query.offset) || 0; // get the offset from the url (query string parameters) used in the frontend and convert the offset string to a number get the offset from the url (query string parameters) used in the frontend and convert the offset string to a number

  const url = "https://api.igdb.com/v4/games";

  const body = `
  fields name, cover.image_id, rating, genres.name, url, websites.url, websites.category;
  where cover != null & cover.image_id != null & websites.category = (13,16,17,18);
  limit ${fetchLimit};
  offset ${offset};
`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": clientID,
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(
        `Error (IGDBController) fetching homepage games: ${response.status}`
      );
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error (IGDBController) fetching homepage games" });
  }
}
