const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();
module.exports = app;
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("Server running at http://localhost:3003 successfully");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message()}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
        *
    FROM  
        movie ;
    `;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//API 2
app.post("/movies/", async (request, response) => {
  const requestDetails = request.body;
  const { director_id, movie_name, lead_actor } = requestDetails;

  const postMovieQuery = `
    INSERT INTO 
    movie (director_id, movie_name, lead_actor) 
    VALUES
    (
        '${director_id}',
        '${movie_name}',
        '${lead_actor}'
    )
    `;

  const dbResponse = await db.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT 
        * 
    FROM movie
    WHERE movie_id = '${movieId}'
    `;

  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const updateDetails = request.body;
  const { director_id, movie_name, lead_actor } = updateDetails;

  const updateQuery = `
    UPDATE movie 
    SET 
       director_id = '${director_id}',
       movie_name = '${movie_name}',
       lead_actor= '${lead_actor}'
    `;

  await db.run(updateQuery);
  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;

  const deleteQuery = `
    DELETE FROM 
    movie
    WHERE movie_id = '${movieId}'
    `;

  await db.run(deleteQuery);
  response.send("Movie Removed");
});

//API 6
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT
        *
    FROM  
        director ;
    `;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(directorsArray);
});

//API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;

  const getMovieNameQuery = `
    SELECT 
    movie_name 
    FROM movie 
    WHERE director_id = '${directorId}';
    `;

  const movieNames = await db.all(getMovieNameQuery);
  response.send(movieNames);
});
