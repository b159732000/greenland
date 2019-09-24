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

export default function uploadVoice (option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }
  console.log(JSON.stringify(option.data))
  const xhr = new XMLHttpRequest()
  const action = option.action

  // FormData 对象

  var form = new FormData()

  if (option.data) {
    Object.keys(option.data).forEach(key => {
      form[key] = option.data[key]
    })
  }
  console.log(form)
  //   return
  // XMLHttpRequest 对象

  xhr.open('post', action, true)

  //   xhr.onload = function () {

  //     alert("上传完成!");

  //   };
  const headers = option.headers || {}

  for (let item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }

  xhr.send(JSON.stringify(option.data))

  xhr.onerror = function error (e) {
    option.onError(e)
  }
  xhr.onload = function onload () {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr))
    }
    option.onSuccess(getBody(xhr))
  }
}
