import dotenv from "dotenv";
// Docs:
// https://api-docs.igdb.com/#account-creation

dotenv.config();

export async function getigdbAccessToken() {
  const clientID = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Error fetching IGDB access token: ${response.status}`);
    }

    const data: { access_token: string } = await response.json();
    console.log(data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching IGDB access token:", error);
    throw new Error("Failed to fetch IGDB access token");
  }
}
