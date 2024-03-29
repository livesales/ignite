const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { json } = require('express');

const app = express();

app.use(cors());
app.use(express.json());


const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  user = users.find((element) => element.username === username);
  if (!user) {
    return response.status(400).json({error : "customer not found"})
  }
  request.user = user;
  return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  
  alreadyExist = users.some((users) => users.username === username);

  if (alreadyExist) {
    return response.status(400).json({error: 'usuario ja existe'})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });
  return response.status(200).send('backend ok');
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodos = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(newTodos);

  return response.status(200).send(newTodos)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const updateTodos = user.todos.find((element) => element.id === id);
  if (!updateTodos){
    return response.status(400).json({error: "To do not found"})
  } 
  updateTodos.title = title;
  updateTodos.deadline = new Date(deadline);
  return response.status(200).json(updateTodos);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const updateTodos = user.todos.find((element) => element.id === id);
  if (!updateTodos){
    return response.status(400).json({ error: "To do not found"})
  } 
  updateTodos.done = true;
  return response.status(200).json(updateTodos);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const updateTodos = user.todos.findIndex((element) => element.id === id);
  users.splice(updateTodos,1);
  return response.status(200).json();
});

module.exports = app;
