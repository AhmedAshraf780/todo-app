import express from 'express';
import cors from 'cors';


const notes = []
const todos = []
const projects = []

const app = express();

app.use(cors({
  origin: 'http://localhost:3175',
}));

app.get('/', (req, res) => {
  res.send('Welcome to our todo-app');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 
