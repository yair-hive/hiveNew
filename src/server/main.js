/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import expressMysqlSession from 'express-mysql-session';

import projects from './routs/api/projects.js';
import actionsRouter from './routs/actions.js';
import api from './routs/api.js';
import wss from './socket.js';

const MySQLStore = expressMysqlSession(session);

const app = express();
const port = 3025;

app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', req.get('origin'));
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('hello world');
});
app.get('/test', async (req, res) => {
  const maps = await projects.export(req.query);
  res.send(maps);
});
app.use('/actions', actionsRouter);

try {
  app.use('/api', api);
} catch (error) {
  console.error(error);
}

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
