import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

// Custom middleware to log requests
app.use((request, _response, next) => {
  console.log('Request received', request.url);
  next();
});

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

const users = [
  { name: 'Alice', username: 'alice-petzi', password: 'qwertz' },
  {
    name: 'Manu',
    username: 'manu-bawue',
    password: 'asdfgh',
  },
  {
    name: 'Fabi',
    username: 'eff_geh',
    password: 'yxcvb',
  },
];

// Get a single user
app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('This page is not here!');
  }
});

// Delete a user
app.delete('/api/users/:username', (request, response) => {
  const usersIndex = users.findIndex(
    (user) => user.username === request.params.username
  );
  if (usersIndex === -1) {
    response.status(404).send('Name is unknown');
    return;
  }
  users.splice(usersIndex, 1);
  response.send('Deleted');
});

app.post('/api/users', (request, response) => {
  const newUser = request.body;
  if (
    typeof newUser.name !== 'string' ||
    typeof newUser.username !== 'string' ||
    typeof newUser.password !== 'string'
  ) {
    response.status(400).send('Missing properties');
    return;
  }
  if (users.some((user) => user.username === newUser.username)) {
    response.status(409).send('User already exists');
  } else {
    users.push(newUser);
    response.send(`${newUser.name} added`);
  }
});

// Login a new user
app.post('/api/login', (request, response) => {
  const loginUser = request.body;
  const existingUser = users.find(
    (user) =>
      user.username === loginUser.username &&
      user.password === loginUser.password
  );
  if (existingUser) {
    response.setHeader('Set-Cookie', `username=${existingUser.username}`);
    response.send('Welcome!');
  } else {
    response.status(401).send('No login for you!');
  }
});

app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);
  if (foundUser) {
    response.send(foundUser);
  } else {
    response.status(404).send('User not found');
  }
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
