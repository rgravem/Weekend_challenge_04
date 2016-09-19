var express = require( 'express' );
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded( {extended: false} );
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/toDoList';
var port = process.env.PORT || 3001;

//static folder
app.use( express.static('public'));

//spin up server
app.listen( port, function(){
  console.log('server up on', port);
});

//base url hit
app.get('/', function(req,res){
  console.log('base url hit');
  // send index file
  res.sendFile(path.resolve('public/index.html'));
});
// task list
app.get('/tasks', function(req,res){
  console.log('getting task list');
  // send task list to client
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }else{
      var resultsArray = [];
      var query = client.query('SELECT * FROM task');
      query.on('row', function(row){
        resultsArray.push(row);
      });
      query.on('end', function(){
        done();
        return res.json( resultsArray);
      });
    }// end else
  }); // end connect
}); // end get table

// add task route
app.post('/addTask', urlEncodedParser, function(req, res){
  console.log('add task hit:', req.body);
  // add task and resend task data
  var data = {complete: 'n', task: req.body.task};
  pg.connect( connectionString, function( err, client, done){
    if (err) {
      console.log(err);
    }else{
      var resultsArray = [];
      client.query('INSERT INTO task (complete, task) VALUES ($1, $2)', [data.complete, data.task]);
      var query = client.query('SELECT * FROM task ORDER BY id DESC LIMIT 1');
      query.on('row', function(row){
        resultsArray.push( row );
      }); // end on row
      query.on('end', function(){
        done();
        return res.json( resultsArray );
      });
    } // end else
  }); // end connect
}); // end addTask post

app.post('/deleteTask', urlEncodedParser, function(req, res){
  console.log('deleteTask hit:', req.body);
  var data = {task: req.body.task};
  // delete and resent db info
  pg.connect( connectionString, function( err, client, done){
    if (err) {
      console.log(err);
    }else{
      var resultsArray = [];
      client.query('DELETE FROM task WHERE task=($1)', [data.task]);
      var query = client.query('SELECT * FROM task');
      query.on('row', function(row){
        resultsArray.push(row);
      });
      query.on('end', function(){
        done();
        return res.json(resultsArray);
      });
    } // end else
  }); // end connect
}); // end deleteTask post

app.post('/completeTask', urlEncodedParser, function(req, res){
  console.log('deleteTask hit:', req.body);
  var data = {
    complete: 'y',
    task: req.body.task};
  pg.connect( connectionString, function( err, client, done ){
    if (err) {
      console.log(err);
    }else{
      var resultsArray = [];
      client.query('UPDATE task SET complete=($1) WHERE task=($2)', [data.complete, data.task]);
      var query = client.query('SELECT * FROM task ORDER BY complete ASC');
      query.on('row', function(row){
        resultsArray.push(row);
      });
      query.on('end', function(){
        done();
        return res.json(resultsArray);
      });
    } // end else
  });//end connect
});// end complete task
