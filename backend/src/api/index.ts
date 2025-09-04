import gamepageApi from "../routes/gamepageApi";
import homepageApi from "../routes/homepageApi";
import resultsApi from "../routes/resultsApi";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express(); // Creates an instance of an Express application
// const port = process.env.PORT || 3000; // Sets the port number for the server to listen on

// Both lines below Adds middleware (functions that do stuff with the code, requests and responses)
app.use(cors());
app.use(express.json());

// Sets the route for the root URL ("/") of the application
app.get("/", (request, response) => {
  response.send("Backend is running");
  // When a GET request is made to this URL, it responds with a message which gets sent back to the client (frontend)
});

// Starts the server and listens on the specified port
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.use("/api/IGDBapi/results", resultsApi);
app.use("/api/IGDBapi/homepage", homepageApi);
app.use("/api/IGDBapi/gamepage", gamepageApi);

// Docs
// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Displaying_data
// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes
// https://api-docs.igdb.com/#expander "Some fields are actually ids pointing to another endpoint. The expander feature is a convenient way to go into these other endpoints and access more information from them in the same query, instead of having to do multiple queries."

//!Note: You can only send data to an api if it is in JSON. So if needed, comvert the data to json (data.json() this converts it to json) then use POST to send it.

// Postman testing https://ramsthemes.com/news/how-to-obtain-an-auth-key-from-the-igdb-api-using-postman/
// Pagnation & result limits: https://api-docs.igdb.com/#pagination
// The default limit is 10 results per request and the max is 500
