const express = require('express') 
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }) )

app.use( session({
  name: 'session',
  secret: 'poopedmypants',
  keys: ['id'],
  maxAge: 24 * 60 * 60 * 1000
}) )

const {queries} = require('./database/queries.js')

app.get('/', (request, response) => {
  response.render('./home.ejs')
})

app.get('/login', (request, response) => {
  response.render('./login.ejs', {username: ''})
})

app.get('/logout', (request, response) => {
  request.session.destroy()
  response.redirect('/')
})

app.get('/signup', (request, response) => {
  response.render('./signup.ejs')
})

app.get('/landing', (request, response) => {
  console.log( '---===request.session===---', request.session );
  if (request.session.userId) {
    queries.findById(request.session.userId)
    .then( user => {
      response.render('./landing.ejs', { user })
    }) 
  } else {
    response.redirect('/')
  }
})

app.post('/login', (request, response) => {
  const { username, password } = request.body
  queries.find( username )
   .then( user => {
     console.log( '---===user===---', user );
     console.log( '---===request.session===---', request.session ); 
     console.log( '---===data.password === user.password===---', user.password === user.password ); 
     console.log( '---===user.password===---', user.password ); 
     if ( user && user.password === password ) {
       request.session.userId = user.id
       console.log( '---===request.session===---', request.session ); 
       response.redirect('/landing')
     } else {
       response.render('./login.ejs', { username })
     }
   })
   .catch( error => { 
     response.status(500).send(error.message)
   })
})

app.post('/newUser', (request, response) => {
  const user = request.body
  // console.log( '---===request.body===---', request.body )
  // console.log( '---===user===---', user )

  if (user.signUpPassword === user.signUpPasswordConfirm) {
    queries.create(user.signUpEmail, user.signUpPassword)
    
    // console.log( '---===request.session===---', request.session ); 
    // queries.find(user.signUpEmail)
    .then( user => {  
      request.session.userId = user.id
      response.redirect('./landing') 
      console.log( '---===request.session===---', request.session ); 
    })
    .catch( error => { 
      response.status(500).send(error.message)
    })
  }
})

app.listen(3000, function () {
  console.log( '<3333333 listening on 3000 <3333333' )
})