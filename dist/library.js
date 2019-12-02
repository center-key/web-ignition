//! library.js ~ web-ignition v1.1.9 ~ github.com/center-key/web-ignition ~ MIT License

const library = {
   version: '1.1.9',
   initialize: () => {
      $.fn.id =      library.ui.id;
      $.fn.enable =  library.ui.enable;
      $.fn.disable = library.ui.disable;
      $.fn.findAll = library.ui.findAll;
      library.social.setup();
      library.ui.setupForkMe();
      dna.registerInitializer(library.ui.normalize);
      const clickAndTap = callback => ({ click: callback, touchstart: callback });
      const onLoadSetup = () => {
         library.ui.displayAddr();
         library.ui.setupVideos();
         library.form.setup();
         library.bubbleHelp.setup();
         $(window.document)
            .on(clickAndTap(library.ui.revealSection), '.reveal-button')
            .on({ click: library.ui.popupClick },      '[data-href-popup]')
            .on({ click: library.popupImage.show },    '[data-popup-image], .popup-image');
         };
      $(onLoadSetup);
      }
   };

library.ui = {
   id: function(value) {
      // Usage:
      //    const userElem = $('.user').id('J777');
      //    const userId = userElem.id();
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
   toElem: (elemOrNodeOrEventOrIndex, that) => {
      // A flexible way to get the jQuery element whether it is passed in directly, is a DOM node,
      // is the target of an event, or comes from the jQuery context.
      const elem = elemOrNodeOrEventOrIndex instanceof $ && elemOrNodeOrEventOrIndex;
      const target = elemOrNodeOrEventOrIndex && elemOrNodeOrEventOrIndex.target;
      return elem || $(target || elemOrNodeOrEventOrIndex || that);
      },
   makeIcons: (holder) => {
      const makeIcon =  (i, elem) => $(elem).addClass('fa-' + $(elem).data().icon);
      const makeBrand = (i, elem) => $(elem).addClass('fa-' + $(elem).data().brand);
      holder.findAll('i[data-icon]').addClass( 'font-icon fas').each(makeIcon);
      holder.findAll('i[data-brand]').addClass('font-icon fab').each(makeBrand);
      return holder;
      },
   normalize: (holder) => {
      holder = holder || $(window.document);
      library.ui.makeIcons(holder);
      holder.find('button:not([type])').attr({ type: 'button' });
      holder.find('input:not([type])').attr({ type: 'text' });
      holder.find('input[type=email]').attr({ autocorrect: 'off', spellcheck: false });
      holder.find('a img, a i.font-icon').closest('a').addClass('image-link');
      if (!library.browser.iOS())
         holder.find('a.external-site, .external-site a').attr({ target: '_blank' });
      return holder;
      },
   displayAddr: () => {
      // Usage:
      //    <p class=display-addr data-name=sales data-domain=ibm.com></p>
      const display = (i, elem) => {
         const data = $(elem).data();
         $(elem).html(data.name + '<span>' + String.fromCharCode(64) + data.domain + '</span>');
         };
      return $('.display-addr').each(display);
      },
   popup: (url, options) => {
      const settings = Object.assign({ width: 600, height: 400 }, options);
      const dimensions = 'left=200,top=100,width=' + settings.width + ',height=' + settings.height;
      window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
      },
   popupClick: (event) => {
      // Usage (see popup() for default width and height):
      //    <button data-href-popup=../support data-width=300>Help</button>
      const data = $(event.target).data();
      library.ui.popup(data.hrefPopup, data);
      },
   revealSection: (event) => {
      // Usage (data-reveal optional):
      //    <div class=reveal-button data-reveal=more>More...</div>
      //    <div class=reveal-target data-reveal=more>Surprise!</div>
      const button = $(event.target).closest('.reveal-button');
      const findTarget = '.reveal-target[data-reveal=' + button.data().reveal + ']';
      const target = button.data().reveal ? $(findTarget) : button.next();
      dna.ui.slideFadeOut(button);
      dna.ui.slideFadeIn(target);
      },
   keepOnScreen: (elem, padding) => {  //must be position: absolute with top/left
      const gap = elem.offset().left;
      const moveR = Math.max(-gap, -padding) + padding;
      const moveL = Math.max(gap + elem.width() - $(window).width(), -padding) + padding;
      return elem.css({ left: '+=' + (moveR - moveL) + 'px' });
      },
   autoDisableButtons: () => {
      const disableButton = (event) => {
         if (!$(event.target).closest('nav,.no-disable').length)
            $(event.target).closest('button').disable();
         };
      const disableFormButton = (event) => {
         return $(event.target).find('button:not(.no-disable)').disable();
         };
      $(window.document)
         .on({ submit: disableFormButton }, 'form')
         .on({ click:  disableButton },     'button:not([type=submit],[data-href],[data-href-popup])');
      },
   loadImageFadeIn: (elem, url, duration) => {
      // Usage:
      //    library.ui.loadImageFadeIn($('img#banner'), 'https://example.com/elephants.jpg');
      const handleImg = (event) => {
         elem.fadeIn(duration || 1500);
         return elem[0].nodeName === 'IMG' ?
            elem.attr({ src: event.target.src }) :
            elem.css({ backgroundImage: 'url(' + event.target.src + ')' });
         };
      const img = new window.Image();
      img.onload = handleImg;
      img.src = url;
      return elem;
      },
   setupVideos: () => {
      // <figure class=video-container>
      //    <iframe src=https://www.youtube.com/embed/jMOZOI-UkNI></iframe>
      // </figure>
      const makeVideoClickable = (i, elem) => {
         elem = $(elem);
         const url = elem.find('iframe').attr('src');
         elem.attr('data-href', url.replace('//www.youtube.com/embed', '//youtu.be'));
         };
      $('figure.video-container-link').each(makeVideoClickable);
      $('figure.video-container iframe').attr('allowfullscreen', true);
      },
   setupForkMe: () => {
      // <a id=fork-me href=https://github.com/org/proj>Fork me on GitHub</a>
      const makeIcon = (href) => $('<i>', { 'data-brand': 'github', 'data-href': href });
      const forkMe = $('#fork-me').removeAttr('id').wrap($('<div id=fork-me>'));
      forkMe.after(makeIcon(forkMe.attr('href'))).parent().show().parent().addClass('forkable');
      }
   };

library.util = {
   cleanupEmail: (email) => {
      // Usage:
      //    library.util.cleanupEmail(' Lee@Example.Com ') === 'lee@exampe.com';
      //    library.util.cleanupEmail('bogus@example') === false;
      email = email && email.replace(/\s/g, '').toLowerCase();
      return /.+@.+[.].+/.test(email) ? email : false;  //rudimentary format check
      },
   toObj: (string) => {
      // Parse string into object
      return JSON.parse(string === undefined ? '{}' : string);
      },
   removeWhitespace: (string) => {
      // Usage:
      //    library.util.removeWhitespace('a b \t\n c') === 'abc';
      return string.replace(/\s/g, '');
      },
   details: (thing) => {
      let msg = typeof thing + ' --> ';
      const addProp = property => { msg += property + ':' + thing[property] + ' '; };
      const jQueryDetials = (elem) =>
         elem.length === 0 ? '' : ' [#1' +
            ' elem:' +  elem.first()[0].nodeName +
            ' id:' +    elem.first().id() +
            ' class:' + elem.first().attr('class') +
            ' kids:' +  elem.first().children().length + ']';
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
   debug: (thing) => console.log(Date.now() + ': ' + library.util.details(thing))
   };

library.storage = {
   dbSave: (key, obj) => {
      // Usage:
      //    library.storage.dbSave('profile', { name: 'Lee', admin: true });
      window.localStorage[key] = JSON.stringify(obj);
      return library.storage.dbRead(key);
      },
   dbRead: (key) => {
      // Usage:
      //    const profile = library.storage.dbSave('profile');
      return library.util.toObj(window.localStorage[key]);
      },
   sessionSave: (key, obj) => {
      // Usage:
      //    library.storage.dbSave('editor-settings', { line: 42, mode: 'insert' });
      window.sessionStorage[key] = JSON.stringify(obj);
      return library.storage.sessionRead(key);
      },
   sessionRead: (key) => {
      // Usage:
      //    const editorSettings = library.storage.sessionSave('editor-settings');
      return library.util.toObj(window.sessionStorage[key]);
      }
   };

library.counter = {
   key: 'counters',
   list: () => {
      const counters = sessionStorage[library.counter.key];
      return counters ? JSON.parse(counters) : {};
      },
   get: (name = 'default') => {
      const counters = library.counter.list();
      return counters[name] ? counters[name] : 0;
      },
   set: (count = 0, name = 'default') => {
      const counters = library.counter.list();
      counters[name] = count;
      sessionStorage[library.counter.key] = JSON.stringify(counters);
      return count;
      },
   reset: (name = 'default') => {
      return library.counter.set(0, name);
      },
   increment: (name = 'default') => {
      return library.counter.set(library.counter.get(name) + 1, name);
      }
   };

library.browser = {
   macOS: () => /Mac/.test(window.navigator.platform) && /Apple/.test(window.navigator.vendor),
   iOS: () => /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
      /Apple/.test(window.navigator.vendor)
   };

library.popupImage = {
   // Usage (data-popup-image and data-popup-width are optional):
   //    <img src=thumb.png data-popup-image=full.jpg data-popup-width=300 alt=thumbnail>
   show: (event) => {
      const defaultPopupWidth = 1000;
      const thumbnail = $(event.target).addClass('popup-image');
      thumbnail.parent().css({ position: 'relative' });
      thumbnail.next('.popup-image-layer').remove();
      const keyUpEventName = 'keyup.' + Date.now();
      const close = () => {
         $(window.document).off(keyUpEventName);
         thumbnail.next().fadeOut();
         };
      const escKeyClose = (event) => event.key === 'Escape' && close();
      const width = thumbnail.data().popupWidth || defaultPopupWidth;
      const maxWidth = Math.min(width, $(window).width() - 30) + 'px';
      const imageSrc = thumbnail.data().popupImage || thumbnail.attr('src');
      const popup = $('<div>').addClass('popup-image-layer').on({ click: close })
         .append(library.ui.makeIcons($('<i data-icon=times>')))
         .append($('<img>').attr({ src: imageSrc }).css({ maxWidth: maxWidth }));
      popup.insertAfter(thumbnail);
      library.ui.keepOnScreen(popup, 30).fadeTo('slow', 1);
      $(window.document).on(keyUpEventName, escKeyClose);
      }
   };

library.animate = {
   jiggleIt: (elemOrEvent) => {
      // Usage (3 ways):
      //    library.animate.jiggleIt($('#logo'));
      //    $('#logo').click(jiggleIt);
      //    <img src=logo.svg data-click=library.animate.jiggleIt alt=logo>
      const node = library.ui.toElem(elemOrEvent)[0];
      node.style.animation = 'none';
      window.requestAnimationFrame(() => node.style.animation = 'jiggle-it 0.2s 3');
      },
   rollIn: (holderOrElems) => {
      // Usage:
      //    library.animate.rollIn($('.diagram'));
      let elems = holderOrElems.length === 1 ? holderOrElems.children() : holderOrElems;
      const startDelay = 300;
      const fadeDelay = 1500;
      const fadeIn = { opacity: 1, transition: 'opacity 5s' };
      const roll = () => {
         elems.first().css(fadeIn).delay(fadeDelay).queue(roll);
         elems = elems.slice(1);
         };
      elems.css({ opacity: 0 });
      window.setTimeout(roll, startDelay);
      }
   };

library.bubbleHelp = {
   // Usage:
   //    <div>Hover over me<span class=bubble-help>Help!</span></div>
   setup: () => {
      let wrapper;
      const wrapperHtml = '<span class=bubble-wrap></span>';
      const pointerHtml = '<span class=pointer>&#9660;</span>';
      const hi = (event) => {
         const hover = $(event.target).closest('.bubble-help-hover');
         wrapper = hover.find('.bubble-wrap');
         if (wrapper.length === 0)
            wrapper = hover.find('.bubble-help').wrap(wrapperHtml).parent().append(pointerHtml);
         wrapper.find('.bubble-help').show();
         wrapper.css({ top: -wrapper.height() }).hide().fadeIn();
         };
      const bye = () => wrapper.fadeOut('slow');
      const hoverEvents = { mouseenter: hi, mouseleave: bye, touchstart: hi, touchend: bye };
      $('.bubble-help').parent().addClass('bubble-help-hover').on(hoverEvents);
      }
   };

library.form = {
   setup: () => {
      const attributes = { method: 'post', action: 'perfect.php' };
      $('form.perfect:not([action])').attr(attributes);  //bots are lazy
      }
   };

library.social = {
   // Usage:
   //    <div id=social-buttons></div>
   buttons: [
      { title: 'Twitter',  icon: 'twitter',     x: 580, y: 350, link: 'https://twitter.com/share?text=${title}&url=${url}' },
      { title: 'Facebook', icon: 'facebook-f',  x: 580, y: 350, link: 'https://www.facebook.com/sharer.php?u=${url}' },
      { title: 'LinkedIn', icon: 'linkedin-in', x: 580, y: 350, link: 'https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}' },
      { title: 'Digg',     icon: 'digg',        x: 985, y: 700, link: 'https://digg.com/submit?url=${url}' },
      { title: 'Reddit',   icon: 'reddit',      x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}$title=${title}' }
      ],
   share: (elem) => {
      const button = library.social.buttons[elem.index()];
      const insert = (str, find, value) => str.replace(find, encodeURIComponent(value));
      const linkTemp = insert(button.link, '${url}',   window.location.href);
      const link =     insert(linkTemp,    '${title}', window.document.title);
      library.ui.popup(link, { width: button.x, height: button.y });
      },
   setup: () => {
      const container = $('#social-buttons');
      const iconHtml = ['<i data-brand=', ' data-click=library.social.share></i>'];  //click by dna.js
      let html = '<span>';
      const addHtml = button => { html += iconHtml[0] + button.icon + iconHtml[1]; };
      if (container.length)
         library.social.buttons.forEach(addHtml);
      container.fadeTo(0, 0.0).html(html + '</span>').fadeTo('slow', 1.0);
      }
   };

library.extra = {
   blogger: (websiteUrl) => {
      // Setup Blogger's Dynamic Views (sidebar)
      const onArticleLoad = () => {
         console.log('Article: %c' + $('h1.entry-title').text().trim(), 'color: purple;');
         $('#header >.header-bar h3').attr('data-href', websiteUrl);
         library.ui.normalize();
         window.hljsEnhance.setup();
         };
      $(window.blogger.ui()).on({ viewitem: onArticleLoad });
      },
   gTags: (scriptTag) => {
      // Google Tracking
      // Usage:
      //    <script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" async data-on-load=library.extra.gTags></script>
      const trackingID = $(scriptTag).attr('src').split('=')[1];
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', trackingID);
      }
   };

if (typeof module === 'object')
   module.exports = library;  //node module loading system (CommonJS)
if (typeof window === 'object')
   window.library = library;  //support both global and window property
library.initialize();
