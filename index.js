//Express routing here to the three pages
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const axios = require("axios").default;
const parser = require('body-parser');
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
  
  
  app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/search.html'));
  });
  app.post('/Search', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
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
    res.write(`<h1>${response.data.hits[0].recipe.label.toString()}</h1>`);
    res.write(`<img src=${response.data.hits[0].recipe.image}/>` );
    forEach
    res.end();
    results.data.hits.forEach(element =>{
      res.write(element.recipe.label)
    })
    //let results = [];
    }).catch(function (error) {
	      console.error(error);
        res.end();
      });
    //res.end();
  });
  
  app.get('/AddNew', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Welcome!</h1>");
    res.sendFile("Send the html file"); 
    res.end();
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
	    console.log(response.data[0]);
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
      console.log(im)
      let instructions = []
      response.data[0].instructions[0].steps.forEach(element => {
        console.log(element)
        console.log(element.toString())
        instructions.push(element.toString())
      });
      res.render('recipe', {
        recipe: response.data[0].name,
        description: response.data[0].description,
        url: recipe,
        yields: response.data[0].yield,
        image: im,
        ingredients: response.data[0].ingredients,
        instructions: instructions,
      });

    }).catch(function (error) {
	    console.error(error);
      // res.write("<h1>Sorry, we cannot load this recipe</h1>")
      // res.end();
      res.render('error', {message: "We couldn't parse the specified URL, please try another url."});
    });
});

  app.get('*', (req, res) => {
    // res.writeHead(404, { 'Content-Type': 'text/html' });
    // res.write("<h1>404: Page not found</h1>");
    // res.end();
    res.render('error', {message: "404: Page not found"});

  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  