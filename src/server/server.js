const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const BILL_CSV = 'bill.csv';
const writer = fs.createWriteStream(__dirname + '/' + BILL_CSV, {
  flags: 'a' // 'a' means appending (old data will be preserved)
});
const options = {
  root: path.join(__dirname)
};

app.get('/categories', (req, res, next) => {
  const fileName = 'categories.csv';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/bill', (req, res, next) => {
  const fileName = BILL_CSV;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.post('/bill', (req, res) => {
  writer.write(req.body.type + ',' + req.body.time + ',' + req.body.category + ',' + req.body.amount + '\n');
  const result ={result: "1"};
  res.send(result);
  res.end();
});

app.listen(5000, () => {
  console.log("Started on PORT 5000");
})
