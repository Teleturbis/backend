const client = require("./connection.js");
const express = require("express");
const app = express();

var bodyParser = require("body-parser");
var cors = require("cors");
const bcrypt = require("bcrypt");

app.use(bodyParser());
app.use(cors());

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log("Server is listening at port 3300");
});

client.connect();

app.get("/test", (req, res) => {
  res.send("Hello World! I AM EXISTING!!!");
});

app.get("/login", (req, res) => {
  let user = req.query.user;
  let pw = req.query.pw;

  client.query(
    `Select * from public."user" where username = '${user}'`,
    (err, result) => {
      if (!err) {
        if (result.rows.length > 0) {
          // compare password and hash
          bcrypt.compare(pw, result.rows[0].password, (err, compare) => {
            compare
              ? res.send({
                  userid: result.rows[0].userid,
                  username: result.rows[0].username,
                })
              : res.send("Access denied");
          });
        } else {
          res.send("No User found");
        }
      } else {
        res.send("ERROR", err);
      }
    }
  );
  client.end;
});

app.post("/newUser", function (request, response) {
  const user = request.body;
  const saltRounds = 10;

  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    // Store hash in DB.
    client.query(
      `INSERT INTO public."user" (userid, username, password) VALUES ('${user.id}', '${user.userName}', '${hash}')`,
      (err, res) => {
        if (!err) {
          response.send("inserted");
        } else {
          console.error("ERR:", err);
        }
      }
    );
  });
});
