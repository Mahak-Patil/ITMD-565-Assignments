var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

var doll = [
    
  {
     id: 1,
     name: 'Elsa',
     hair: 'Platinum white',
     eyes: 'Sparkling blue',
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

function lookupDoll(dolls_id) {
  return _.find(doll, function(c) {
    return c.id == parseInt(dolls_id);
  });
}

/*
function findMaxId() {
  return _.max(dolls, function(dolls) {
    return dolls.id;
  });
}
*/
router.get('/', function(req, res, next) {
  res.render('list', {dolls: doll});
});

router.get('/dolls', function(req, res, next) {
  res.render('list', {dolls: doll});
});



router.route('/:dolls_id')
	.all(function(req, res, next){
		dolls_id = req.params.dolls_id;
		dolls = lookupDoll(dolls_id);
		next();
	})
	.get(function(req,res,next){
		res.render('display', {dolls: dolls});
	})

    module.exports = router;