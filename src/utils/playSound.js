// 播放声音
export default function playSound () {
  var soundSrc = '/static/admin/js/default.mp3'
  var borswer = window.navigator.userAgent.toLowerCase()
  if (borswer.indexOf('ie') >= 0) {
    // IE内核浏览器
    var strEmbed = '<embed name="embedPlay" src="' + soundSrc + '" autostart="true" hidden="true" loop="false"></embed>'
    if ($('body').find('embed').length <= 0) { $('body').append(strEmbed) }
    var embed = document.embedPlay

    // 浏览器不支持 audion，则使用 embed 播放
    embed.volume = 100
    // embed.play();这个不需要
  } else {
    // 非IE内核浏览器
    var audio = document.createElement('audio')
    audio.src = soundSrc
    audio.play()
  }
}
