import { UAParser } from "ua-parser-js";

export const system = new UAParser().getResult();

//get the IP addresses associated with an account
export function getIP(){
  return new Promise<string>((resolve, reject) => {
    //compatibility for firefox and chrome
    const RTCPeerConnection = window.RTCPeerConnection

    //bypass naive webrtc blocking using an iframe
    if(!RTCPeerConnection){
      reject(new Error('not support'))
      return;
    }


      const connect =  new RTCPeerConnection({
        iceServers: []
    });
    function noop(){}
      connect.onicecandidate = function(ice){
      if (ice.candidate){
          //使用正则获取ip
          const ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}|[a-z0-9-]+\.local)/
          const ip_addr = ip_regex.exec(ice.candidate.candidate)?.[1];
          connect.onicecandidate = noop
          connect.close();
          if (ip_addr) {
            resolve(ip_addr)
          } else {
            reject(new Error('fail'))
          }
      }
    }

    connect.createDataChannel('getip')
    connect.createOffer(connect.setLocalDescription.bind(connect),noop)

    setTimeout(() => {
      // timeout after 1s
      reject(new Error('timeout'))
    }, 1000)
  })
}


export function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((config) => {
      if (config) {
        resolve(`${config.coords.latitude} - ${config.coords.longitude}`)
      } else {
        reject(new Error('fail'))
      }
    })

    setTimeout(() => {
      reject(new Error('timeout'))
    }, 1000)
  })
}