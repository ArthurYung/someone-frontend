export function getTimePeriod() {
  var currentTime = new Date();
  var hour = currentTime.getHours();

  if (hour >= 5 && hour < 9) {
    return "早上";
  } else if (hour >= 9 && hour < 12) {
    return "上午";
  } else if (hour >= 12 && hour < 18) {
    return "下午";
  } else {
    return "晚上";
  }
}