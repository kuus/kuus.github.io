/* global k6, TweenLite, TimelineLite */
/* jshint devel:true */

/*! @license credits */
// Not sure if I need jQuery or not

(function (window, document, api) {

  // Constants
  var NAMESPACE = 'logo';
  var ID_K = NAMESPACE + '-k-';
  var ID_6 = NAMESPACE + '-6-';
  var lSpacing= 10;

  // Dom
  var logo = document.getElementById(NAMESPACE);
  var lK = document.getElementById(NAMESPACE + '-k');
  var lKedges = document.getElementsByClassName(ID_K + 'edge');
  var lKbg = document.getElementById(ID_K + 'bg');
  var lKtop = document.getElementById(ID_K + 't');
  var lKright = document.getElementById(ID_K + 'r');
  var lKbottom = document.getElementById(ID_K + 'b');
  var lKleft = document.getElementById(ID_K + 'l');
  var lKdiagonal = document.getElementById(ID_K + 'd');
  // var l6 = document.getElementById(NAMESPACE + '-6');
  var l6bg = document.getElementById(ID_6 + 'bg');
  var l6top = document.getElementById(ID_6 + 't');
  var l6right = document.getElementById(ID_6 + 'r');
  var l6bottom = document.getElementById(ID_6 + 'b');
  var l6left = document.getElementById(ID_6 + 'l');
  // var lKletter = document.getElementById(ID_K + 'lett');
  // var l6letter = document.getElementById(ID_6 + 'lett');

  /**
   * Init 3d
   *
   */
  function init3d () {
    TweenLite.set(lK, { css: { transformPerspective: 400, perspective: 400, transformStyle: 'preserve-3d' } });
    TweenLite.set('.' + NAMESPACE + '-svg', { visibility: 'visible' });
  }

  /**
   * Reset K word
   *
   */
  function resetK () {
    lKtop.style.top = 0;
    lKtop.style.left = 0;
    lKright.style.top = 0;
    lKright.style.right = 0;
    lKbottom.style.bottom = 0;
    lKbottom.style.left = 0;
    lKleft.style.left = 0;
    lKleft.style.top = 0;
    for (var i = 0, l = lKedges.length; i < l; i++) {
      lKedges[i].style.opacity = 0;
    }
  }

  /**
   * Get k timeline
   *
   */
  function getKtimeline() {
    var tl = new TimelineLite();
    tl
      .set(lK, { overflow : 'hidden' })
      .set(lKright, { opacity: 1 })
      .fromTo(lKright, 0.3, { scaleY: 0, transformOrigin: 'center bottom' }, { scaleY: 1 })
      .set(lKtop, { opacity: 1 })
      .fromTo(lKtop, 0.275, { scaleX: 0, transformOrigin: 'right center' }, { scaleX: 1 })
      .set(lKleft, { opacity: 1 })
      .fromTo(lKleft, 0.25, { scaleY: 0, transformOrigin: 'center top' }, { scaleY: 1 })
      .set(lKbottom, { opacity: 1 })
      .fromTo(lKbottom, 0.2, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1 })
      .set(lK, { overflow : 'visible' })
      .to(lKtop, 0.2, { top: lSpacing + '%' })
      .to(lKleft, 0.2, { left: lSpacing + '%' })
      .to(lKright, 0.2, { top: lSpacing + '%' })
      .to(lKbottom, 0.2, { left: lSpacing + '%' })
      .set(lKdiagonal, { opacity: 1 })
      .fromTo(lKdiagonal, 0.4, { height: '0%' }, { height: '141.4%' })
      .fromTo(lKbg, 0.2, { scaleX: 0 }, { scaleX: 1 })
      .fromTo(l6bg, 0.2, { scaleY: 0 }, { scaleY: 1 });
      // .fromTo(lKletter, 1, { drawSVG: 0 }, { drawSVG: '100%' })
      // .fromTo(lKletter, 0.3, { fill: 'transparent' }, { fill: '#000' })
      // .fromTo(l6letter, 1, { drawSVG: 0 }, { drawSVG: '100%' })
      // .fromTo(l6letter, 0.3, { fill: 'transparent' }, { fill: '#53493F' });
      // .fromTo(logo, 0.4, { fontSize: 0 }, { fontSize: lFontSizePx + 'px' })
    return tl;
  }

  /**
   * Get 6 timeline
   */
  function get6timeline () {
    var tl = new TimelineLite();
    tl
      .fromTo(l6top, 0.4, { width: '0%' }, { width: '100%' })
      .fromTo(l6right, 0.4, { height: '0%' }, { height: '100%' })
      .fromTo(l6bottom, 0.4, { width: '0%' }, { width: '100%' })
      .fromTo(l6left, 0.4, { height: '0%' }, { height: '100%' });
    return tl;
  }

  /**
   * Get master timeline
   *
   */
  function getMasterTimeline () {
    var tl = new TimelineLite();
    tl.add(getKtimeline(), 0.3);
    tl.add(get6timeline(), 1.2);
    return tl;
  }

  /**
   * Rotation
   */
  function rotation (e) {
    var h = e.pageX / window.innerWidth;
    var v = e.pageY / window.innerHeight;
    var xRotation = 7 - (v * 30);
    var yRotation = -10 + (h * 40);
    TweenLite.to(logo, 0.4, { rotationX: xRotation, rotationY: yRotation });
  }

  /**
   * Shadow
   *
   */
  function shadow () {
    var getDistance = function (x, y, x0, y0) {
      return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    };
    var el = this;
    var rect = el.getBoundingClientRect();
    var elOffset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
    var elLp = elOffset.left;
    var elTp = elOffset.top;
    var cX = elLp + ((this.offsetWidth) / 2);
    var cY = elTp + ((this.offsetHeight) / 2);
    var blurScalingFactor = 20; // change how blurred the shadow can be
    var sizeScalingFactor = 80; // change how big the shadow can grow
    var shadowColor = 'rgba(0,0,0,.3)';

    api.addEventListener(window, 'mousemove', function(e) {
      var mX = e.pageX;
      var mY = e.pageY;
      var distance = getDistance(mX, mY, cX, cY);
      var v = (mY - cY) / 40; // change how far the shadow can go
      var h = (mX - cX) / 40; // change how far the shadow can go
      if (mY < cY) {
        v = Math.abs(v);
      } // increment v
      if (mY > cY) {
        v = v * -1;
      } // decrement v
      if (mX < cX) {
        h = Math.abs(h);
      } // increment h
      if (mX > cX) {
        h = h * -1;
      } // decrement h
      var b = parseInt(distance / blurScalingFactor),
        s = parseInt(distance / sizeScalingFactor) + 'px ',
        shadowProperty = h + 'px ' + v + 'px ' + b + 'px ' + s + shadowColor;
      // textShadowProperty = h/5 + 'px ' + v/5 + 'px ' + b/5 + 'px ' + 'rgba(0,0,0,.5)';
      TweenLite.to(el, 0.4, { css: { boxShadow: shadowProperty } });
    });
  }

  /**
   * Shadower
   *
   */
  function shadower () {
    shadow.apply(lKbg);
    shadow.apply(l6bg);
  }

  /**
   * Bind Interaction
   *
   */
  function bindInteraction () {
    var tl = getMasterTimeline();

    // // for codepen
    // document.getElementById('btn').onclick = function () {
    //   resetK();
    //   getMasterTimeline();
    // }

    logo.onmouseover = function () {
      tl.reverse();
    };
    logo.onmouseleave = function () {
      tl.play();
    };
  }

  /**
   * Init
   *
   */
  function init () {
    init3d();
    resetK();
    shadower();
    api.addEventListener(window, 'mousemove', rotation);
    getMasterTimeline();
    bindInteraction();
  }

  // on ready
  api.documentReady(function () {

    // not for mobiles
    if (!api.isMobile()) {
      init();
    }
  });

})(window, document, k6);
