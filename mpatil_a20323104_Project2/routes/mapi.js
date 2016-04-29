var express = require('express');
var router4 = express.Router();
var _ = require('underscore');
var fs = require('fs');

 var movies = [
   {
     id: 1,
     name_doll: 'Elsa',
     name_movie: 'Frozen',
     year_of_release: '2013',
	production_house: 'Walt Disney Animation Studios'
   },
   {
            id: 2,
     name_doll: 'Snow White',
     name_movie: 'Snow White and the Seven Dwarfs',
		 year_of_release: '1937',
		 production_house: 'Walt Disney Productions'
   },
   {
     id: 3,
     name_doll: 'Cindrella',
     name_movie: 'Cindrella',
		 year_of_release: '2015',
		 production_house: 'Allison Sheatmur Productions and Beagle Pug Films'
   },
	 {
     id: 4,
     name_doll: 'Belle',
		 name_movie: 'Beauty and the Beast',
		 year_of_release: '1991',
		 production_house: 'Walt Disney Pictures and Silver Screen Partners'
   }
 ];
var movies = [];

var dataPath = 'mdata.json';

try {
	var stats = fs.statSync(dataPath);
	var dataString = fs.readFileSync(dataPath);
	movies = JSON.parse(dataString);
} catch (e) {
	console.log('Data File Does Not Exist... Creating Empty File...');
	fs.writeFileSync(dataPath, JSON.stringify([]));
}

function lookupMovie(movie_id) {
  return _.find(movies, function(c) {
    return c.id == parseInt(movie_id);
  });
}
/*
function findMaxId() {
  return _.max(movies, function(movie) {
    return movie.id;
  });
}


router3.get('/', function(req, res, next) {
  res.render('listMovie', {movies: movies});
});

*/

router4.get('/movies', function(req, res, next) {
  //res.render('list', {movies: movies});
  res.json(movies);
});

/*
router3.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_movie_id = (findMaxId()).id + 1;
	var new_movie = {
		id: new_movie_id,
		name_doll: req.body.dollName,
		name_movie: req.body.name_movie,
		year_of_release: req.body.year_of_release,
production_house: req.body.production_house
	};
	movies.push(new_movie);
	console.log(movies);
	fs.writeFileSync(dataPath, JSON.stringify(movies));

	//res.send("New movie created with id: " + new_movie.id);
	res.redirect('/movies/');
});

router3.get('/addMovie', function(req, res, next) {
	res.render('addMovie', {movie:{}});
});
*/
router4.route('/movies/:movie_id')
	.all(function(req, res, next){
		movie_id = req.params.movie_id;
		movie = lookupMovie(movie_id);
		next();
	})
	.get(function(req,res,next){
		res.render('editMovie', {movie: movie});
	})
/*	.post(function(req,res,next){
		res.send('Post for movie ' + movie_id);
	})
	.put(function(req,res,next){
		movie.name_doll = req.body.dollname;
		movie.name_movie = req.body.name_movie;
		movie.year_of_release = req.body.year_of_release;
		movie.production_house = req.body.production_house;

		fs.writeFileSync(dataPath, JSON.stringify(movies));

		//res.send('Update succeeded for movie ' + movie_id);
		res.redirect('/movies/');
	})
	
*/
module.exports = router4;
