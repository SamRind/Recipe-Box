//This is the main javascript page for the web application
//This is built using express and axios.
//Program Name: Recipe Box
//Program Authors: Leah Moser, Sam Rind, Shay Green
//For Full-Stack 465/565
//Spring 2021

//Express routing here to the three pages
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const axios = require("axios").default;
const parser = require('body-parser');
const session = require('express-session')
const passport = require('passport'); 
const LocalStrategy = require('passport-local')
const http = require('http');
const url = 'mongodb+srv://orind:database21!@cluster0.mc5cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


//const router = require('express'); 

// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // Basic Authentication for session and cookies
// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//     next();
//   }
// }
// app.use(auth);
//...
//app.use(express.static(path.join(__dirname, 'public')));
const bcrypt = require('bcrypt');
const flash = require('express-flash'); 
const methodOverride = require('method-override')

//Starting database portion here 
require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://orind:database21!@cluster0.mc5cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true 
});

mongoose.connection.on("error", (err) => {
  console.log("Error: " + err.message)
})

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully")
})

// // //Passoword authentications
//   app.use(session({
//   secret:"our_little secret",
//   resave: false,
//   saveUninitialized: false
// }));

// // app.use(passport.initialize());
// // app.use(passport.session());

//app.use('/api/users', require('./routes/user'));


// app.get("/LogIn", (req, res) => {
//     res.render('login', {})
// });

// app.post("/LogIn", (req, res) => {
//     res.render('mybox',{})
// });

// app.get("/SignUp", (req, res) => {
//       res.render('signup', {})
//   });

//   app.post("/SignUp", (req, res) => {
//       res.render('mybox', {})
//   });

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
  if(req.user)
  {
    res.render('home', {name: req.user.name});
  }
  else {
    res.render('home', {});  
  }
});

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

// app.set('view-engine', 'ejs')
// app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: "our_ little secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// app.get('/', checkAuthenticated, (req, res) => {
//   res.render('index.ejs', { name: req.user.name })
// }); 

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', {}); 
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register', {}); 
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  }
  next()
}

app.get('/home', (req, res) => {
  if(req.user)
  {
    res.render('home', {name: req.user.name});
  }
  else{
    res.render('home', {});  
  }
});


app.get('/About', (req, res) => {
  if(req.user)
  {
    res.render('about', {name: req.user.name});
  }
  else{
    res.render('about', {});  
  }
});

app.get('/search', (req, res) => {
  if(req.user)
  {
    res.render('search', {name: req.user.name, recipe:[]});
  }
  else{
    res.render('search', {recipe:[]})  
  }
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
	  //console.log(response.data);
    //console.log(response.data.hits[0]);
    //console.log(response.data.hits[0].recipe.label)
    let recipelist = [];
    //let ingred = [];
    //so here create object to put stuff into
    //forEach
    //res.end();
    var i = 0
    response.data.hits.forEach(element =>{
      //so here create object to put stuff into build object and push into list
      //ingred.push(ingredientLines);
      var tofill = {name: element.recipe.label, image: element.recipe.image, rUrl: element.recipe.url, yeild: element.recipe.yield, ingredients: element.recipe.ingredientLines, id: i};
      recipelist.push(tofill);
      i+=1;
      //recipelist.push(element.recipe.label)
    })

    res.render('search', {recipe: recipelist});
    }).catch(function (error) {
	      console.error(error);
        res.render('search', {recipe:[]});
      });
      
    
    //res.end();
  });

  app.post('/toadd', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.ingredients);
    const Add = new recipe({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        Ingredients: req.body.ingredients,
        Prep: req.body.Prep,
        Bookmark: req.body.Bookmark,
      })
      Add.save();
      res.redirect('/mybox');
      //res.end(); 
    });
    
  
  // app.use('/AddNew', express.static(path.join(__dirname, '/react/build')));
  // app.get('/AddNew/*', (req, res) => {
  //   res.sendFile(path.join(__dirname + '/react/build/index.html'));
  // });

app.get('/AddNew', (req, res) => {
    if(req.user)
  {
    res.render('add', {name: req.user.name});
  }
  else{
    res.render('add', {})  
  }
    
});

const recipe = require("./model/recipe.js")

app.post('/submit', (req, res) => {
const Add = new recipe({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    Ingredients: req.body.Ingredients, 
                    Prep: req.body.Prep,
                    Bookmark: req.body.Bookmark,
                })
                Add.save();
                res.redirect('/mybox');
                //res.end(); 
});

// const user = require("./model/model.js");
// app.post('/submituser', (req, res) => {

//   if (finduser(req.params.username) === true)
//   {
//     console.log("user does exist so just login") 
//     res.end(); 
//   } 
// const Add = new user({
//                     _id: new mongoose.Types.ObjectId(),
//                     username: req.body.name,
//                     email: req.body.email, 
//                     password: req.body.password,
//                     role: req.body.role,
//                 })
//                 console.log("this is else block test")
//                 Add.save();
//                 res.end(); 
// });



  app.get('/Browse', (req, res) => {
    if(req.user)
    {
      res.render('browse', {name: req.user.name});
    }
    else{
      res.render('browse', {});  
    }
    //res.render('browse', {name: req.user.name});
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
      let im = "/public/images/default-image.jpg";
      if (response.data[0].images.length >= 1){
        im = response.data[0].images[0];
      }
    
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
      res.render('404', {message: "We couldn't parse the specified URL, please try another url."});

    });
  });

  app.post("/recipe", (req, res) => {
    //console.log(req);
    //let name = document.getElementById("recipe");
    //let ingredients = document.getElementById("ingredients");
    //let instructions = document.getElementById("instructions");
    //console.log(name);
    //console.log(ingredients);
    //console.log(instructions);
    const Add = new recipe({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      Ingredients: req.body.Ingredients, 
      Prep: req.body.Prep,
      Bookmark: req.body.Bookmark,
  })
  Add.save();
  res.redirect('/mybox');

  });

  app.get("/MyBox", (req, res) => {
    //let resultfunc = async()=> {
      let resultArray = [];
      mongoose.connect(url, function(err, db){
      var cursor = db.collection('recipes').find();
      //console.log(cursor);
      cursor.forEach(function(doc,err){
        //console.log("doc here", doc);
        //resultArray.push(doc);
        resultArray.push(doc);
        //console.log("Results", resultArray);
    });
    })
    //return await resultArray;
  //};
   // resultfunc().then((value)=>console.log(value))
    setTimeout(function(){
      console.log("Im waiting 7 seconds");
      res.render('mybox', {recipe: resultArray});
    },2000);
    //console.log("Results2", resultArray);
    //console.log("Hello world");
    //console.log("Results3", resultArray);
    //res.render('mybox', {recipe: resultArray});
    
  });

// app.get("/LogIn", (req, res) => {
//     res.render('login', {})
// });

// app.post("/LogIn", (req, res) => {
//     res.render('mybox',{})
// });

// app.get("/SignUp", (req, res) => {
//       res.render('signup', {})
//   });

//   app.post("/SignUp", (req, res) => {
//       res.render('mybox', {})
//   });



  app.get('*', (req, res) => {

    // res.writeHead(404, { 'Content-Type': 'text/html' });
    // res.write("<h1>404: Page not found</h1>");
    // res.end();
    //res.render('404', {message: "404: Page not found"});
    if(req.user)
    {
      res.render('404', {message: "404: Page not found", name: req.user.name});
    }
    else{
      res.render('404', {message: "404: Page not found"})  
    }


  });
  
  const server = http.createServer(app);
    server.listen(port, () => console.log(`Server running at http://localhost:${port}`)); 

  

//****commented out code that we might still need to reference 

//const router = require('express'); 

// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // Basic Authentication for session and cookies
// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//     next();
//   }
// }
// app.use(auth);
//...
//app.use(express.static(path.join(__dirname, 'public')));

//require("./test/sample")
//require("./test/users")

//const users = require('./test/users')
//const sample = require('/test/sample');
//const  { connect } = require('http2')

//require("./model/add.js")
//require("./test/users")

//const users = require('./test/users')
//const sample = require('/test/sample');
//const  { connect } = require('http2')


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

// // passport.use(new LocalStrategy(user.authenticate()))
// app.use(passport.initialize());
// app.use(passport.session());

// //app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // Basic Authentication for session and cookies
// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//     next();
//   }
// }
// //app.use('/login', auth);
// app.use('/login', require('./routes/users')); 
// //Passoword authentications

  // //Registration for user
  // app.post('/register', (req, res) => {
  //   console.log("username:" + req.body.username)
  //   console.log("Password:" + req.body.password)
  //   user.register(new user({username: req.body.username, }), req.body.password, (err, user) => {
  //     if(err){
  //       console.log(err)
  //       res.sendFile(__dirname + '/login.html') //maybe pug??
  //     }
  //     passport.authenticate("local")(req, res, () => {
  //       res.sendFile(__dirname, '/index.html')
  //     })
  //   })
  // })
  //Reg)istration for user 

    // app.use('/AddNew', express.static(path.join(__dirname, '/react/build')));
  // app.get('/AddNew/*', (req, res) => {
  //   res.sendFile(path.join(__dirname + '/react/build/index.html'));
  // });

  // res.write(`<p>Name: ${req.body.name}</p>`);
  // res.write(`<p>Ingredient: ${req.body.Ingredients}</p>`);
  // res.write(`<p>Prep: ${req.body.Prep}</p>`);
  // let Bookmark = (req.body.signup) ? 'Bookmark my recipe' : 'No, thank you.';
  // res.write(`<p> : ${Bookmark}</p>`);
  // res.end();

  // app.get('/usercheck', function(req, res) {
//     User.findOne({username: req.query.username}, function(err, user){
//         if(err) {
//           console.log(err);
//         }
//         var message;
//         if(user) {
//           console.log(user)
//             message = "user exists";
//             console.log(message)
//         } else {
//             message= "user doesn't exist";
//             console.log(message)
//         }
//         res.json({message: message});
//     });
// });

// router.post('/login', function(req, res, next){

// });
