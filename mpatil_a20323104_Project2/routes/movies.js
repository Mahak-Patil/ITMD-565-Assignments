var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

 var movies = [
   {
     id: 1,
     name: 'Elsa',
     eyes: 'Sparkling blue',
     hair: 'Platinum white',
		 clothes: 'Long, flowy dress'
   },
   {
            id: 2,
     name: 'Snow White',
     hair: 'Jet black',
     eyes: 'Soft brown',
     clothes: 'Yellow skirt and blue top'
   },
   {
     id: 3,
     name: 'Cindrella',
     hair: 'Blonde',
     eyes: 'Blue',
     clothes: 'White ball gown'
   },
	 {
     id: 4,
     name: 'Belle',
     hair: 'Brown',
     eyes: 'Brown',
     clothes: 'Blue dress with a white apron'  
   }
 ];
var movies = [];

var dataPath = 'data.json';

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

function findMaxId() {
  return _.max(movies, function(movie) {
    return movie.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {movies: movies});
});

router.get('/api', function(req, res, next) {
  //res.render('list', {movies: movies});
  res.json(movies);
});

router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_movie_id = (findMaxId()).id + 1;
	var new_movie = {
		id: new_movie_id,
		name: req.body.fullname,
		eyes: req.body.eyes,
		hair: req.body.hair,
		clothes: req.body.clothes
	};
	movies.push(new_movie);
	console.log(movies);
	fs.writeFileSync(dataPath, JSON.stringify(movies));

	//res.send("New movie created with id: " + new_movie.id);
	res.redirect('/movies/');
});

router.get('/add', function(req, res, next) {
	res.render('add', {movie:{}});
});

router.route('/:movie_id')
	.all(function(req, res, next){
		movie_id = req.params.movie_id;
		movie = lookupMovie(movie_id);
		next();
	})
	.get(function(req,res,next){
		res.render('edit', {movie: movie});
	})
	.post(function(req,res,next){
		res.send('Post for movie ' + movie_id);
	})
	.put(function(req,res,next){
		movie.name = req.body.fullname;
		movie.eyes = req.body.eyes;
		movie.hair = req.body.hair;
		movie.clothes = req.body.clothes;

		fs.writeFileSync(dataPath, JSON.stringify(movies));

		//res.send('Update succeeded for movie ' + movie_id);
		res.redirect('/movies/');
	})
	.delete(function(req,res,next){
		for (var i = 0; i < movies.length; i++) {
			if (movies[i].id === parseInt(movie_id)) {
				movies.splice(i, 1);
			}
		}
		//console.log(movies);
		fs.writeFileSync(dataPath, JSON.stringify(movies));
		res.send('Delete for movie ' + movie_id);
	});

module.exports = router;
