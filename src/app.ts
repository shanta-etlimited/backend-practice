import express, { Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
const app = express();
const port = 3000;

//parsers
app.use(express.json());
app.use(cors());


//application r  outes
app.use("/api/v1/students", StudentRoutes)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
// console.log(process.cwd());

export default app;
