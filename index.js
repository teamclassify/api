const express = require("express");
const cors = require("cors");

const { PORT } = require("./config");
const loginRouter = require("./routes/LoginRouter");
const salaRouter = require("./routes/SalaRouter");
const edificioRouter = require("./routes/EdificioRouter");
const prestamoRouter = require("./routes/PrestamoRouter");
const claseRouter = require("./routes/ClaseRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (_, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/edificios", edificioRouter);
app.use("/api/salas", salaRouter);
app.use("/api/auth", loginRouter);
app.use("/api/prestamos", prestamoRouter);
app.use("/api/clases", claseRouter);

app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
