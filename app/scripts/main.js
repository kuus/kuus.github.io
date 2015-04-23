/* jshint devel:true */

(function(window, document, $) {
  'use strict';

  var $window = $(window);
  var $document = $(document);
  var $logo =$('#logo');
  var resume = document.getElementById('resume');
  var $resume = $(resume);
  var resumeSpans = resume ? resume.getElementsByTagName('span') : [];
  var fonts = ['"Georgia, serif"', '"Palatino Linotype", "Book Antiqua", Palatino, serif', '"Times New Roman", Times, serif ', 'Arial, Helvetica, sans-serif', '"Arial Black", Gadget, sans-serif', '"Comic Sans MS", cursive, sans-serif', 'Impact, Charcoal, sans-serif', '"Lucida Sans Unicode", "Lucida Grande", sans-serif', 'Tahoma, Geneva, sans-serif', '"Trebuchet MS", Helvetica, sans-serif', 'Verdana, Geneva, sans-serif', '"Courier New", Courier, monospace', '"Lucida Console", Monaco, monospace' ];

  /**
   * Is Mobile
   * @return {Boolean}
   */
  function isMobile () {
    var navigatorAgent = navigator.userAgent || navigator.vendor || window.opera;
    return (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigatorAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigatorAgent.substr(0, 4)));
  }

  /**
   * Debouncer utility
   * @param  {function} func
   * @param  {int}      timeoutArg
   * @return {function}
   */
  function debouncer (func , timeoutArg) {
    var timeoutID;
    var timeout = timeoutArg || 200;
    return function () {
      var scope = this;
      var args = arguments;
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function () {
        func.apply(scope, Array.prototype.slice.call(args));
      }, timeout);
    };
  }

  /**
   * On resize
   * @return {void}
   */
  function _resize() {
    var maxH = Math.max(window.innerHeight, window.innerWidth);
    var rFmaxSize = maxH / 15;
    var rFminSize = maxH / 30;
    _randomizeFonts(rFmaxSize, rFminSize);
    $resume.fadeIn();
  }

  /**
   * Randomize resume font
   * help from @link(http://jsfiddle.net/hNqfq/1/)
   * @param  {int} rFmaxSize
   * @param  {int} rFminSize
   * @return {void}
   */
  function _randomizeFonts(rFmaxSize, rFminSize) {
    if (resume) {
      if (resumeSpans.length) {
        for (var i = 0, l = resumeSpans.length; i < l; i++) {
          var oldSpan = resumeSpans[i];
          oldSpan.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
          oldSpan.style.fontSize = Math.floor(Math.random() * rFmaxSize + rFminSize) + 'px';
        }
      } else {
        var str = resume.innerHTML;
        resume.innerHTML = '';
        for (var j = 0, k = str.length; j < k; j++) {
          var newSpan = document.createElement('span');
          newSpan.innerHTML = str[j];
          newSpan.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
          newSpan.style.fontSize = Math.floor(Math.random() * rFmaxSize + rFminSize) + 'px';
          resume.appendChild(newSpan);
        }
      }
    }
  }

  /**
   * Rotate logo
   * @param  {Event Object} e
   * @return {void}
   */
  function rotateLogo (e) {
    var h = e.pageX / window.innerWidth; // $document.width(),
    var v = e.pageY / window.innerHeight; // $document.height();
    // var transformRule = 'rotateX(' + (15 - (v * 30)) + 'deg) rotateY(' + (-20 + (h * 40)) + 'deg)';
    $logo.css({
      '-moz-transform': 'rotateX(' + (15 - (v * 30)) + 'deg) rotateY(' + (-20 + (h * 40)) + 'deg)',
      '-webkit-transform': 'rotateX(' + (7 - (v * 30)) + 'deg) rotateY(' + (-10 + (h * 40)) + 'deg)',
      '-o-transform': 'rotateX(' + (7 - (v * 14)) + 'deg) rotateY(' + (-10 + (h * 20)) + 'deg)',
      '-ms-transform': 'rotateX(' + (7 - (v * 14)) + 'deg) rotateY(' + (-10 + (h * 20)) + 'deg)',
      'transform': 'rotateX(' + (7 - (v * 14)) + 'deg) rotateY(' + (-10 + (h * 20)) + 'deg)'
    });
  }

  /**
   * Get distance utility function
   * @param  {int|float} x
   * @param  {int|float} y
   * @param  {int|float} x0
   * @param  {int|float} y0
   * @return {int|float}
   */
  function getDistance (x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
  }

  /**
   * Cast the logo shadow and make it follow the mouse movement
   * @return {void}
   */
  function castLogoShadow() {
    $('.squareK, .square6').each(function() { // maybe also shadow under .cG
      var $this = $(this),
        elOffset = $this.offset(),
        elLp = elOffset.left,
        elTp = elOffset.top,
        cX = elLp + (($this.width()) / 2),
        cY = elTp + (($this.height()) / 2),
        blurScalingFactor = 20, // change how blurred the shadow can be
        sizeScalingFactor = 80; // change how big the shadow can grow

      $window.mousemove(function(e) {
        var mX = e.pageX,
          mY = e.pageY;
        var distance = getDistance(mX, mY, cX, cY),
          v = (mY - cY) / 40, // change how far the shadow can go
          h = (mX - cX) / 40; // change how far the shadow can go
        if (mY < cY) {
          v = Math.abs(v);
        } //increment v
        if (mY > cY) {
          v = v * -1;
        } //decrement v
        if (mX < cX) {
          h = Math.abs(h);
        } //increment h
        if (mX > cX) {
          h = h * -1;
        } //decrement h
        var b = parseInt(distance / blurScalingFactor),
          s = parseInt(distance / sizeScalingFactor) + 'px ',
          shadowProperty = h + 'px ' + v + 'px ' + b + 'px ' + s + 'rgba(0,0,0,.7)'; // change the darkness of the shadow
        //textShadowProperty = h/5 + 'px ' + v/5 + 'px ' + b/5 + 'px ' + 'rgba(0,0,0,.5)';
        $this.css({
          'box-shadow': shadowProperty,
          '-moz-box-shadow': shadowProperty,
          '-o-box-shadow': shadowProperty,
          '-webkit-box-shadow': shadowProperty
        });
      });
    });
  }

  /**
   * Animate logo bars
   * @return {void}
   */
  function animateLogoBars () {
    $('.squareK-right, .squareK-left, .squareK-diagonal').each(function() {
      var $this = $(this);
      $this.slideUp()
        .slideDown()
        .hover(function() {
          $this.slideUp();
        }, function() {
          $this.slideDown();
        });
    });
    $('.squareK-top, .squareK-bottom').each(function() {
      var $this = $(this);
      $this
        .animate({ width: 'hide' }, 'fast')
        .animate({ width: 'show' }, 'slow')
        .hover(function() {
            $this.animate({ width: 'hide' });
          }, function() {
            $this.animate({ width: 'show' });
        });
    });
  }

  // on ready
  $document.ready(function () {

    // resize immediately
    _resize();

    $('.title').fitText();

    // on resize (debounced)
    $window.resize(debouncer(_resize));

    // not for mobiles
    if (!isMobile()) {
      animateLogoBars();
      castLogoShadow();
      $document.mousemove(rotateLogo);
    }
  });

})(window, document, jQuery);
