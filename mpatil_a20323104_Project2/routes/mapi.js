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

router4.get('/movies', function(req, res, next) {
 res.json(movies);
});


router4.route('/movies/:movie_id')
	.all(function(req, res, next){
		movie_id = req.params.movie_id;
		movie = lookupMovie(movie_id);
		next();
	})
	.get(function(req,res,next){
		res.render('editMovie', {movie: movie});
	})

module.exports = router4;
