import gamepageApi from "../routes/gamepageApi";
import homepageApi from "../routes/homepageApi";
import popularPageApi from "../routes/popularPageApi";
import resultsApi from "../routes/resultsApi";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PROD_BACKEND_URL || 3000;
const host = process.env.PROD_FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: host,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-access-token",
      "Accept",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
      "Origin",
      "X-Requested-With",
      "Accept-Encoding",
    ],
    credentials: true,
  })
);

app.use("/api/IGDBapi/results", resultsApi);
app.use("/api/IGDBapi/homepage", homepageApi);
app.use("/api/IGDBapi/gamepage", gamepageApi);
app.use("/api/IGDBapi/popular", popularPageApi);

app.get("/", (request, response) => {
  response.send("Backend is running on port " + port + " Host: " + host);
  // When a GET request is made to this URL, it responds with a message which gets sent back to the client (frontend)
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

export default app;

// https://api-docs.igdb.com/#expander "Some fields are actually ids pointing to another endpoint. The expander feature is a convenient way to go into these other endpoints and access more information from them in the same query, instead of having to do multiple queries."
// Postman testing https://ramsthemes.com/news/how-to-obtain-an-auth-key-from-the-igdb-api-using-postman/
