const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const PORT = process.env.port || 3000;
let db;

( async () => {
    db = await open({
        filename : "movies_database.sqlite",
        driver : sqlite3.Database,
    })
})();

/* Exercise 1: Filter Movies by Year and Actor
http://localhost:3000/movies/year-actor?releaseYear=2019&actor=Hrithik%20Roshan */

 async function filterByYearAndActor(releaseYear , actor){
    let query = "SELECT * from movies WHERE release_year = ? AND actor = ?";
    let response = await db.all(query , [releaseYear, actor]);
    return {movies : response};
 }

app.get("/movies/year-actor", async (req ,res) => {

          let releaseYear = req.query.releaseYear;
          let actor = req.query.actor;
          try{
          let results = await filterByYearAndActor(releaseYear , actor);
        if(results.movies.length === 0){
            return res.status(404).json({message : "No movies found for the " + releaseYear + " by " + actor});
        }
        res.status(200).json(results);
       }
       catch(error){
        return res.status(500).json({error : error.message});
       }
})

/* Exercise 2: Fetch Award Winning Movies
http://localhost:3000/movies/award-winning */

async function filterAwardWinningMovies(){
    let query = "SELECT * from movies WHERE rating >= 4.5 ORDER By rating";
    let response = await db.all(query , []);
    return {movies : response};
 }

app.get("/movies/award-winning", async (req ,res) => {

          try{
          let results = await filterAwardWinningMovies();
        if(results.movies.length === 0){
            return res.status(404).json({message : "No award winning movies found"});
        }
        res.status(200).json(results);
       }
       catch(error){
        return res.status(500).json({error : error.message});
       }
})

/* Exercise 3: Fetch Blockbuster Movies
http://localhost:3000/movies/blockbuster */

async function fetchBlockBusterMovies(){
    let query = "SELECT * FROM movies WHERE box_office_collection >= 100 ORDER BY box_office_collection DESC";
    let response = await db.all(query , []);
    return {movies : response};
}

app.get("/movies/blockbuster", async (req ,res) => {
     try {
        let results = await fetchBlockBusterMovies();
        if(results.movies.length === 0){
             return res.status(404).json({message : "No blockbuster movies"});
        }
        res.status(200).json(results);
     }catch (error){
        res.status(500).json({error : error.message});
     }

})

app.listen(PORT , () => {
    console.log(`Server is running on http://localhost : ${PORT}`);
})