const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // const token = req.header("Authorization");
    const token = req.cookies["myCookie"];

    if (!token)
      return res
        .status(400)
        .json({ statuscode: 401, msg: "Please login now!" });
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(400).json({ statuscode: 400, msg: err });
      console.log(user);

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const verify_user = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!token)
      return res
        .status(400)
        .json({ statuscode: 401, msg: "Please SignUp First!" });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) return res.redirect(`${process.env.CLIENT_URL}/notfound`);

      req.user = user;
      next();
    });
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_URL}/server_error`);
  }
};

module.exports = { auth, verify_user };
