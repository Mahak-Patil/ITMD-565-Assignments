var express = require('express');
var router2 = express.Router();
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

router2.get('/dolls', function(req, res, next) {
  res.json(doll);

});

router2.route('/dolls/:doll_id')
	.all(function(req, res, next){
		doll_id = req.params.doll_id;
		doll = lookupDoll(doll_id);
		next();
	})
	.get(function(req,res,next){
		res.render('display', {doll: doll});
	})


module.exports = router2;
