//////////////////////////////////////////
// library.js                           //
// Generic functions and web page setup //
// MIT License                          //
//////////////////////////////////////////

var library = {
   initialize: function() {
      $.fn.id =      library.ui.id;
      $.fn.enable =  library.ui.enable;
      $.fn.disable = library.ui.disable;
      $.fn.findAll = library.ui.findAll;
      library.social.setup();
      library.ui.setupForkMe();
      dna.registerInitializer(library.ui.normalize);
      function clickAndTap(callback) { return { click: callback, touchstart: callback }; }
      function onLoadSetup() {
         library.ui.displayAddr();
         library.ui.setupVideos();
         library.form.setup();
         library.bubbleHelp.setup();
         $(window.document)
            .on(clickAndTap(library.ui.revealSection), '.reveal-button')
            .on({ click: library.ui.popupClick },      '[data-href-popup]')
            .on({ click: library.popupImage.show },    '[data-popup-image], .popup-image');
         }
      $(onLoadSetup);
      if (typeof module === 'object')
         module.exports = library;  //Node.js module loading system (CommonJS)
      }
   };

library.ui = {
   id: function(value) {
      // Usage:
      //    var userElem = $('.user').id('J777');
      //    var userId = userElem.id();
      return value === undefined ? this.attr('id') : this.attr({ id: value });
      },
   enable: function(value) {
      // Usage:
      //    $('button').enable();
      return this.prop({ disabled: value !== undefined && !value });
      },
   disable: function(value) {
      // Usage:
      //    $('button').disable();
      return this.prop({ disabled: value === undefined || !!value });
      },
   findAll: function(selector) {
      // Usage:
      //    elem.findAll('img').fadeOut();
      return this.find(selector).addBack(selector);
      },
   makeIcons: function(holder) {
      function makeIcon(i, elem) { $(elem).addClass('fa-' + $(elem).data().icon); }
      function makeBrand(i, elem) { $(elem).addClass('fa-' + $(elem).data().brand); }
      holder.findAll('i[data-icon]').addClass('font-icon fas').each(makeIcon);
      holder.findAll('i[data-brand]').addClass('font-icon fab').each(makeBrand);
      return holder;
      },
   normalize: function(holder) {
      holder = holder || $(window.document);
      library.ui.makeIcons(holder);
      holder.find('button:not([type])').attr({ type: 'button' });
      holder.find('input:not([type])').attr({ type: 'text' });
      holder.find('input[type=email]').attr({ autocorrect: 'off', spellcheck: false });
      holder.find('a img, a i.font-icon').closest('a').addClass('image-link');
      if (!dna.browser.iOS())
         holder.find('a.external-site, .external-site a').attr({ target: '_blank' });
      return holder;
      },
   displayAddr: function() {
      // Usage:
      //    <p class=display-addr data-name=sales data-domain=ibm.com></p>
      function display(i, elem) {
         var data = $(elem).data();
         $(elem).html(data.name + '<span>' + String.fromCharCode(64) + data.domain + '</span>');
         }
      return $('.display-addr').each(display);
      },
   popup: function(url, options) {
      var settings = $.extend({ width: 600, height: 400 }, options);
      var dimensions = 'left=200,top=100,width=' + settings.width + ',height=' + settings.height;
      window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
      },
   popupClick: function(event) {
      // Usage (see popup() for default width and height):
      //    <button data-href-popup=../support data-width=300>Help</button>
      var data = $(event.target).data();
      library.ui.popup(data.hrefPopup, data);
      },
   revealSection: function(event) {
      // Usage (data-reveal optional):
      //    <div class=reveal-button data-reveal=more>More...</div>
      //    <div class=reveal-target data-reveal=more>Surprise!</div>
      var button = $(event.target).closest('.reveal-button');
      var findTarget = '.reveal-target[data-reveal=' + button.data().reveal + ']';
      var target = button.data().reveal ? $(findTarget) : button.next();
      dna.ui.slideFadeOut(button);
      dna.ui.slideFadeIn(target);
      },
   keepOnScreen: function(elem, padding) {  //must be position: absolute with top/left
      var gap = elem.offset().left;
      var moveR = Math.max(-gap, -padding) + padding;
      var moveL = Math.max(gap + elem.width() - $(window).width(), -padding) + padding;
      return elem.css({ left: '+=' + (moveR - moveL) + 'px' });
      },
   autoDisableButtons: function() {
      function disableButton(event) {
         if (!$(event.target).closest('nav,.no-disable').length)
            $(event.target).closest('button').disable();
         }
      function disableFormButton(event) {
         return $(event.target).find('button:not(.no-disable)').disable();
         }
      $(window.document)
         .on({ submit: disableFormButton }, 'form')
         .on({ click:  disableButton },     'button:not([type=submit],[data-href],[data-href-popup])');
      },
   loadImageFadeIn: function(elem, url, duration) {
      // Usage:
      //    library.ui.loadImageFadeIn($('img#banner'), 'https://example.com/elephants.jpg');
      function handleImg(event) {
         elem.fadeIn(duration || 1500);
         return elem[0].nodeName === 'IMG' ?
            elem.attr({ src: event.target.src }) :
            elem.css({ backgroundImage: 'url(' + event.target.src + ')' });
         }
      var img = new window.Image();
      img.onload = handleImg;
      img.src = url;
      return elem;
      },
   setupVideos: function() {
      // <figure class=video-container>
      //    <iframe src=https://www.youtube.com/embed/jMOZOI-UkNI></iframe>
      // </figure>
      function makeVideoClickable(i, elem) {
         elem = $(elem);
         var url = elem.find('iframe').attr('src');
         elem.attr('data-href', url.replace('//www.youtube.com/embed', '//youtu.be'));
         }
      $('figure.video-container-link').each(makeVideoClickable);
      $('figure.video-container iframe').attr('allowfullscreen', true);
      },
   setupForkMe: function() {
      function forkMeIcon(href) { return $('<i>', { 'data-brand': 'github', 'data-href': href }); }
      function addForkMeIcon(elem) { return elem.after(forkMeIcon(elem.attr('href'))); }
      addForkMeIcon($('#fork-me').removeAttr('id').wrap($('<div id=fork-me>'))).parent().show();
      }
   };

library.util = {
   cleanupEmail: function(email) {
      // Usage:
      //    library.util.cleanupEmail(' Lee@Example.Com ') === 'lee@exampe.com';
      //    library.util.cleanupEmail('bogus@example') === false;
      email = email && email.replace(/\s/g, '').toLowerCase();
      return /.+@.+[.].+/.test(email) ? email : false;  //rudimentary format check
      },
   toObj: function(string) {
      // Parse string into object
      return JSON.parse(string === undefined ? '{}' : string);
      },
   removeWhitespace: function(string) {
      // Usage:
      //    library.util.removeWhitespace('a b \t\n c') === 'abc';
      return string.replace(/\s/g, '');
      },
   details: function(thing) {
      var msg = typeof thing + ' --> ';
      function addProp(property) { msg += property + ':' + thing[property] + ' '; }
      function jQueryDetials(elem) {
         return elem.length === 0 ? '' : ' [#1' +
            ' elem:' +  elem.first()[0].nodeName +
            ' id:' +    elem.first().id() +
            ' class:' + elem.first().attr('class') +
            ' kids:' +  elem.first().children().length + ']';
         }
      if (thing && thing.jquery)
         msg += 'jquery:' + thing.jquery + ' elems:' + thing.length + jQueryDetials(thing);
      else if (thing === null)
         msg += '[null]';
      else if (typeof thing === 'object')
         Object.keys(thing).forEach(addProp);
      else
         msg += thing;
      return msg;
      },
   debug: function(thing) {
      console.log(Date.now() + ': ' + library.util.details(thing));
      }
   };

library.storage = {
   dbSave: function(key, obj) {
      // Usage:
      //    library.storage.dbSave('profile', { name: 'Lee', admin: true });
      window.localStorage[key] = JSON.stringify(obj);
      return library.storage.dbRead(key);
      },
   dbRead: function(key) {
      // Usage:
      //    var profile = library.storage.dbSave('profile');
      return library.util.toObj(window.localStorage[key]);
      },
   sessionSave: function(key, obj) {
      // Usage:
      //    library.storage.dbSave('editor-settings', { line: 42, mode: 'insert' });
      window.sessionStorage[key] = JSON.stringify(obj);
      return library.storage.sessionRead(key);
      },
   sessionRead: function(key) {
      // Usage:
      //    var editorSettings = library.storage.sessionSave('editor-settings');
      return library.util.toObj(window.sessionStorage[key]);
      }
   };

library.browser = {
   macOS: function() {
      return /Mac/.test(window.navigator.platform) && /Apple/.test(window.navigator.vendor);
      }
   };

library.popupImage = {
   // Usage (data-popup-image and data-popup-width are optional):
   //    <img src=thumb.png data-popup-image=full.jpg data-popup-width=300 alt=thumbnail>
   show: function(event) {
      var defaultPopupWidth = 800;
      var thumbnail = $(event.target).addClass('popup-image');
      thumbnail.parent().css({ position: 'relative' });
      thumbnail.next('.popup-image-layer').remove();
      function close() { thumbnail.next().fadeOut(); }
      var width = thumbnail.data().popupWidth || defaultPopupWidth;
      var maxWidth = Math.min(width, $(window).width() - 30) + 'px';
      var imageSrc = thumbnail.data().popupImage || thumbnail.attr('src');
      var popup = $('<div>').addClass('popup-image-layer').click(close)
         .append(library.ui.makeIcons($('<i data-icon=times>')))
         .append($('<img>').attr({ src: imageSrc }).css({ maxWidth: maxWidth }));
      popup.insertAfter(thumbnail);
      library.ui.keepOnScreen(popup, 30).fadeTo('slow', 1);
      }
   };

library.animate = {
   // Usage:
   //    library.animate.rollIn($('.diagram'));
   rollIn: function(holderOrElems) {
      var elems = holderOrElems.length === 1 ? holderOrElems.children() : holderOrElems;
      var startDelay = 300;
      var fadeDelay = 1500;
      var fadeIn = { opacity: 1, transition: 'opacity 5s' };
      function roll() {
         elems.first().css(fadeIn).delay(fadeDelay).queue(roll);
         elems = elems.slice(1);
         }
      elems.css({ opacity: 0 });
      window.setTimeout(roll, startDelay);
      }
   };

library.bubbleHelp = {
   // Usage:
   //    <div>Hover over me<span class=bubble-help>Help!</span></div>
   setup: function() {
      var wrapper;
      var wrapperHtml = '<span class=bubble-wrap></span>';
      var pointerHtml = '<span class=pointer>&#9660;</span>';
      function hi(event) {
         var hover = $(event.target)
            .closest('.bubble-help-hover');
         wrapper = hover.find('.bubble-wrap');
         if (wrapper.length === 0)
            wrapper = hover.find('.bubble-help')
               .wrap(wrapperHtml).parent().append(pointerHtml);
         wrapper.find('.bubble-help').show();
         wrapper.css({ top: -wrapper.height() }).hide().fadeIn();
         }
      function bye() {
         wrapper.fadeOut('slow');
         }
      $('.bubble-help').parent().addClass('bubble-help-hover')
         .hover(hi, bye);
      }
   };

library.form = {
   setup: function() {
      var attributes = { method: 'post', action: 'perfect.php' };
      $('form.perfect:not([action])').attr(attributes);  //bots are lazy
      }
   };

library.json = {
   prettyPrint: function(obj) {
      function replacer(match, pIndent, pKey, pVal, pEnd) {
         var key = '<span class=json-key>';
         var val = '<span class=json-value>';
         var str = '<span class=json-string>';
         var r = pIndent || '';
         if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
         if (pVal)
            r = r + (pVal[0] === '"' ? str : val) + pVal + '</span>';
         return r + (pEnd || '');
         }
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
         .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
         .replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(jsonLine, replacer);
      },
   printable: function(obj) {
      // Converts an object into a printable string (with spaces).
      // Example:
      //    console.assert(library.json.printable({a:3,b:'bat'}) === "{ a: 3, b: 'bat' }");
      return JSON.stringify(obj)
         .replace(/"([^"]*)":/g, ' $1: ')
         .replace(/}/g, ' }')
         .replace(/,([^ ])/g, ', $1')
         .replace(/"/g, "'");
      }
   };

// Social bookmarking
library.social = {
   // Usage:
   //    <div id=social-buttons></div>
   buttons: [
      { icon: 'google',      title: 'Google',   x: 480, y: 700, link: 'https://plus.google.com/share?url=${url}' },
      { icon: 'twitter',     title: 'Twitter',  x: 580, y: 350, link: 'https://twitter.com/share?text=${title}&url=${url}' },
      { icon: 'facebook-f',  title: 'Facebook', x: 580, y: 350, link: 'https://www.facebook.com/sharer.php?u=${url}' },
      { icon: 'linkedin-in', title: 'LinkedIn', x: 580, y: 350, link: 'https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}' },
      { icon: 'digg',        title: 'Digg',     x: 985, y: 700, link: 'https://digg.com/submit?url=${url}' },
      { icon: 'reddit',      title: 'Reddit',   x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}$title=${title}' }
      ],
   share: function(elem) {
      var button = library.social.buttons[elem.index()];
      function insert(str, find, value) { return str.replace(find, encodeURIComponent(value)); }
      var link = insert(button.link, '${url}', window.location.href);
      link = insert(link, '${title}', window.document.title);
      library.ui.popup(link, { width: button.x, height: button.y });
      },
   setup: function() {
      function initializeSocialButtons() {
         var container = $('#social-buttons');
         var html = '<span>';
         var iconHtml = ['<i data-brand=', ' data-click=library.social.share></i>'];  //click by dna.js
         function addHtml(button) { html += iconHtml[0] + button.icon + iconHtml[1]; }
         if (container.length)
            library.social.buttons.forEach(addHtml);
         container.fadeTo(0, 0.0).html(html + '</span>').fadeTo('slow', 1.0);
         }
      initializeSocialButtons();
      }
   };

// Google Tracking
library.gTags = {
   // Usage:
   //    <script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" async data-on-load=library.gTags.setup></script>
   setup: function(scriptTag) {
      var trackingID = $(scriptTag).attr('src').split('=')[1];
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', trackingID);
      }
   };

library.initialize();
