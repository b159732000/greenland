//    用于压缩图片的canvas
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
//    瓦片canvas
var tCanvas = document.createElement('canvas')
var tctx = tCanvas.getContext('2d')
var maxsize = 100 * 1024
function getError (action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}

function getBody (xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}
/**
 * 获取blob对象的兼容性写法
 * @param buffer
 * @param format
 * @returns {*}
 */
function getBlob (buffer, format) {
  try {
    return new Blob(buffer, { type: format })
  } catch (e) {
    var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)
    buffer.forEach(function (buf) {
      bb.append(buf)
    })
    return bb.getBlob(format)
  }
}
//    使用canvas对大图片进行压缩
function compress (img) {
  var initSize = img.src.length
  var width = img.width
  var height = img.height
  //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  var ratio
  if ((ratio = width * height / 4000000) > 1) {
    ratio = Math.sqrt(ratio)
    width /= ratio
    height /= ratio
  } else {
    ratio = 1
  }
  canvas.width = width
  canvas.height = height
  //        铺底色
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  //如果图片像素大于100万则使用瓦片绘制
  var count
  if ((count = width * height / 1000000) > 1) {
    count = ~~(Math.sqrt(count) + 1) //计算要分成多少块瓦片
    //            计算每块瓦片的宽和高
    var nw = ~~(width / count)
    var nh = ~~(height / count)
    tCanvas.width = nw
    tCanvas.height = nh
    for (var i = 0; i < count; i++) {
      for (var j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height)
  }
  // 进行最小压缩
  var ndata = canvas.toDataURL('image/jpeg', 0.7)
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
  return ndata
}
// 将base64的图片转成二进制对象
function getimgurl (basestr, type) {
  var text = window.atob(basestr.split(',')[1])
  var buffer = new Uint8Array(text.length)
  var pecent = 0, loop = null
  for (var i = 0; i < text.length; i++) {
    buffer[i] = text.charCodeAt(i)
  }
  return getBlob([buffer], type)
}
export default function upload (option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }

  const xhr = new XMLHttpRequest()
  const action = option.action

  if (xhr.upload) {
    xhr.upload.onprogress = function progress (e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
      option.onProgress(e)
    };
  }

  const formData = new FormData()

  if (option.data) {
    Object.keys(option.data).forEach(key => {
      formData.append(key, option.data[key])
    })
  }
  var reader = new FileReader()
  var size = option.file.size / 1024 > 1024 ? (~~(10 * option.file.size / 1024 / 1024)) / 10 + 'MB' : ~~(option.file.size / 1024) + 'KB';
  reader.onload = function () {
    var result = this.result
    var img = new Image()
    img.src = result
    //如果图片大小小于100kb，则直接上传
    if (result.length <= maxsize) {
      var blob = getimgurl(result, option.file.type)
      formData.append(option.filename, blob, option.file.name)
      xhr.open('post', action, true)
      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
      }
      const headers = option.headers || {}

      for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item])
        }
      }
      xhr.send(formData)
      img = null
      return xhr
    }
    //      图片加载完毕之后进行压缩，然后上传
    if (img.complete) {
      callback()
    } else {
      img.onload = callback
    }
    function callback () {
      var data = compress(img)
      var blob = getimgurl(data, option.file.type)
      formData.append(option.filename, blob, option.file.name)
      xhr.open('post', action, true)
      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
      }
      const headers = option.headers || {}

      for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item])
        }
      }
      xhr.send(formData)
      img = null
      return xhr
    }
  }
  reader.readAsDataURL(option.file)
  xhr.onerror = function error (e) {
    option.onError(e)
  };

  xhr.onload = function onload () {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr))
    }
    option.onSuccess(getBody(xhr))
  };
}
