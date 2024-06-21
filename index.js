const express = require("express");
const cors = require("cors");

const { PORT } = require("./config");
const loginRouter = require("./routes/LoginRouter");
const salaRouter = require("./routes/SalaRouter");
const edificioRouter = require("./routes/EdificioRouter");
const prestamoRouter = require("./routes/PrestamoRouter");
const claseRouter = require("./routes/ClaseRouter");
const fileRouter = require("./routes/FileRouter");
const eventoRouter = require("./routes/EventoRouter");
const usuarioRouter = require("./routes/UsuarioRouter");
const salaRecursosRouter = require("./routes/RecursoRouter");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/api", (_, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/edificios", edificioRouter);
app.use("/api/salas", salaRouter);
app.use("/api/auth", loginRouter);
app.use("/api/prestamos", prestamoRouter);
app.use("/api/clases", claseRouter);
app.use("/api/files", fileRouter);
app.use("/api/eventos", eventoRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/recursos", salaRecursosRouter);

app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
