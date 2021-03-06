var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

 var dolls = [
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
var dolls = [];

var dataPath = 'data.json';

try {
	var stats = fs.statSync(dataPath);
	var dataString = fs.readFileSync(dataPath);
	dolls = JSON.parse(dataString);
} catch (e) {
	console.log('Data File Does Not Exist... Creating Empty File...');
	fs.writeFileSync(dataPath, JSON.stringify([]));
}

function lookupDoll(doll_id) {
  return _.find(dolls, function(c) {
    return c.id == parseInt(doll_id);
  });
}

function findMaxId() {
  return _.max(dolls, function(doll) {
    return doll.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {dolls: dolls});
});


router.get('/api', function(req, res, next) {
  res.json(dolls);
});

router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_doll_id = (findMaxId()).id + 1;
	var new_doll = {
		id: new_doll_id,
		name: req.body.fullname,
		eyes: req.body.eyes,
		hair: req.body.hair,
		clothes: req.body.clothes
	};
	dolls.push(new_doll);
	console.log(dolls);
	fs.writeFileSync(dataPath, JSON.stringify(dolls));
	res.redirect('/dolls/');
});

router.get('/add', function(req, res, next) {
	res.render('add', {doll:{}});
});



router.route('/:doll_id')
	.all(function(req, res, next){
		doll_id = req.params.doll_id;
		doll = lookupDoll(doll_id);
		next();
	})
	.get(function(req,res,next){
		res.render('edit', {doll: doll});
	})
	.post(function(req,res,next){
		res.send('Post for doll ' + doll_id);
	})
	.put(function(req,res,next){
		doll.name = req.body.fullname;
		doll.eyes = req.body.eyes;
		doll.hair = req.body.hair;
		doll.clothes = req.body.clothes;

		fs.writeFileSync(dataPath, JSON.stringify(dolls));
		res.redirect('/dolls/');
	})
	
	
	
	.delete(function(req,res,next){
		for (var i = 0; i < dolls.length; i++) {
			if (dolls[i].id === parseInt(doll_id)) {
				dolls.splice(i, 1);
			}
		}
		
		fs.writeFileSync(dataPath, JSON.stringify(dolls));
		res.send('Delete for doll ' + doll_id);
	});

module.exports = router;
