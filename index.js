const express = require("express");
const cors = require("cors");

const { PORT } = require("./config");
const loginRouter = require("./routes/LoginRouter");
const salaRouter = require("./routes/SalaRouter");
const edificioRouter = require("./routes/EdificioRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (_, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/edificios", edificioRouter);
app.use("/api/salas", salaRouter);
app.use("/api/auth", loginRouter);

app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
