import express from 'express';
import dotenv from 'dotenv'

dotenv.config({path: '../.env'});

const app = express();
const port = process.env.PORT;
// const port = 3000


app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});