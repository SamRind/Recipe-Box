//Express routing here to the three pages
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

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
  
  // Add your code here
  app.get('/search', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Welcome!</h1>`);
    res.end();
  });
  
  app.get('/AddNew', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Welcome!</h1>");
    res.end();
  });
  
  app.get('/Browse', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Welcome!</h1>");
    res.end();
  });

  app.get('*', (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write("<h1>404: Page not found</h1>");
    res.end();
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  