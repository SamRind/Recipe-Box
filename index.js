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

const routes = [
    'Search',
    'AddNew',
    'Browse',
  ];

  let getRoutes = () => {
    let result = '';
  
    routes.forEach(
      (elem) => (result += `<li><a href="/${elem}">${elem}</a></li>`)
    );
  
    return result;
  };
  
  app.get('/', (req, res) => {
    let routeResults = getRoutes();
  
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Recipe Book</h1>`);
    res.write(`<ul> ${routeResults} </ul>`);
    res.end();
  });
  
  
  app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
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
    }).catch(function (error) {
	      console.error(error);
      });
    res.end();
  });
  
  app.get('/AddNew', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Welcome!</h1>");
    res.end();
  });
  
  app.get('/Browse', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/browse.html'));
  });
  app.post('/Browse', (req, res)=> {
    const url = "mycookbook-io1.p.rapidapi.com"
    const apiKey = "d2b5a72c7amshb4dcaa17f424b8fp18e512jsn75615a6fc853"
    res.writeHead(200, { 'Content-Type': 'text/html' });
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
      res.write("<h1>Good Request</h1>");
      res.write(`<h1>${response.data.name}</h1>`);
      res.write(`<h2>Yields: ${response.data.yield}</h2>`);
      res.write(`<p>${response.data.description}</p>`);
      res.write("<ul>");
      response.data.ingredients.forEach(element => {
        res.write(`<li>${element}</li>`)
      });
      res.write("</ul>");
      res.end();
    }).catch(function (error) {
	    console.error(error);
      res.write("<h1>Bad Request</h1>")
      res.end();
    });
});

  app.get('*', (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write("<h1>404: Page not found</h1>");
    res.end();
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  