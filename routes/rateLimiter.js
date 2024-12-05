const redisClient = require("../config/redisconfig");

module.exports.rateLimiter =
  (secondsLimit, limitAmount) => async (req, res, next) => {
    const ip = req.connection.remoteAddress;

    [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();

    if (response[1] > limitAmount)
      res.json({
        statuscode: 202,
        msg: "Slow down!! Try again in a minute.",
      });
    else next();
  };
