const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send('success');
})

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

//sign in
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

//register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) //calling dependencies for register.js


//find a user
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

//update entries of user based on id
app.put('/image', (req, res) => { image.handleImage(req, res, db)})

//Run the API call on the backend so key information isn't available to users
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


/*
/ --> res = this is working
/signin --> 'POST' request, respond with success or fail
/register --> 'POST' request, respond with new user
/profle/:userId --> 'GET' request, respond with the user
/image --> 'PUT' request (update user profile), respond with updated user entries

anytime sending a password, you want to use 'POST'

*/ 


bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });