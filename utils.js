export function getTimeDiff(lastActTime) {
    const currTime = new Date();
    const hourDiff = (currTime.getTime() - lastActTime) / (1000 * 60 * 60);
    if (hourDiff <= 24) {
        return Math.round(hourDiff) + " hours ago";
    } else {
        return Math.round(hourDiff / 24) + " days ago";
    }
  }

