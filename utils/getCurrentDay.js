function getCurrentDay() {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  const strMes = mes.toString().padStart(2, "0");
  const strDia = dia.toString().padStart(2, "0");

  return `${anio}-${strMes}-${strDia}`;
}

module.exports = getCurrentDay;

