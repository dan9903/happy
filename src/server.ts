import express from 'express';

const app = express();

app.get('/users', () => {
  console.log('Welcome user');
});

app.listen(3333);