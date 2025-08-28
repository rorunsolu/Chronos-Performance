import { getigdbAccessToken } from "../auth/igdbAuth";
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
  const body = `search "${query}"; fields name, cover, rating, url; limit 20; offset 0;`;

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

export async function getHomepageGames() {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
  }

  const url = "https://api.igdb.com/v4/games";
  const body = `fields name, cover, rating, url; limit 30; offset 0;`;

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

    return await response.json();
  } catch (error) {
    console.error("Error (IGDBController) fetching homepage games:", error);
    throw new Error("Error (IGDBController) fetching homepage games");
  }
}
