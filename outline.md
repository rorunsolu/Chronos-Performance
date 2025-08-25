## Components

- Game Card (image of game, title, rating)
- Navbar (links to home, about, contact + searchbar)
- Footer (copyright info)

## Pages

- Home (list of games, search functionality)
- Game Details (detailed view of a game, including metrics starting from most recent submissions, add metrics button)
- User Profile (user's submitted metrics, account settings)
- Metric Submission for a specific game (GPU, FPS, RAM usage, some optional)
- Login/Register

## General

- Need to retrieve game data (actualy existing data like genre, rating, etc.)
- Seperate accounts for users
- Users can submit metrics for games (FPS, GPU, RAM usage, etc.)
- Metrics can be submitted for a specific game and will be stored in the firebase database
- Games fetched from an gamebrain API are tied to the metrics submitted by users
- Searching for a game and clicking on it will display the games details (from the gamebrain API) and the metrics submitted by users for the specific game
- Store sumbitted metrics in firebase but retrieve using a REST API
- Request via URL -> Request directed to route -> Route calls the specific controller function needed -> Controller function interacts (if data is needed) with the model -> Model gets data from database -> Data is sent back MVC -> Controller fiddles with the data -> Passses processesd data to the view -> View renders stuff based on the data -> Everything sent and displayed to the user (this is known as the response)

## MVC

- Model: Game, User, Metric (Database schemas for each entity)
- View: React components for each page and component
- Controller: Functions to handle API requests, user authentication, and data retrieval

## Retrieving Game Data

- Using gamebrain.co API

<!-- - Use IGDB (https://api-docs.igdb.com/#wrappers)
- Use Apicalypse Node JS wrapper (https://github.com/igdb/node-apicalypse)
- Check the Postman collection to see how to use the API and what data is available (https://www.postman.com/aceprosports/workspace/public/collection/18853756-4367eb1d-3f6b-41ee-96cb-3ccb3d094a5c) -->
