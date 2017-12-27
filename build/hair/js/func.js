/**
 * Created by aihe on 2017/11/27.
 */


var hairCanvas
var canvas
var topPosition = 0
var rate = getRate()
var isMan = false //当前是男模特还是女模特
var hairImgTemplate = _.template($('#hairImgTemplate').html())
var config = {
  isErCodeAdded: false
}

var canvasPadding = 20

var isClicked = false

function addImgScroll () {
  $('#imgScroll').html('')

  var count = 0
  for (var i = 0; i < 30; i++) {
    var url
    if (isMan) {
      url = 'img/hairCroped/man/' + (i + 1) + '.png '
    } else {
      url = 'img/hairCroped/woman/' + (i + 1) + '.png '
    }

    $('#imgScroll').append(
      hairImgTemplate({
        url: url,
        isGenerated: false
      })
    )
    count++
  }
  $('#imgScroll').css('width', count * 80)

  //
  // for (var i = 0 ;i<30;i++){
  //     var url;
  //     if (isMan){
  //         url = "img/hairCroped/man/" +  (i + 1) +".png ";
  //     }else {
  //         url = "img/hairCroped/woman/" +  (i + 1) +".png ";
  //     }
  //
  //     $("#colorHair").append(
  //         hairImgTemplate({
  //             url : url
  //         })
  //     )
  //     count++;
  // }
  // $("#colorHair").css("width",count*100);

}

function getRate () {
  var pageWidth = $(window).width()
  var rate = (pageWidth - canvasPadding) / 750
  return rate
}

function changeHair (ele) {

  if (isClicked) {
    return
  }

  isClicked = true

  var rate = getRate()
  var img = $(ele).find('img')[0]
  canvas = canvas.remove(hairCanvas)
  var hairTopPosition = 10

  fabric.Image.fromURL(img.getAttribute('src'), function (tmpImg) {

    // var width = hairCanvas.width;

    hairCanvas = tmpImg

    if ($(ele).attr('data-isGenerated') != 'true') {
      hairCanvas.scaleX = rate
      hairCanvas.scaleY = rate
    }
    // hairCanvas.width = img.naturalWidth;
    // hairCanvas.height = img.naturalHeight;
    hairCanvas.top = hairTopPosition
    hairCanvas.id = 'hair'
    canvas.add(hairCanvas)
    hairCanvas.moveTo(10)
    hairCanvas.centerH()
    canvas.renderAll()

    if ($(ele).attr('data-isGenerated') != 'true') {
      $('#colorHair').html('')
      //处理额外的几张图片。
      var count = 0
      for (var i = -10; i <= 10; i += 4) {
        var rotation = i / 10
        var filter = new fabric.Image.filters.HueRotation({
          rotation: rotation
        })
        var newImg = jQuery.extend(true, {}, tmpImg)
        newImg.filters.push(filter)
        newImg.applyFilters()
        var imgUrl = newImg.toDataURL()

        $('#colorHair').append(
          hairImgTemplate({
            url: imgUrl,
            isGenerated: true
          })
        )
        newImg = null
        count++
      }

      $('#colorHair').css('width', 80 * count)
    }

    isClicked = false
  })

}

function changeModel () {

  isMan = !isMan
  var ele = $('#manOrWoman')
  // var text = ele.find('.keyWord').attr('alt');

  //换男模特
  addImgScroll()

  $.each(canvas.getObjects(), function (index, obj) {
    var id = obj.id
    if (obj.id) {
      if (
        (isMan && id.indexOf('women') >= 0) ||
        (!isMan && id.indexOf('man') >= 0)
      ) {
        obj.width = 0
      } else if (id.indexOf('man') >= 0 || id.indexOf('women') >= 0) {
        obj.width = document.getElementById('womanModel').naturalWidth
      } else if (id.indexOf('hair') >= 0) {
        canvas.remove(obj)
      }
      canvas.renderAll()
    }
  })

  if (isMan) {
    ele.find('.keyWord').attr('src', './img/icon_girl.png')
  } else {
    ele.find('.keyWord').attr('src', './img/icon_boy.png')
  }

}

//调用手机相机功能。
function callCamera () {
  window.location.href = 'songshucang://webview?action=takePhoto'
}

function saveImage () {
  // console.log('saveImage')
  // $('.canvas-container').css('overflow', 'visible')
  // $('#imgWrap').css('display', 'none')
  // canvas.setDimensions({
  //   top: 0
  // })
  // canvas.renderAll()
  //   $(".canvas-container").css("overflow","unset")
  //   $(".canvas-container").css("z-index","99")

  if (config.isErCodeAdded) {
    window.location.href = 'songshucang://webview?action=getCanvasData'
    return
  }

  fabric.Image.fromURL('./img/hairChangeBottom.png', function (tmpImg) {

    // - canvasPadding
    var width = $(window).width() -  canvasPadding -10;
    if ($(window).width() > 370) {
      width = $(window).width() - 2 * canvasPadding
    }else if ($(window).width() > 400) {
      width = $(window).width() - 4 * canvasPadding
    }

    var naturalWidth = tmpImg.width
    var erRate = width / naturalWidth
    var top = getRate() * 960 + topPosition + 10
    // - Math.floor(40 * erRate)
    // tmpImg.width = width;
    // tmpImg.height = width;
    tmpImg.scaleX = erRate
    tmpImg.scaleY = erRate
    tmpImg.left = canvasPadding / 2
    tmpImg.top = top
    canvas.add(tmpImg)
    tmpImg.moveTo(100)
    tmpImg.centerH()
    config.isErCodeAdded = true

    //判断当前文件运行的环境。调用安卓方法还是调用浏览器方法。调用getCanvasData获取Base64编码字符串。

    window.location.href = 'songshucang://webview?action=getCanvasData'
    // var text = new fabric.Text('扫描二维码下载APP; \n 匹配合适发型', {
    //   fontSize: 8,
    //   textAlign: 'center',
    //   lineHeight: 1.2,
    //   left: -20,
    //   top: top + 70,
    // })
    //
    // var zongMeiWidth = $(window).width() - 20 - 100
    // var zongMei = new fabric.Text('综合美学设计', {
    //   width: zongMeiWidth,
    //   fontSize: 12,
    //   textAlign: 'center',
    //   lineHeight: 1.2,
    //   backgroundColor: 'rgb(218,21,30)',
    //   left: 10 + 100,
    //   top: top ,
    //   padding: 10,
    //   fill:"rgb(255,255,255)"
    //   // textBackgroundColor
    // })
    //
    // var group = new fabric.Group([text,zongMei], {
    //     width: $(window).width() - 20 - 20
    // })
    //
    // canvas.add(group);
    // canvas.add(zongMei);

  })
}

function getCanvasData () {
  var objectToremove = []
  $.each(canvas.getObjects(), function (index, obj) {
    var id = obj.id
    if (!obj.width) {
      objectToremove.push(obj)
    }

  })

  for (var i = 0; i < objectToremove.length; i++) {
    canvas.remove(objectToremove[i])
  }

  return canvas.toDataURL()

}

function setModel (data) {
  $.each(canvas.getObjects(), function (index, obj) {
    var id = obj.id
    if (obj.id) {
      if (
        (id.indexOf('women') >= 0) ||
        (id.indexOf('man') >= 0) ||
        (id.indexOf('custom') >= 0)
      ) {
        obj.width = 0
        obj.id = null
      }
      canvas.renderAll()
    }
  })

  if (typeof (data) === 'string') {
    fabric.Image.fromURL(data, function (tmpImg) {
      var width = $(window).width() - canvasPadding
      var naturalWidth = tmpImg.width
      var erRate = width / naturalWidth

      tmpImg.scaleX = erRate
      tmpImg.scaleY = erRate
      canvas.add(tmpImg)
      tmpImg.moveTo(0)
      tmpImg.centerH()
      tmpImg.id = 'custom'
      tmpImg.selectable = false

    })
  }
}
