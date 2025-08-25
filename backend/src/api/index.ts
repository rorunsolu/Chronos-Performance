import cors from "cors";
import express from "express";

const app = express(); // Creates an instance of an Express application
const port = 4000; // Sets the port number for the server to listen on

// Both lines below Adds middleware (functions that do stuff with the code, requests and responses)
app.use(cors());
app.use(express.json());

// Sets the route for the root URL ("/") of the application
app.get("/", (request, response) => {
  response.send("Backend is running");
  // When a GET request is made to this URL, it responds with a message which gets sent back to the client (frontend)
});

// Starts the server and listens on the specified port
app.listen(port, () => {
  console.log("Server running on http://localhost:${port}");
});
