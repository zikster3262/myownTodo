const express = require("express");
const app = express();
const path = require("path");
let sanitizeHTML = require("sanitize-html");
const res = require("express/lib/response");
const { MongoClient } = require("mongodb");
let ObjectID = require("mongodb").ObjectID;
const { nextTick } = require("process");
const { get } = require("express/lib/response");
const { response } = require("express");
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
const recordRouter = express.Router();
const database = "Notes";
const uri = `mongodb+srv://zikster:Tran3262@app.hykmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port);
console.log("Server started at http://localhost:" + port);

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/notes", function (req, res) {
  res.sendFile(path.resolve("public/notes.html"));
});

// Create
app.post("/create-note", function (req, res) {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let note_name = sanitizeHTML(req.body.note_name, {
      allowedTags: [],
      allowedAttributes: {},
    });
    let note_date = sanitizeHTML(req.body.note_date, {
      allowedTags: [],
      allowedAttributes: {},
    });
    let note_text = sanitizeHTML(req.body.note_text, {
      allowedTags: [],
      allowedAttributes: {},
    });
    dbo
      .collection("notes")
      .insertOne(
        { note_text: note_text, note_name: note_name, note_date: note_date },
        function (err, info) {
          if (err) {
            console.log("Error occurred while inserting");
          }
        }
      );
  });
});

async function dbQuery() {
  const db = await MongoClient.connect(uri);
  var dbo = db.db(database);
  const result = await dbo.collection("notes").find({}).toArray();
  return result;
}

app.get("/get-notes", function (req, res) {
  let result = dbQuery().then((result) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ data: result }));
  });
});

async function findQuery(id) {
  const db = await MongoClient.connect(uri);
  var dbo = db.db(database);
  const result = await dbo
    .collection("notes")
    .findOne({ _id: new ObjectID(id) });
  return result;
}

app.post("/find", function (req, res) {
  let result = findQuery(req.body.id)
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ data: result }));
    })
    .catch((error) => console.log(error));
});

async function findAndUpdate(rec_name, rec_text, rec_date, rec_id) {
  const db = await MongoClient.connect(uri);
  var dbo = db.db(database);
  const result = await dbo.collection("notes").findOneAndUpdate(
    { _id: new ObjectID(rec_id) },
    {
      $set: {
        note_name: rec_name,
        note_text: rec_text,
        note_date: rec_date,
      },
    }
  );
  return result;
}

app.post("/update", function (req, res) {
  let result = findAndUpdate(
    req.body.note_name,
    req.body.note_text,
    req.body.note_date,
    req.body.id
  )
    .then((response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ data: "changed" }));
    })
    .catch((error) => console.log(error))
    .finally();
});

async function deleteRecord(id) {
  const db = await MongoClient.connect(uri);
  var dbo = db.db(database);
  const result = await dbo
    .collection("notes")
    .deleteOne({ _id: new ObjectID(id) });
  return result;
}

app.post("/delete", function (req, res) {
  let result = deleteRecord(req.body.id)
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ data: result }));
    })
    .catch((error) => console.log(error));
});
