const TimeUtil = {
  convertMsToReadable(timeMs) {
    const time = new Date(timeMs);
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();
    const seconds = time.getUTCSeconds();
    return [hours, minutes, seconds].map(value => ("0" + value).slice(-2)).join(':');
  },

  convertMsToDate(timeMs) {
    const date = new Date(timeMs);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    return [month, day, year].map(value => ("0" + value).slice(-2)).join('/');
  }
}

export default TimeUtil;