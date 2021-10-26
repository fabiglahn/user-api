import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = ['Alice', 'Manu', 'Fabi'];

app.post('/api/users', (request, response) => {
  response.send(request.body.name);
});

app.delete('/api/users/:name', (request, response) => {
  const index = users.indexOf(request.params.name);
  if (index === -1) {
    response.status(404).send('Sorry! Name is unknown! :(');
    return;
  }

  users.splice(index, 1);
  response.send('deleted');
});

app.get('/api/users/:name', (request, response) => {
  const isKnownName = users.includes(request.params.name);
  if (isKnownName) {
    response.send(request.params.name);
  } else {
    response.status(404).send('Sorry! Name is unknown! :(');
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
