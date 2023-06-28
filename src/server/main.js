/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import expressMysqlSession from 'express-mysql-session';

import actionsRouter from './routs/actions.js';
import api from './routs/api.js';
import wss from './socket.js';

const MySQLStore = expressMysqlSession(session);

const app = express();
const port = 3025;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', req.get('origin'));
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('hello world');
});
app.use('/actions', actionsRouter);
app.use('/api', api);

const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hive',
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    store: sessionStore,
    secret: 'yair',
    resave: true,
    saveUninitialized: true,
  })
);
const server = app.listen(port, () => {
  console.log(`express start on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit('connection', socket, request);
  });
});
