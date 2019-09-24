let baseUrl = 'http://statistics.isunupcg.com'
let routerMode = 'hash'
let imgBaseUrl = process.env.VUE_APP_IMAGE_URL
// let socketurl=process.env.VUE_APP_SOCKET_URL;
const SOCKETURL = 'ws://101.200.47.90:7272'
let socketurl = SOCKETURL

// console.log(imgBaseUrl);

/* if (process.env.NODE_ENV == 'development') {
  imgBaseUrl = '/img/';
  socketurl='ws://121.41.38.42:7272';

}else if(process.env.NODE_ENV == 'production'){
  imgBaseUrl = '//elm.cangdu.org/img/';
  //socketurl='wss://api.xiaokefu.com.cn';
  socketurl='ws://121.41.38.42:7272';
} */
export {
  baseUrl,
  routerMode,
  socketurl,
  imgBaseUrl
}
