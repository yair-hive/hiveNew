const net = require('net');
const server = net.createServer();

function checkPort(port) {
  return new Promise((resolve, reject) => {
    server.once('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      }
    });

    server.once('listening', function () {
      resolve(false);
      server.close();
    });

    server.listen(port);
  });
}

module.exports = { checkPort };
