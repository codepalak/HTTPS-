const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to read the database
const readDatabase = () => {
  const data = fs.readFileSync('db.json', 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to the database
const writeDatabase = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

// Get all todos
app.get('/todos', (req, res) => {
  const db = readDatabase();
  res.json(db.todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const db = readDatabase();
  const newTodo = {
    id: db.todos.length ? db.todos[db.todos.length - 1].id + 1 : 1,
    title: req.body.title,
    status: false
  };
  db.todos.push(newTodo);
  writeDatabase(db);
  res.status(201).json(newTodo);
});

// Update status of todos with even IDs
app.patch('/todos/update-even', (req, res) => {
  const db = readDatabase();
  db.todos = db.todos.map(todo => {
    if (todo.id % 2 === 0 && todo.status === false) {
      return { ...todo, status: true };
    }
    return todo;
  });
  writeDatabase(db);
  res.json({ message: 'Updated even ID todos' });
});

// Delete todos with status true
app.delete('/todos/delete-true', (req, res) => {
  const db = readDatabase();
  db.todos = db.todos.filter(todo => !todo.status);
  writeDatabase(db);
  res.json({ message: 'Deleted todos with status true' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
