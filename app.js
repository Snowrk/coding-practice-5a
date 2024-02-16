const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
app.use(express.json())

let db = null
const dbPath = path.join(__dirname, 'moviesData.db')
console.log(dbPath)

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Started')
    })
  } catch (e) {
    console.log(e.message)
  }
}

initilizeDBAndServer()

app.get('/movies/', async (response, request) => {
  try {
    const allMoviesQuerry = `SELECT movie_name as movieName FROM movie`
    const moviesArray = await db.all(allMoviesQuerry)
    console.log(moviesArray)
    request.send(moviesArray)
  } catch (m) {
    console.log(m)
  }
})

app.post('/movies/', async (request, response) => {
  try {
    const movieDetails = request.body
    const {directorId, movieName, leadActor} = movieDetails
    const uploadQuerry = `INSERT INTO movie(director_id, movie_name, lead_actor) VALUES(${directorId}, '${movieName}', '${leadActor}')`
    const newMovie = await db.run(uploadQuerry)
    console.log(newMovie)
    response.send('Movie Successfully Added')
  } catch (e) {
    console.log(e)
  }
})

app.get('/movies/:movieId/', async (request, response) => {
  try {
    const {movieId} = request.params
    const movieQuerry = `SELECT * FROM movie WHERE movie_id = ${movieId}`
    const reqMovie = await db.get(movieQuerry)
    response.send(reqMovie)
  } catch (e) {
    console.log(e)
  }
})

app.put('/movies/:movieId', async (request, response) => {
  try {
    const {movieId} = request.params
    const updateDetails = request.body
    const {directorId, movieName, leadActor} = updateDetails
    const updateQuerry = `UPDATE movie SET director_id = ${directorId}, movie_name = '${movieName}', lead_actor = '${leadActor}'  WHERE movie_id = ${movieId}`
    const updatedMovie = await db.run(updateQuerry)
    console.log(updatedMovie)
    response.send('Movie Details Updated')
  } catch (e) {
    console.log(e)
  }
})

app.delete('/movies/:movieId/', async (requset, response) => {
  try {
    const {movieId} = requset.params
    const deleteQuerry = `DELETE FROM movie WHERE movie_id = ${movieId}`
    const deletedMvie = await db.run(deleteQuerry)
    response.send('Movie Removed')
  } catch (e) {
    console.log(e)
  }
})

app.get('/directors/', async (request, response) => {
  try {
    const directorsQuerry = `SELECT director_id as directorId, director_name as directorName FROM  director`
    const directors = await db.all(directorsQuerry)
    response.send(directors)
  } catch (e) {
    console.log(e)
  }
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  try {
    const {directorId} = request.params
    console.log(directorId)
    const directorMoviesQuerry = `SELECT movie_name as movieName FROM movie WHERE director_id = ${directorId}`
    const directorMovies = await db.all(directorMoviesQuerry)
    response.send(directorMovies)
  } catch (e) {
    console.log(e)
  }
})

module.exports = app
