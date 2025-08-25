import dotenv from "dotenv";
// Referenced docs
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// https://gamebrain.co/api/docs/game-detail
// https://gamebrain.co/api/docs/search-games

dotenv.config();

const apiKey = process.env.GAMEBRAIN_API_KEY;

export async function getGameDetailsById(gameId: string) {
  const apiUrl = `https://api.gamebrain.co/v1/games/${gameId}`;

  if (!apiKey) {
    throw new Error("API key is missing");
  }

  try {
    // retrieve the data from the API using the GET method
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        // refer to game brain documentation for the above
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching game details: ${response.status}`);
    }

    // change the format of the data to json
    const gameDetails = await response.json();
    return gameDetails;
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw new Error("Failed to fetch game details");
  }
}

export async function searchGamesByQuery(query: string) {
  const apiUrl = `https://api.gamebrain.co/v1/games?query=${query}`;

  if (!apiKey) {
    throw new Error("API key is missing");
  }

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error searching games: ${response.status}`);
    }

    const searchResults = await response.json();
    return searchResults;
  } catch (error) {
    console.error("Error searching games:", error);
    throw new Error("Failed to search games");
  }
}
