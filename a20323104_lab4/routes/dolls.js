var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

var dolls = [
    
  {
     id: 1,
     name: 'Anna',
     hair: 'brown',
     eyes: 'green',
     clothes: 'dress'     
   },
   {
            id: 2,
     name: 'Elsa',
     hair: 'white',
     eyes: 'green',
     clothes: 'dress'  
   },
    {
     id: 3,
     name: 'Kevin',
     hair: 'black',
     eyes: 'brown',
     clothes: 'blue jumpers'  
   },
   {
     id: 4,
     name: 'Gru',
     hair: 'black',
     eyes: 'black',
     clothes: 'suit'  
   }
 ];
var contacts = [];
var dataPath = 'data.json';

try {
	var stats = fs.statSync(dataPath);
	var dataString = fs.readFileSync(dataPath);
	contacts = JSON.parse(dataString);
} catch (e) {
	console.log('Data File Does Not Exist... Creating Empty File...');
	fs.writeFileSync(dataPath, JSON.stringify([]));
}

function lookupDoll(dolls_id) {
  return _.find(dolls, function(c) {
    return c.id == parseInt(dolls_id);
  });
}

function findMaxId() {
  return _.max(dolls, function(dolls) {
    return dolls.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {dolls: dolls});
});

router.get('/dolls', function(req, res, next) {
  //res.render('list', {contacts: contacts});
  res.json(dolls);
});

/** 
router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_dolls_id = (findMaxId()).id + 1;
	var new_dolls = {
		id: new_dolls_id,
		name: req.body.fullname,
		hair: req.body.hair,
		eyes: req.body.eyes,
        clothes: req.body.clothes
	};
	dolls.push(new_dolls);
	console.log(dolls);
	fs.writeFileSync(dataPath, JSON.stringify(dolls));

	//res.send("New contact created with id: " + new_contact.id);
	res.redirect('/dolls/');
});


router.get('/add', function(req, res, next) {
	res.render('add', {dolls:{}});
});
*/

router.route('/:dolls_id')
	.all(function(req, res, next){
		dolls_id = req.params.dolls_id;
		dolls = lookupDoll(dolls_id);
		next();
	})
	.get(function(req,res,next){
		res.render('display', {dolls: dolls});
	})
/** 	.post(function(req,res,next){
		res.send('Post for doll ' + dolls_id);
	})
	.put(function(req,res,next){
		dolls.name = req.body.fullname;
		dolls.hair = req.body.hair;
		dolls.eyes = req.body.eyes;
        dolls.clothes = req.body.clothes;

		fs.writeFileSync(dataPath, JSON.stringify(dolls));
        res.send('Delete for contact ' + contact_id);
	});
    */
    module.exports = router;