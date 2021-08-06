const express = require("express");
const theDB = require("./develop/db/db.json");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const util = require("util");

const readFromFile = util.promisify(fs.readFile);
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//read the db.json and return notes as JSON
app.get("/api/notes", (req, res) => res.json(theDB));

//POST
app.post("/api/notes", async (req, res) => {
  const { title, text } = req.body;
  // Read file:
  const buffer = await readFromFile("./develop/db/db.json");
  const data = JSON.parse(buffer);

  // add {title, text} to file:
  data.push({ title, text, note_id: uuidv4() });
  // Save file fs.
  await writeToFile("./develop/db/db.json", data);
  // Return file
  res.send("Success");
});

// Is exposing the public folder to be accessible
app.use(express.static(path.join(__dirname, "develop/public")));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
