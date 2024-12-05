const route = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../DB/User");
const bcrypt = require("bcrypt");
const { auth, verify_user } = require("./auth");
const { addEmailQueue, demo } = require("../util/queues/emailqueue");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const { rateLimiter } = require("./rateLimiter");

route.get("/si", async (req, res) => {
  res.render("mail", {
    name: "pramod",
    token: "kjhgftyu",
  });
});

route.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(403).json({ msg: "required all fields" });
    }
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res
        .status(409)
        .json({ msg: "Email already exists", statuscode: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const Token = createAccessToken({ email });
    const verifyToken = `${process.env.SERVER_URL}/v1/api/auth/verify/${Token}`;
    demo({ name: username, email: email, token: verifyToken });
    const sentdata = await addEmailQueue({
      name: username,
      email: email,
      token: verifyToken,
    });

    if (sentdata) {
      // const user = await User.create({
      //   username,
      //   email,
      //   password: hashedPassword,
      // });

      return res
        .status(201)
        .json({ msg: "Registration success!", statuscode: 201 });
    } else {
      return res.status(400).json({ msg: "invali mail id", statuscode: 400 });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

// Verify Email
route.get("/auth/verify/:token", verify_user, async (req, res) => {
  try {
    const data = await User.findOne({ where: { email: req.user.email } });

    if (!data) {
      return res.status(401).json({ msg: "First register yourself" });
    }

    // update status
    const [updated] = await User.update(
      { isVerified: true },
      {
        where: { email: req.user.email },
      }
    );

    // return res.json({ msg: "verified" });
    //  redirect to Client side for show verification is done
    return res.redirect(`${process.env.CLIENT_URL}/successfulVerified`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
});

route.post("/login", rateLimiter(60, 3), async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(442).json({ msg: "All filed required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.dataValues.password))) {
      return res
        .status(401)
        .json({ statuscode: 401, msg: "Invalid email or password" });
    } else {
      const refresh_token = createRefreshToken({ id: user.dataValues.id });

      res.cookie("myCookie", refresh_token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ msg: "Login success!", refresh_token, statuscode: 200 });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

route.get("/access", auth, async (req, res) => {
  try {
    const userdata = await User.findByPk(req.user.id);

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ userdata, statuscode: 200 });
  } catch (err) {
    return res.status(500).json(err);
  }
});

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = route;
