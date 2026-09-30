const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Anshika");
});
app.get("/api/projects", (req, res) => {
  const projects = [
    { id: 1, title: "Todo App", tech: "React" },
    { id: 2, title: "Weather App", tech: "React + API" },
  ];
  res.json(projects);
});
app.listen(5000, () => {
  console.log("Server chalu hai port 5000 pe");
});
