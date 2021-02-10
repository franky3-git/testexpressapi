const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const cors = require('cors');
const Joi = require('joi');
const log = console.log;


router.use(cors());
router.use(express.json());

router
	.route('/')
	.get((req, res) => {
		fs.readFile(path.resolve(__dirname, 'database.txt'), 'utf8', (err, content) => {
			if(err) {
				log('Some errors happend when fetching different users');
				return;
			}
			content = JSON.parse(content);
			res.json(content)
		})
	})
	.post((req, res) => {
		
		fs.readFile(path.resolve(__dirname, 'database.txt'), 'utf8', (err, content) => {
			let users = JSON.parse(content);
			
			result = validate(req.body);
			
			if(result.error) {
				res.status(400).send(result.error.message);
				return;
			}
			const newId = users.length === 0? 1 : users[users.length - 1].id + 1;
			const newUser = {id: newId, ...req.body};
			users.push(newUser);
			fs.writeFile(path.resolve(__dirname, 'database.txt'), JSON.stringify(users), (err) => {
				if(err) {
					log('Something bad happend when creating an user');
				}
			})
			res.json({message: 'User created'});
		})
		
	});

router
	.route('/:id')
	.get((req, res) => {
		fs.readFile(path.resolve(__dirname, 'database.txt'), 'utf8', (err, content) => {
			if(err) {
				log('cannot access database');
				return;
			}
			const selectedUser = JSON.parse(content).find(user => user.id == req.params.id);
			if(!selectedUser) {
				res.status(404).send('The user with the given ID was not found');
				return;
			} 
			res.json(selectedUser);
		})
		
	})
	.put((req, res) => {
		fs.readFile(path.resolve(__dirname, 'database.txt'), 'utf8', (err, content) => {
			if(err) {
				log('cannot access database to update the user');
				return;
			}
			let updateUserInfo = req.body;
			content = JSON.parse(content);
			let selectedUser = content.find(user => user.id == req.params.id);
			let indexUser = content.findIndex(user => user.id == req.params.id);
			
			if(!selectedUser) {
				res.status(404).send('This user does not exist');
				return;
			} 
			
			const result = validate(updateUserInfo);
			
			if(result.error) {
				res.status(400).send(result.error.message);
				return;
			}
			
			selectedUser.name = updateUserInfo.name || selectedUser.name;
			selectedUser.password = updateUserInfo.password || selectedUser.password;
			selectedUser.email = updateUserInfo.email || selectedUser.email;

			content.splice(indexUser, 1, selectedUser);

			fs.writeFile(path.resolve(__dirname, 'database.txt'), JSON.stringify(content), (err) => {
				if(err) {
					log('udpdating data failed');
					return;
				}
				res.json('user update');
			})
		})
	})
	.delete((req, res) => {
		fs.readFile(path.resolve(__dirname, 'database.txt'), 'utf8', (err, content) => {
			if(err) {
				log('cannot access database to delete user');
				return;
			}
			let selectedUser = JSON.parse(content).find(user => user.id == req.params.id);
		
			if(!selectedUser) {
				res.status(404).send('This user does not exist')
				return;
			} 
			
			let newContent = JSON.parse(content);
			newContent = newContent.filter(user => user.id != req.params.id);

			fs.writeFile(path.resolve(__dirname, 'database.txt'), JSON.stringify(newContent), (err) => {
				if(err) {
					log('deleting data failed');
					return;
				}
				res.json('user deleted');
			})
		})
})

function validate(user) {
	const schema = Joi.object({
		name: Joi.string().required(),
		password: Joi.number().required(),
		email: Joi.string().required()
	})

	return schema.validate(user);
}


module.exports = router;