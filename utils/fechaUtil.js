const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Retorna la fecha actual en formato ISO ajustada a la hora de Lima (UTC-5).
 */
function obtenerFechaHoraLima() {
  return dayjs().tz("America/Lima").format("DD-MM-YYYY HH:mm:ss");
}

module.exports = {
  obtenerFechaHoraLima,
};
