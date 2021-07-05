const express = require('express');
const bodyParser = require('body-parser');
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
    connectionString: process.env.DATABASE_URL,
    ssl: true
    /*host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'smartbrain'
    //local host connection setting
    */
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// })

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send("it is working!")})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt)} )
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req, res, db)} )
app.put('/image', (req,res) => { image.handleImage(req, res, db)}) 
app.post('/imageUrl', (req,res) => { image.handleApiCall(req, res)} )

app.listen(process.env.PORT || 3000, ()=> { //heroku needs to run on its own port by process.env.PORT
	console.log(`app is running on port ${process.env.PORT}`);
})

/*
/ --> res = this is working
/ signin --> POST  res = success/fail
/ register --> POST  = user
/ profile/:userId --> GET = user
/ image counter --> PUT --> user

*/