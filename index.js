//Express routing here to the three pages
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const axios = require("axios").default;
const parser = require('body-parser');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const http = require('http');


//Starting database portion here 
require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://orind:database21!@cluster0.mc5cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
  useUnifiedTopology: true, 
  useNewUrlParser: true,
});

//require("./test/sample")
//require("./test/users")

//const users = require('./test/users')
//const sample = require('/test/sample');
//const  { connect } = require('http2')

mongoose.connection.on("error", (err) => {
  console.log("Error: " + err.message)
})

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully")
})

//const sample = mongoose.model("sample")
//const user = mongoose.model("users")

///Database portion above 

//Password authencation 
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());
// app.use(passport.initialize()); 
// app.use(passport.session()); 
// app.use(session({
//   secret: "Welcome", 
//   resave: false, 
//   saveUninitialized: false, 
// }))

// passport.use(new LocalStrategy(user.authenticate()))


//Passoword authentications 

app.use(
  parser.urlencoded({
    extended: false,
    limit: 1024,
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


  app.get('/', (req, res) => {
    res.render('home', {});
  });

  //Registration for user
  app.post('/register', (req, res) => {
    console.log("username:" + req.body.username)
    console.log("Password:" + req.body.password)
    user.register(new user({username: req.body.username, }), req.body.password, (err, user) => {
      if(err){
        console.log(err)
        res.sendFile(__dirname + '/login.html') //maybe pug??
      }
      passport.authenticate("local")(req, res, () => {
        res.sendFile(__dirname, '/index.html')
      })
    })
  })
  //Registration for user 
  
  
  app.get('/About', (req, res) => {
    res.render('about', {})
  });

  app.get('/search', (req, res) => {
    res.render('search', {recipe:[]});
    //res.sendFile(path.join(__dirname + '/public/search.html'));

  });
  app.post('/search', (req, res) => {
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    var lookup = req.body.search;
    var searchurl = {
    method: 'GET',
    url: 'https://edamam-recipe-search.p.rapidapi.com/search',
    params: {q: lookup},
    headers: {
      'x-rapidapi-key': 'f1ca9f8871msh23516a13e3aa006p1daa57jsn9836fc2f2102',
      'x-rapidapi-host': 'edamam-recipe-search.p.rapidapi.com'
      }
    };

    axios.request(searchurl).then(function (response) {
	  console.log(response.data);
    console.log(response.data.hits[0]);
    console.log(response.data.hits[0].recipe.label)
    //res.write(`<h1>${response.data.hits[0].recipe.label.toString()}</h1>`);
    //res.render('search', {results=recipelist});
    //res.write(`<img src=${response.data.hits[0].recipe.image}>` );
    let recipelist = [];
    //so here create object to put stuff into
    //forEach
    //res.end();
    response.data.hits.forEach(element =>{
      //so here create object to put stuff into build object and push into list
      recipelist.push(element.recipe.label)
    })
    res.render('search', {recipe: recipelist,});
    }).catch(function (error) {
	      console.error(error);
        res.render('search', {recipe:[]});
        //res.end();
      });
    //res.end();
  });
  
  // app.use('/AddNew', express.static(path.join(__dirname, '/react/build')));
  // app.get('/AddNew/*', (req, res) => {
  //   res.sendFile(path.join(__dirname + '/react/build/index.html'));
  // });

  app.get('/AddNew', (req, res) => {
    res.render('add', {});
  });
  
  app.get('/Browse', (req, res) => {
    res.render('browse', {});
    //res.sendFile(path.join(__dirname + '/public/browse.html'));
  });
  app.post('/Browse', (req, res)=> {
    const url = "mycookbook-io1.p.rapidapi.com"
    const apiKey = "d2b5a72c7amshb4dcaa17f424b8fp18e512jsn75615a6fc853"
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    var recipe = req.body.Url;
    var browseReq = {
        method: 'POST',
        url: 'https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi',
        headers: {
            'content-type': 'text/plain',
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': url
        },
        data: recipe
    };

    axios.request(browseReq).then(function (response) {
	    // console.log(response.data[0]);
      // res.write("<h1>Good Request</h1>");
      // res.write(`<h1>${response.data[0].name.toString()}</h1>`);
      // res.write(`<h2>Yields: ${response.data[0].yield.toString()}</h2>`);
      // res.write(`<p>${response.data[0].description.toString()}</p>`);
      // res.write("<h3>Ingredients</h3>");
      // res.write("<ul>");
      // response.data[0].ingredients.forEach(element => {
      //   res.write(`<li>${element.toString()}</li>`);
      // });
      // res.write("</ul>");
      // res.write("<h3>Instructions</h3>");
      // res.write("<ul>");
      // response.data[0].instructions[0].steps.forEach(element => {
      //   res.write(`<li>${element.toString()}</li>`);
      // });
      // res.write("</ul>");

      // console.log(response.data[0].instructions)

      // res.end();
      let im = "/public/images/default-image.jpg";
      if (response.data[0].images.length >= 1){
        im = response.data[0].images[0];
      }
      // console.log(im)
      // let instructions = []
      // response.data[0].instructions[0].steps.forEach(element => {
      //   console.log(element)
      //   console.log(element.toString())
      //   instructions.push(element.toString())
      // });
      res.render('recipe', {
        recipe: response.data[0].name,
        description: response.data[0].description,
        url: recipe,
        yields: response.data[0].yield,
        image: im,
        ingredients: response.data[0].ingredients,
        //instructions: instructions,
        instructions: response.data[0].instructions[0].steps,
      });

    }).catch(function (error) {
	    console.error(error);
      // res.write("<h1>Sorry, we cannot load this recipe</h1>")
      // res.end();
      res.render('error', {message: "We couldn't parse the specified URL, please try another url."});
    });
});

app.get("/MyBox", (req, res) => {
  res.render('mybox', {})
});

  app.get('*', (req, res) => {
    // res.writeHead(404, { 'Content-Type': 'text/html' });
    // res.write("<h1>404: Page not found</h1>");
    // res.end();
    res.render('error', {message: "404: Page not found"});

  });
  
  const server = http.createServer(app);
    server.listen(port, () => console.log(`Server running at http://localhost:${port}`)); 

  

  