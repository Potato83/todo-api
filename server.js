var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());



app.get('/', function (req, res) {
	res.send("Todo API Root");
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var match = _.findWhere(todos, {id: todoId});


	if(match){
		res.json(match);
		console.log(match);
	} else {
		res.status(404).send('No dice!');
	}
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
	{
		return res.status(400).send('ya fucked er up');
	}

	// set body.description to be trimmed value
	body.description = body.description.trim();

	body.id = todoNextId++;
	todos.push(body);
	
	console.log('description: ' + body.description);
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var match = _.findWhere(todos, {id: todoId});

	if(!match){
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, match);
		console.log(match);
		res.json(match);
	}
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res ){
	var todoId = parseInt(req.params.id, 10);
	var match = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if(!match){
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')){
		return res.status(400).send();
	} 

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(match, validAttributes);
	res.json(match);

});






app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});