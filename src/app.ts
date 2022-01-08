import * as dotenv from 'dotenv';
import express from 'express';
import * as bodyParser from 'body-parser';
import { router } from './route';
import seed from './seed';

const app = express();
dotenv.config();

app.use(bodyParser.json());

seed();

app.use('/', router);

app.listen(process.env.PORT, () => {
  console.log('Node server started running');
});
