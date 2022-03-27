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

app.get("/userlist", (req, res) => {
  client.query(`SELECT username, userid FROM public."user"`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send("ERR:", err);
    }
  });
});

app.get("/chats", (req, res) => {
  let userid = req.query.user;
  let partnerid = req.query.partner;

  client.query(
    `SELECT * FROM public.chats WHERE useridone = '${userid}' OR useridtwo = '${userid}' AND useridone = '${partnerid}' OR useridtwo = '${partnerid}'`,
    (err, result) => {
      if (!err) {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.send("Nothing found");
        }
      } else {
        console.log("ERR:", err);
      }
    }
  );
});

app.post("/chats", function (request, response) {
  const user = request.body;

  client.query(
    `SELECT * FROM public.chats WHERE chatid = ${user.chatid}`,
    (error, result) => {
      if (!error) {
        if (result.rows.length > 0) {
          client.query(
            `UPDATE public.chats SET prevchat=${user.prevchat} WHERE chatid=${chatid}`,
            (err, res) => {
              if (!err) {
                response.send("inserted");
              } else {
                console.error("ERR:", err);
              }
            }
          );
        }
      } else {
        console.log("ERR:", error);
      }
    }
  );
});
