const static = require('node-static'); 
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const file = new static.Server('./public'); 
const bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    file.serve(req, res); 
}); 

app.post('/submit', (req, res) => {
  // Add your code here
  res.write(`<p>name: ${req.body.name} </p>`);
  res.write(`<p>email: ${req.body.email}</p>`);
  let Comments = (req.body.Comments === '') ? 'N/A': req.body.Comments;
  res.write(`<p> Comments:  ${Comments} </p>`);
  let newsletter = (req.body.signup) ? 'Yes, sign me up ' : 'No, thank you ';  
  res.write(`<p>Newsletter: ${newsletter} </p>`);
  res.end(); 
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
