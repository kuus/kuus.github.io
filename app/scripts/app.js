/* global TweenLite */
/* jshint devel:true */

/*! @license credits */

(function (window, document) {
  'use strict';

  var api = {};
  var resume = document.getElementById('resume');
  var resumeSpans = resume ? resume.getElementsByTagName('span') : [];
  var fonts = ['"Georgia, serif"', '"Palatino Linotype", "Book Antiqua", Palatino, serif', '"Times New Roman", Times, serif ', 'Arial, Helvetica, sans-serif', '"Arial Black", Gadget, sans-serif', '"Comic Sans MS", cursive, sans-serif', 'Impact, Charcoal, sans-serif', '"Lucida Sans Unicode", "Lucida Grande", sans-serif', 'Tahoma, Geneva, sans-serif', '"Trebuchet MS", Helvetica, sans-serif', 'Verdana, Geneva, sans-serif', '"Courier New", Courier, monospace', '"Lucida Console", Monaco, monospace' ];

  /**
   * Add event listener
   * @link(http://youmightnotneedjquery.com/, source)
   * @param {[type]} el        [description]
   * @param {[type]} eventName [description]
   * @param {[type]} handler   [description]
   */
  api.addEventListener = function (el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, function(){
        handler.call(el);
      });
    }
  };


  /**
   * On document ready
   * @link(http://youmightnotneedjquery.com/, source)
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */
  api.documentReady = function (fn) {
    if (document.readyState !== 'loading'){
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState !== 'loading') {
          fn();
        }
      });
    }
  };

  /**
   * Is Mobile
   * @return {Boolean}
   */
  api.isMobile = function () {
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
    TweenLite.fromTo(resume, { opacity: 0 }, { opacity: 0.2 });
    // TweenLite.set(resume, { opacity: 0.2 });
    // TweenMax.staggerFromTo(resumeSpans, 0.5, { opacity: 0.0 }, { opacity: 1 }, 0.05);
    // TweenMax.staggerFrom(resumeSpans, 1, { fontSize: 0 }, 0.02);
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
        setTimeout(function () {
          for (var i = 0, l = resumeSpans.length; i < l; i++) {
            var oldSpan = resumeSpans[i];
            oldSpan.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
            oldSpan.style.fontSize = Math.floor(Math.random() * rFmaxSize + rFminSize) + 'px';
          }
        }, 1);
      } else {
        var str = resume.innerHTML;
        var docfrag = document.createDocumentFragment();
        resume.innerHTML = '';
        for (var j = 0, k = str.length; j < k; j++) {
          var newSpan = document.createElement('span');
          newSpan.innerHTML = str[j];
          newSpan.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
          newSpan.style.fontSize = Math.floor(Math.random() * rFmaxSize + rFminSize) + 'px';
          // TweenMax.to(newSpan, 1, { fontSize: Math.floor(Math.random() * rFmaxSize + rFminSize) });
          docfrag.appendChild(newSpan);
        }
        resume.appendChild(docfrag);
      }
    }
  }

  /**
   * Update copyright year
   */
  function updateCopyrightYear() {
    var el = document.getElementById('copy-year');
    if (el) {
      el.innerHTML = new Date().getFullYear();
    }
  }

  // on ready
  api.documentReady(function () {

    window.fitText(document.getElementsByClassName('title'));

    updateCopyrightYear();

    _resize();

    api.addEventListener(window, 'resize', function () {
      _resize();
      // debouncer(_resize);
    });
  });

  // export
  window.k6 = api;

})(window, document);
