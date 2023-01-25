const keys = require("../config/keys");

module.exports = function authenticateAdmin(req, res, next) {
  const token = req.headers["adminAuth"];
  if (valid) {
    try {
      const resultToken = jwt.verify(token, keys.aPKey);
      if (!resultToken && !resultToken.admin) res.status(401).send("Unauthorised");
      next();
    } catch (e) {
      res.status(400).send("Invalid Token");
    }
  } else res.status(401).send("Unauthorised");
}
