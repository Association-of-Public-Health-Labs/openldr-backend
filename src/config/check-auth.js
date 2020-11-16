const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "580902680771-km8dhdl0hpbh00jnjgj9umalhmkdk4f3.apps.googleusercontent.com"
);

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.JWT_KEY);
    // req.userData = decoded;
    // console.log("Jwt decoded", decoded);
    console.log("Token:",token)

    jwt.verify(token, process.env.JWT_KEY, async function (err, decoded) {
      // if (err) {
      //   const ticket = await client.verifyIdToken({
      //     idToken: token,
      //     audience:
      //       "580902680771-km8dhdl0hpbh00jnjgj9umalhmkdk4f3.apps.googleusercontent.com",
      //   });
      //   const payload = ticket.getPayload();
      //   const userid = payload["sub"];
      //   console.log(userid);
      // }
      req.userData = decoded;
      if(decoded){
        next();
      }
      else{
        return res.status(401).json({
          message: "Auth failed",
        });
      }
    });

  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
