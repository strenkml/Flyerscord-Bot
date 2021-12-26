/* -------------------------------------------------------------------------- */
/*                                Current Time                                */
/* -------------------------------------------------------------------------- */
// Gets the current date in the format: YYYY-MM-DD
module.exports.getDate = () => {
  let ts = Date.now();
  let date = new Date(ts);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

// Gets the current date in the format: MM/DD/YY HH:MM:SS.ss
module.exports.createDateAndTime = () => {
  let ts = Date.now();
  let date = new Date(ts);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds();

  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getYear();

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

/* -------------------------------------------------------------------------- */
/*                                  UTC Time                                  */
/* -------------------------------------------------------------------------- */
// Gets the current UTC time in the format: YYYYMMDD_HHMM
function createStartTimecode() {
  var utcTime = new Date(new Date().toUTCString());
  return `${utcTime.getFullYear}${
    utcTime.getMonth() + 1
  }${utcTime.getDate()}_${utcTime.getHours()}${utcTime.getMinutes()}`;
}