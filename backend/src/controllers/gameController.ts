import { getigdbAccessToken } from "../auth/igdbAuth";

export async function searchGamesByQuery(query: string) {
  const accessToken = await getigdbAccessToken();
  const clientID = process.env.IGDB_CLIENT_ID;

  if (!accessToken || !clientID) {
    throw new Error("IGDB access token or client ID not found");
    // prevents the overload nonsense with the headers
  }

  const url = "https://api.igdb.com/v4/games";
  const body = `search "${query}"; fields name, cover, genres, rating, checksum, url;`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Client-ID": clientID,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(
        `Error (gameController) searching games: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error (gameController) searching games:", error);
    throw new Error("Error (gameController) searching games");
  }
}
