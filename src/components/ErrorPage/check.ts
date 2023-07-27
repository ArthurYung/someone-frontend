export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isPWA() {
  return new URLSearchParams(location.search).get('mode') === 'pwa'
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
  // if (isMobile()) {
  //   return {
  //     message: "Not Support Mobile Devices.",
  //     info: [
  //       "Mobile devices are not supported for now，please switch to a computer to access.",
  //       "暂不支持移动设备使用，请移步至电脑访问。",
  //     ],
  //   };
  // }
  if (isMobile() && !isPWA()) {
    return {
      message: "Browsing environment is restricted",
      info: [
        "Only supports opening with Web APP.",
        "为了后续更好的体验，移动端仅支持Web APP模式下访问(PWA).",
        "请将本网站添加至手机桌面，并通过桌面入口程序访问.",
        "添加方式如下:",
        "[IOS] Safari浏览器中打开 -> 分享 -> 添加至桌面.",
        "[Android] 根据自带浏览器指引将本站添加到桌面."
      ]
    }
  }

  if (isIE()) {
    return {
      message: "Old Browser.",
      info: ["IE Out.", "换个浏览器吧老板。"],
    };
  }

  return null
}
