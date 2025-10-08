import { getigdbAccessToken } from "../auth/igdbAuth";
import { Request, Response } from "express";
//! Always add offset 0 to each body otherwise the results will start at position 22 and give 33 results if the limit is set to 33 for example.
// The default limit is 10 results per request and the max is 500
// Source: https://api-docs.igdb.com/#pagination

export async function searchGamesByQuery(query: string, res: Response) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
    // prevents the overload nonsense with the headers
  }

  const url = "https://api.igdb.com/v4/games";
  const body = `
  search "${query}"; 
  fields name, cover.image_id, rating, genres.name, url, websites.url, websites.type;
  where cover != null & cover.image_id != null & websites.type = (13,16,17,18);
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

    const data = await response.json();
    res.json(data);
  } catch {
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
  fields name, cover.image_id, rating, genres.name, url, websites.url, websites.type;
  where cover != null & cover.image_id != null & websites.type = (13,16,17,18);
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
    res.json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error (IGDBController) fetching homepage games" });
  }
}

export async function getGamePageInfo(req: Request, res: Response) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
  }

  const { id } = req.params;

  const url = "https://api.igdb.com/v4/games";

  const body = `
  fields name, cover.image_id, summary, rating, genres.name, game_engines.name, websites.url, websites.type, release_dates.y;
  where id = ${id} & cover != null & cover.image_id != null & websites.type = (13,16,17,18);
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
        `Error (IGDBController) fetching game page info: ${response.status}`
      );
    }
    const data = await response.json();
    res.json(data);
  } catch {
    throw new Error("Error (IGDBController) fetching game page info");
  }
}

export async function getGamesByPopularity(req: Request, res: Response) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
  }

  const url = "https://api.igdb.com/v4/popularity_primitives";

  const popularityType = Number(req.query.popularity_type) || 5; // defaults to peak 24hr player count

  const body = `
    fields id, external_popularity_source, external_popularity_source.name, game_id, value, popularity_type, popularity_type.name;
    where popularity_type = ${popularityType};
    sort value desc;
    limit 20;
    offset 0;
  `;

  try {
    const responseData = await fetch(url, {
      method: "POST",
      headers: {
        "Client-ID": clientID,
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!responseData.ok) {
      throw new Error(
        `Error (IGDBController) fetching games by popularity: ${responseData.status}`
      );
    }

    const data = await responseData.json();
    const gameIdFromResponse = data.map((item: any) => item.game_id);

    if (gameIdFromResponse.length === 0) {
      return res.status(404).json({ error: "No popular games found" });
    }

    const gamesUrl = "https://api.igdb.com/v4/games";
    const gameBody = `
    fields name, cover.image_id;
    where id = (${gameIdFromResponse.join(
      ","
    )}) & cover != null & cover.image_id != null;
    limit 20;
    offset 0;
    `;

    const reponseDataPart2 = await fetch(gamesUrl, {
      method: "POST",
      headers: {
        "Client-ID": clientID,
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: gameBody,
    });
    if (!reponseDataPart2.ok) {
      throw new Error(
        `Error (IGDBController) fetching games by popularity part 2: ${reponseDataPart2.status}`
      );
    }

    const dataPart2 = await reponseDataPart2.json();

    const mergedData = data.map((item: any) => {
      const gameDetails = dataPart2.find(
        (gameFound: any) => gameFound.id === item.game_id
      );
      return {
        ...item,
        name: gameDetails.name,
        cover: gameDetails.cover,
      };
    });
    res.json(mergedData);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error (IGDBController) fetching games by popularity" });
  }
}
