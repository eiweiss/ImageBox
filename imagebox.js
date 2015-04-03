/*
    jQuery ImageBox  - Crazy image gallery with included Slimbox
    Version: 0.1.4
    (c) 2014 Christian Weiss <http://monkeybiz.at>
    MIT-style license.
*/
(function ($, window, document, Math, undefined) {
  "use strict";
  var ver = '0.1.4';
  $('head').append(' <link rel="stylesheet" href="ImageBox/css/slimbox.css" type="text/css" media="all">');

  //Feature tests
  if (!$.cssHooks)
    throw (new Error('jQuery 1.4.3+ is needed for this plugin to work'));

  function doStyle(prop) {
    var vP, sP, cP = prop.charAt(0).toUpperCase() + prop.slice(1),
            prefix = ['Moz', 'Webkit', 'O', 'ms'], div = document.createElement('div');

    if (prop in div.style)
      sP = prop;
    else {
      for (var i = 0; i < prefix.length; i++) {
        vP = prefix[i] + cP;
        if (vP in div.style) {
          sP = vP;
          break;
        }
      }
    }
    div = null;
    $.support[prop] = sP;
    return sP;
  }

  var transform = doStyle("transform");

  if (transform && transform !== "transform") {
    $.cssHooks.transform = {
      get: function (elem, computed, extra) {
        return $.css(elem, transform);
      },
      set: function (elem, value) {
        elem.style[transform] = value;
      }
    };
  }
  var backfaceVisibility = doStyle("backfaceVisibility");

  if (backfaceVisibility && backfaceVisibility !== "backfaceVisibility") {
    $.cssHooks.backfaceVisibility = {
      get: function (elem, computed, extra) {
        return $.css(elem, backfaceVisibility);
      },
      set: function (elem, value) {
        elem.style[backfaceVisibility] = value;
      }
    };
  }

  $.fn.imagebox = function (options) {

    return this.each(function () {
      options = options || {};
      var $cont = $(this);
      var $el = $cont.children();
      var elArr = $el.get();

      if ($cont.css('position') == 'static')
        $cont.css('position', 'relative');

      //extend config
      var opts = $.extend({}, $.fn.imagebox.defaults, options || {});

      //create imageBox wrapper
      var $imageBox = $('<div />');
      var $imageBoxContainer = $('<div id="imageBox-container" />');

      $imageBox.css({
        position: 'absolute',
        border: opts.border,
        width: opts.width,
        height: opts.height,
        boxShadow: opts.boxShadow
      });

      var maxRowLen = Math.floor(parseInt($cont.width() / $imageBox.width()));
      var maxColLen = Math.ceil(elArr.length / maxRowLen);

      var n = 1, nLeft, nTop, rPM, mRot, nRpm = 0, bC = opts.boxChaos, mR = opts.maxRotate, nX = 0, nY = 0, elId, s, iBgallery = opts.iBgallery;

      $.each($el, function (i) {
        rPM = Math.cos(Math.PI * Math.round(Math.random()));
        nRpm = Math.floor(Math.random() * (bC)) * rPM;
        mRot = Math.floor(Math.random() * (mR)) * rPM;
        nLeft = parseInt(opts.width) * nX;
        nTop = parseInt(opts.height) * nY;

        if (nX < maxRowLen - n)
          nX++
        else
          nX = 0, nY += 1;

        $(elArr[i]).css('display', 'block');
        elId = 'imageBox-' + (i);
        $(this).wrap($imageBox.attr('id', elId));
        $(elArr[i]).attr('data-rot', mRot);

        $(this).parent().css({
          left: nLeft + nRpm,
          top: nTop + nRpm,
          zIndex: 90 + nRpm,
          transform: 'scale(1.0,1.0) rotate(' + mRot + 'deg)'
        });

        $(this).find('img').css({
          backfaceVisibility: 'hidden',
          transformOriginX: '0',
          transformOriginY: '0',
          perspective: 1000,
          transform: 'translateZ(0) scale(1.0, 1.0)',
          position: 'relative',
          maxWidth: '100%',
          display: 'block'
        });

        $(this).css({
          width: opts.width,
          height: opts.height
        });

        if (opts.slimbox)
          $(this).attr('rel', 'imageBox-' + iBgallery + '');

      });

      $imageBoxContainer.css({
        paddingTop: parseInt($imageBox.height() / 2),
        paddingBottom: parseInt($imageBox.height() / 2)
      })

      $cont.css({
        width: parseInt($imageBox.width() * maxRowLen),
        height: parseInt($imageBox.height() * maxColLen)

      }).wrap($imageBoxContainer);

      $el.hover(function () {
        s = opts.scale;
        $(this).parent().css({
          boxShadow: opts.boxShadowHover,
          zIndex: parseInt($(this)[0].parentNode.style.zIndex) + 1000,
          transition: 'all, .2s',
          transform: 'scale(' + s[0] + ',' + s[1] + ') rotate(0deg)'
        });
      }, function () {
        $(this).parent().css({
          boxShadow: opts.boxShadow,
          zIndex: parseInt($(this)[0].parentNode.style.zIndex) - 1000,
          transition: 'all, .1s',
          transform: 'scale(1,1) rotate(' + $(this).attr('data-rot') + 'deg)'
        });
      });

      if (jQuery().slimbox) {
        console.log("M'KAY")
        if (opts.slimbox)
          $.fn.imagebox.slimbox(opts.slimOptions);
      }
      else
        console.log('TROUBLE!!!');


    }); 
  }

  $.fn.imagebox.ver = function () { return ver; };

  $.fn.imagebox.defaults = {
    width: "50px",
    height: "75px",
    boxShadow: "0 0 10px rgba(0,0,0,.5)",
    boxShadowHover: "0 0 10px rgba(0,0,0,1)",
    border: 0,
    maxRotate: 10,
    scale: [1.1, 1.1],
    boxChaos: 20,
    slimbox: false,
    slimOptions: {
      loop: false,
      overlayOpacity: 0.8,
      overlayFadeDuration: 400,
      resizeDuration: 400,
      resizeEasing: "swing",
      initialWidth: 250,
      initialHeight: 250,
      imageFadeDuration: 400,
      captionAnimationDuration: 400,
      counterText: "Image {x} of {y}",
      closeKeys: [27, 88, 67],
      previousKeys: [37, 80],
      nextKeys: [39, 78]
    },
    iBgallery: ''
  }

  $.fn.imagebox.slimbox = function (obj) {
    var obj = obj || {};
    $('a[rel^="imageBox"]').slimbox({
      loop: obj.loop,
      overlayOpacity: obj.overlayOpacity,
      overlayFadeDuration: obj.overlayFadeDuration,
      resizeDuration: obj.resizeDuration,
      resizeEasing: obj.resizeEasing,
      initialWidth: obj.initialWidth,
      initialHeight: obj.initialHeight,
      imageFadeDuration: obj.imageFadeDuration,
      captionAnimationDuration: obj.captionAnimationDuration,
      counterText: obj.counterText,
      closeKeys: obj.closeKeys,
      previousKeys: obj.previousKeys,
      nextKeys: obj.nextKeys
    }, null, function (el) {
      return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
    });
  }

} (jQuery, window, document, Math));

/*!
	Slimbox v2.05 - The ultimate lightweight Lightbox clone for jQuery
	(c) 2007-2013 Christophe Beyls <http://www.digitalia.be>
	MIT-style license.
*/
(function($) {
	var win = $(window), options, images, activeImage = -1, activeURL, prevImage, nextImage, compatibleOverlay, middle, centerWidth, centerHeight,
		ie6 = !window.XMLHttpRequest, hiddenElements = [], documentElement = document.documentElement,
  	preload = {}, preloadPrev = new Image(), preloadNext = new Image(),
  	overlay, center, image, sizer, prevLink, nextLink, bottomContainer, bottom, caption, number;

	$(function() {
		$("body").append(
			$([
				overlay = $('<div id="lbOverlay" />').click(close)[0],
				center = $('<div id="lbCenter" />')[0],
				bottomContainer = $('<div id="lbBottomContainer" />')[0]
			]).css("display", "none")
		);

		image = $('<div id="lbImage" />').appendTo(center).append(
			sizer = $('<div style="position: relative;" />').append([
				prevLink = $('<a id="lbPrevLink" href="#" />').click(previous)[0],
				nextLink = $('<a id="lbNextLink" href="#" />').click(next)[0]
			])[0]
		)[0];

		bottom = $('<div id="lbBottom" />').appendTo(bottomContainer).append([
			$('<a id="lbCloseLink" href="#" />').click(close)[0],
			caption = $('<div id="lbCaption" />')[0],
			number = $('<div id="lbNumber" />')[0],
			$('<div style="clear: both;" />')[0]
		])[0];
	});

	// Open Slimbox with the specified parameters
	$.slimbox = function(_images, startImage, _options) {
		options = $.extend({
			loop: false,				// Allows to navigate between first and last images
			overlayOpacity: 0.8,			// 1 is opaque, 0 is completely transparent (change the color in the CSS file)
			overlayFadeDuration: 400,		// Duration of the overlay fade-in and fade-out animations (in milliseconds)
			resizeDuration: 400,			// Duration of each of the box resize animations (in milliseconds)
			resizeEasing: "swing",			// "swing" is jQuery's default easing
			initialWidth: 250,			// Initial width of the box (in pixels)
			initialHeight: 250,			// Initial height of the box (in pixels)
			imageFadeDuration: 400,			// Duration of the image fade-in animation (in milliseconds)
			captionAnimationDuration: 400,		// Duration of the caption animation (in milliseconds)
			counterText: "Image {x} of {y}",	// Translate or change as you wish, or set it to false to disable counter text for image groups
			closeKeys: [27, 88, 67],		// Array of keycodes to close Slimbox, default: Esc (27), 'x' (88), 'c' (67)
			previousKeys: [37, 80],			// Array of keycodes to navigate to the previous image, default: Left arrow (37), 'p' (80)
			nextKeys: [39, 78]			// Array of keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
		}, _options);

		// The function is called for a single image, with URL and Title as first two arguments
		if (typeof _images == "string") {
			_images = [[_images, startImage]];
			startImage = 0;
		}

		middle = win.scrollTop() + (win.height() / 2);
		centerWidth = options.initialWidth;
		centerHeight = options.initialHeight;
		$(center).css({top: Math.max(0, middle - (centerHeight / 2)), width: centerWidth, height: centerHeight, marginLeft: -centerWidth/2}).show();
		compatibleOverlay = ie6 || (overlay.currentStyle && (overlay.currentStyle.position != "fixed"));
		if (compatibleOverlay) overlay.style.position = "absolute";
		$(overlay).css("opacity", options.overlayOpacity).fadeIn(options.overlayFadeDuration);
		position();
		setup(1);

		images = _images;
		options.loop = options.loop && (images.length > 1);
		return changeImage(startImage);
	};

	/*
		options:	Optional options object, see jQuery.slimbox()
		linkMapper:	Optional function taking a link DOM element and an index as arguments and returning an array containing 2 elements:
				the image URL and the image caption (may contain HTML)
		linksFilter:	Optional function taking a link DOM element and an index as arguments and returning true if the element is part of
				the image collection that will be shown on click, false if not. "this" refers to the element that was clicked.
				This function must always return true when the DOM element argument is "this".
	*/
	$.fn.slimbox = function(_options, linkMapper, linksFilter) {
		linkMapper = linkMapper || function(el) {
			return [el.href, el.title];
		};

		linksFilter = linksFilter || function() {
			return true;
		};

		var links = this;

		return links.unbind("click").click(function() {
			// Build the list of images that will be displayed
			var link = this, startIndex = 0, filteredLinks, i = 0, length;
			filteredLinks = $.grep(links, function(el, i) {
				return linksFilter.call(link, el, i);
			});

			// We cannot use jQuery.map() because it flattens the returned array
			for (length = filteredLinks.length; i < length; ++i) {
				if (filteredLinks[i] == link) startIndex = i;
				filteredLinks[i] = linkMapper(filteredLinks[i], i);
			}

			return $.slimbox(filteredLinks, startIndex, _options);
		});
	};

	function position() {
		var l = win.scrollLeft(), w = win.width();
		$([center, bottomContainer]).css("left", l + (w / 2));
		if (compatibleOverlay) $(overlay).css({left: l, top: win.scrollTop(), width: w, height: win.height()});
	}

	function setup(open) {
		if (open) {
			$("object").add(ie6 ? "select" : "embed").each(function(index, el) {
				hiddenElements[index] = [el, el.style.visibility];
				el.style.visibility = "hidden";
			});
		} else {
			$.each(hiddenElements, function(index, el) {
				el[0].style.visibility = el[1];
			});
			hiddenElements = [];
		}
		var fn = open ? "bind" : "unbind";
		win[fn]("scroll resize", position);
		$(document)[fn]("keydown", keyDown);
	}

	function keyDown(event) {
		var code = event.which, fn = $.inArray;
		// Prevent default keyboard action (like navigating inside the page)
		return (fn(code, options.closeKeys) >= 0) ? close()
			: (fn(code, options.nextKeys) >= 0) ? next()
			: (fn(code, options.previousKeys) >= 0) ? previous()
			: null;
	}

	function previous() {
		return changeImage(prevImage);
	}

	function next() {
		return changeImage(nextImage);
	}

	function changeImage(imageIndex) {
		if (imageIndex >= 0) {
			activeImage = imageIndex;
			activeURL = images[activeImage][0];
			prevImage = (activeImage || (options.loop ? images.length : 0)) - 1;
			nextImage = ((activeImage + 1) % images.length) || (options.loop ? 0 : -1);

			stop();
			center.className = "lbLoading";

			preload = new Image();
			preload.onload = animateBox;
			preload.src = activeURL;
		}

		return false;
	}

	function animateBox() {
		center.className = "";
		$(image).css({backgroundImage: "url(" + activeURL + ")", visibility: "hidden", display: ""});
		$(sizer).width(preload.width);
		$([sizer, prevLink, nextLink]).height(preload.height);

		$(caption).html(images[activeImage][1] || "");
		$(number).html((((images.length > 1) && options.counterText) || "").replace(/{x}/, activeImage + 1).replace(/{y}/, images.length));

		if (prevImage >= 0) preloadPrev.src = images[prevImage][0];
		if (nextImage >= 0) preloadNext.src = images[nextImage][0];

		centerWidth = image.offsetWidth;
		centerHeight = image.offsetHeight;
		var top = Math.max(0, middle - (centerHeight / 2));
		if (center.offsetHeight != centerHeight) {
			$(center).animate({height: centerHeight, top: top}, options.resizeDuration, options.resizeEasing);
		}
		if (center.offsetWidth != centerWidth) {
			$(center).animate({width: centerWidth, marginLeft: -centerWidth/2}, options.resizeDuration, options.resizeEasing);
		}
		$(center).queue(function() {
			$(bottomContainer).css({width: centerWidth, top: top + centerHeight, marginLeft: -centerWidth/2, visibility: "hidden", display: ""});
			$(image).css({display: "none", visibility: "", opacity: ""}).fadeIn(options.imageFadeDuration, animateCaption);
		});
	}

	function animateCaption() {
		if (prevImage >= 0) $(prevLink).show();
		if (nextImage >= 0) $(nextLink).show();
		$(bottom).css("marginTop", -bottom.offsetHeight).animate({marginTop: 0}, options.captionAnimationDuration);
		bottomContainer.style.visibility = "";
	}

	function stop() {
		preload.onload = null;
		preload.src = preloadPrev.src = preloadNext.src = activeURL;
		$([center, image, bottom]).stop(true);
		$([prevLink, nextLink, image, bottomContainer]).hide();
	}

	function close() {
		if (activeImage >= 0) {
			stop();
			activeImage = prevImage = nextImage = -1;
			$(center).hide();
			$(overlay).stop().fadeOut(options.overlayFadeDuration, setup);
		}

		return false;
	}

})(jQuery);
