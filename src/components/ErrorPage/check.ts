export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isIE() {
  return (
    (navigator.userAgent.indexOf("compatible") > -1 &&
      navigator.userAgent.indexOf("MSIE") > -1) ||
    (navigator.userAgent.indexOf("Trident") > -1 &&
      navigator.userAgent.indexOf("rv:11.0") > -1)
  );
}

export function getError() {
  if (isMobile()) {
    return {
      message: "Not Support Mobile Devices.",
      info: [
        "Mobile devices are not supported for now，please switch to a computer to access.",
        "暂不支持移动设备使用，请移步至电脑访问。",
      ],
    };
  }

  if (isIE()) {
    return {
      message: "Old Browser.",
      info: ["IE Out.", "换个浏览器吧老板。"],
    };
  }

  return null
}
