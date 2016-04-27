var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

 var contacts = [
   {
     id: 1,
     name: 'Joe Smith',
     title: 'Plumber',
     email: 'joe@gmail.com'
   },
   {
            id: 2,
     name: 'Carla Ricci',
     title: 'Principal Division Producer 2',
     email: 'cricci@gmail.com'
   },
   {
     id: 3,
     name: 'Dragan Burns',
     title: 'Senior Factors Producer',
     email: 'itburns@outlook.com'
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

function lookupContact(contact_id) {
  return _.find(contacts, function(c) {
    return c.id == parseInt(contact_id);
  });
}

function findMaxId() {
  return _.max(contacts, function(contact) {
    return contact.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {contacts: contacts});
});

router.get('/api', function(req, res, next) {
  //res.render('list', {contacts: contacts});
  res.json(contacts);
});

router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_contact_id = (findMaxId()).id + 1;
	var new_contact = {
		id: new_contact_id,
		name: req.body.fullname,
		title: req.body.title,
		email: req.body.email
	};
	contacts.push(new_contact);
	console.log(contacts);
	fs.writeFileSync(dataPath, JSON.stringify(contacts));

	//res.send("New contact created with id: " + new_contact.id);
	res.redirect('/contacts/');
});

router.get('/add', function(req, res, next) {
	res.render('add', {contact:{}});
});

router.route('/:contact_id')
	.all(function(req, res, next){
		contact_id = req.params.contact_id;
		contact = lookupContact(contact_id);
		next();
	})
	.get(function(req,res,next){
		res.render('edit', {contact: contact});
	})
	.post(function(req,res,next){
		res.send('Post for contact ' + contact_id);
	})
	.put(function(req,res,next){
		contact.name = req.body.fullname;
		contact.title = req.body.title;
		contact.email = req.body.email;

		fs.writeFileSync(dataPath, JSON.stringify(contacts));

		//res.send('Update succeeded for contact ' + contact_id);
		res.redirect('/contacts/');
	})
	.delete(function(req,res,next){
		for (var i = 0; i < contacts.length; i++) {
			if (contacts[i].id === parseInt(contact_id)) {
				contacts.splice(i, 1);
			}
		}
		//console.log(contacts);
		fs.writeFileSync(dataPath, JSON.stringify(contacts));
		res.send('Delete for contact ' + contact_id);
	});

module.exports = router;
