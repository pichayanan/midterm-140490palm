
var express = require('express');
var bodyparser = require('body-parser');
var app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index');
});


app.get('/products', function (req, res) {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Students");
    var query = {};
    dbo.collection("Studentdetails")
      .find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/products', { classes: result });
        db.close();
      });
  });

});

app.get('/productdetails/:id', function (req, res) {
  var productsid = req.params.id;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Students");
    var query = { Student_id: productsid };
    dbo.collection("Studentdetails").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/productdetails', { detail: result });
      db.close();
    });
  });
});

app.get('/edit/:id', function (req, res) {
  var productsid = req.params.id;
  console.log(productsid);
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Students");
    var query = { Student_id: productsid };
    dbo.collection("Studentdetails").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/edit', { detail: result });
      db.close();
    });
  });
});

app.get('/add/:id', function (req, res) {
  res.render('pages/add');
});
  app.post('/saveAdd', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var years = req.body.years;
    var major= req.body.major;
  ////insert
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Students");
    var newclass = {
      Students_id: id,
      Students_name: name,
      years: years,
      major: major
      

    }
    dbo.collection("Studentdetails").insertOne(newclass, function (err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.redirect("/products");
    });

  });
});


// app.get('/add/:id',function (req, res) {
//   res.render('pages/add', { detail: result });
//   var id = req.body.id;
//   var name = req.body.name;
//   var years = req.body.years;
//   var major= req.body.major;
//   console.log(productsid);
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("Students");
//   var myobj = { ID:id, name: name,years:years,major:major };
//   dbo.collection("Studentdetails").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });
// });

app.get('/Delete/:id', function (req, res) {
  var id = req.params.id;
  MongoClient.connect(url, options, function (err, db) {
      if (err) throw err;
      var dbo = db.db("Students");
      var query = { ID: id };
      dbo.collection("Studentdetails")
          .deleteOne(query, function (err, result) {
              if (err) throw err;
              console.log("Document Deleted");
              db.close();
              res.redirect("/products");
          });
  });
});


app.post('/classsave', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var years = req.body.years;
  var major= req.body.major;
  MongoClient.connect(url,options, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Students");
      var myquery = { Student_id : id };
      var newvalues = { $set: {Student_name : name,years:years,
        major:major} };
      dbo.collection("Studentdetails").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
        res.redirect("/products");
      });
    });
});

app.listen(8080);
console.log('8080 is the magic port http://localhost:8080/');