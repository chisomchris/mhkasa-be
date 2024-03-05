const IP = require("ip");

const userAgent = async (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const remoteAddress = req.socket.remoteAddress;
  const localAddress = req.socket.localAddress;
  const localPort = req.socket.localPort;
  const remotePort = req.socket.remotePort;
  const expressIp = req.ip;
  const Ip = IP.address();
  console.log({
    remoteAddress,
    localAddress,
    localPort,
    remotePort,
    expressIp,
    Ip,
  });
  req.client = `${ip}-${userAgent}`;
  next();
};

module.exports = { userAgent };
