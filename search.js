const static = require('node-static');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const file = new static.Server('./public');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/',(req, res)=> {
  file.serve(req,res);
});

app.post('/submit', (req,res)=>{
  res.write(`<p>Name: ${req.body.name} </p>`);
  res.write(`<p>Email: ${req.body.email}</p>`);
  let comments = (req.body.comments === '') ? 'N/A': req.body.comments;
  res.write(`<p> Comments: ${comments} </p>`);
  let newsletter = (req.body.signup) ? 'Yes, sign me up ' : "No, don't sign me up";
  res.write(`<p>Newsletter: ${newsletter}</p>`);
  res.end();



});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
