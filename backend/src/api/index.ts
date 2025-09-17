import gamepageApi from "../routes/gamepageApi";
import homepageApi from "../routes/homepageApi";
import resultsApi from "../routes/resultsApi";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chronos-performance-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// Sets the route for the root URL ("/") of the application
app.get("/", (request, response) => {
  response.send("Backend is running");
  // When a GET request is made to this URL, it responds with a message which gets sent back to the client (frontend)
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/IGDBapi/results", resultsApi);
app.use("/api/IGDBapi/homepage", homepageApi);
app.use("/api/IGDBapi/gamepage", gamepageApi);

export default app;

// https://api-docs.igdb.com/#expander "Some fields are actually ids pointing to another endpoint. The expander feature is a convenient way to go into these other endpoints and access more information from them in the same query, instead of having to do multiple queries."

// Postman testing https://ramsthemes.com/news/how-to-obtain-an-auth-key-from-the-igdb-api-using-postman/
