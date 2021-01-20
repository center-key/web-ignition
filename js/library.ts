//////////////////////////////////////////
// web-ignition - library.js            //
// Generic functions and web page setup //
// MIT License                          //
//////////////////////////////////////////

import { dna } from 'dna.js';

declare global {
   interface JQuery {
      id:      (name?: string | number) => JQuery,
      enable:  (setOn?: boolean) =>        JQuery,
      disable: (setOff?: boolean) =>       JQuery,
      findAll: (selector: string) =>       JQuery,
      }
   }
type LibraryObject =            Record<string, unknown>;
type LibraryUiPopupOptions =    { width?: number, height?: number };
type LibraryCryptoHashOptions = { algorithm?: string, salt?: string };
type LibraryUiEnei =            JQuery | HTMLElement | JQuery.EventBase | number;
type LibraryCounterMap =        Record<string, number>;
type LibrarySocialButton =      { title: string, icon: string, x: number, y: number, link: string };

const libraryUi = {
   plugin: {
      id: function(name?: string | number): string | undefined | JQuery {
         // Usage:
         //    const userElem = $('.user').id('J777');
         //    const userId = userElem.id();
         const elem = <JQuery><unknown>this;
         return name === undefined ? elem.attr('id') : elem.attr({ id: name });
         },
      enable: function(setOn?: boolean): JQuery {
         // Usage:
         //    $('button').enable();
         const elem = <JQuery><unknown>this;
         return elem.prop({ disabled: setOn !== undefined && !setOn });
         },
      disable: function(setOff?: boolean): JQuery {
         // Usage:
         //    $('button').disable();
         const elem = <JQuery><unknown>this;
         return elem.prop({ disabled: setOff === undefined || !!setOff });
         },
      findAll: function(selector: string): JQuery {
         // Usage:
         //    elem.findAll('img').fadeOut();
         const elem = <JQuery><unknown>this;
         return elem.find(selector).addBack(selector);
         },
      },
   toElem(elemOrNodeOrEventOrIndex: LibraryUiEnei, that?: JQuery): JQuery {
      // A flexible way to get the jQuery element whether it is passed in directly, is a DOM node,
      // is the target of an event, or comes from the jQuery context.
      const elem = elemOrNodeOrEventOrIndex instanceof $ && <JQuery>elemOrNodeOrEventOrIndex;
      const target = elemOrNodeOrEventOrIndex && (<JQuery.EventBase>elemOrNodeOrEventOrIndex).target;
      return elem || $(target || elemOrNodeOrEventOrIndex || that);
      },
   makeIcons(holder: JQuery): JQuery {
      // Usage:
      //    <i data-icon=home></i>
      // Usage with dna.js:
      //    <i data-attr-data-icon=~~icon~~></i>
      const makeIcon =  (node: HTMLElement) => $(node).addClass('fa-' + $(node).data().icon);
      const makeBrand = (node: HTMLElement) => $(node).addClass('fa-' + $(node).data().brand);
      holder['findAll']('i[data-icon]').addClass( 'font-icon fas').toArray().forEach(makeIcon);
      holder['findAll']('i[data-brand]').addClass('font-icon fab').toArray().forEach(makeBrand);
      return holder;
      },
   normalize(holder?: JQuery): JQuery {
      const elem = holder || $(document.body);
      library.ui.makeIcons(elem);
      elem.find('button:not([type])').attr({ type: 'button' });
      elem.find('input:not([type])').attr({ type: 'text' });
      elem.find('input[type=email]').attr({ autocorrect: 'off', spellcheck: false });
      elem.find('a img, a i.font-icon').closest('a').addClass('image-link');
      if (!library.browser.iOS())
         elem.find('a.external-site, .external-site a').attr({ target: '_blank' });
      return elem;
      },
   displayAddr(): JQuery {
      // Usage:
      //    <p class=display-addr data-name=sales data-domain=ibm.com></p>
      const elems = $('.display-addr');
      const display = (node: HTMLElement) => {
         const data = $(node).data();
         $(node).html(data.name + '<span>' + String.fromCharCode(64) + data.domain + '</span>');
         };
      elems.toArray().forEach(display);
      return elems;
      },
   popup(url: string, options?: LibraryUiPopupOptions): Window | null {
      const defaults = { width: 600, height: 400 };
      const settings = { ...defaults, ...options };
      const dimensions = 'left=200,top=100,width=' + settings.width + ',height=' + settings.height;
      return window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
      },
   popupClick(event: JQuery.EventBase): Window | null {
      // Usage (see popup() for default width and height):
      //    <button data-href-popup=../support data-width=300>Help</button>
      const data = $(event.target).data();
      return library.ui.popup(data.hrefPopup, data);
      },
   revealSection(event: JQuery.EventBase): JQuery {
      // Usage (data-reveal optional):
      //    <div class=reveal-button data-reveal=more>More...</div>
      //    <div class=reveal-target data-reveal=more>Surprise!</div>
      const button = $(event.target).closest('.reveal-button');
      const findTarget = '.reveal-target[data-reveal=' + button.data().reveal + ']';
      const target = button.data().reveal ? $(findTarget) : button.next();
      dna.ui.slideFadeOut(button);
      return dna.ui.slideFadeIn(target);
      },
   keepOnScreen(elem: JQuery, padding = 10): JQuery {  //must be position: absolute with top/left
      const gap = (<JQuery.Coordinates>elem.offset()).left;
      const moveR = Math.max(-gap, -padding) + padding;
      const moveL = Math.max(gap + <number>elem.width() - <number>$(window).width(), -padding) + padding;
      return elem.css({ left: '+=' + (moveR - moveL) + 'px' });
      },
   autoDisableButtons(): void {
      const disableButton = (event: JQuery.EventBase) => {
         const elem = $(event.target);
         if (!elem.closest('nav,.no-disable').length)
            elem.closest('button').disable();
         };
      const disableFormButton = (event: JQuery.EventBase): JQuery =>
         $(event.target).find('button:not(.no-disable)').disable();
      $(window.document)
         .on({ submit: disableFormButton }, 'form')
         .on({ click:  disableButton },     'button:not([type=submit],[data-href],[data-href-popup])');
      },
   loadImageFadeIn(elem: JQuery, url: string, duration?: number): JQuery {
      // Usage:
      //    library.ui.loadImageFadeIn($('img#banner'), 'https://example.com/elephants.jpg');
      const handleImg = (event: JQuery.EventBase): JQuery => {
         elem.fadeIn(duration || 1500);
         return (<HTMLElement>elem[0]).nodeName === 'IMG' ?
            elem.attr({ src: event.target.src }) :
            elem.css({ backgroundImage: 'url(' + event.target.src + ')' });
         };
      const img = new Image();
      img.onload = <any>handleImg;
      img.src = url;
      return elem;
      },
   setupVideos(): void {
      // <figure class=video-container>
      //    <iframe src=https://www.youtube.com/embed/jMOZOI-UkNI></iframe>
      // </figure>
      const makeVideoClickable = (node: HTMLElement) => {
         const elem = $(node);
         const url = <string>elem.find('iframe').attr('src');
         elem.attr('data-href', url.replace('//www.youtube.com/embed', '//youtu.be'));
         };
      $('figure.video-container-link').toArray().forEach(makeVideoClickable);
      $('figure.video-container iframe').attr({ allow: 'fullscreen' });
      },
   setupForkMe(): JQuery {
      // <a id=fork-me href=https://github.com/org/proj>Fork me on GitHub</a>
      const forkMe = $('#fork-me').removeAttr('id').wrap($('<div id=fork-me>'));
      const icon = $('<i>', { 'data-brand': 'github', 'data-href': forkMe.attr('href') });
      return forkMe.after(icon).parent().show().parent().addClass('forkable');
      },
   };

const libraryUtil = {
   cleanupEmail(email: string): string | null {
      // Usage:
      //    library.util.cleanupEmail(' Lee@Example.Com ') === 'lee@exampe.com';
      //    library.util.cleanupEmail('bogus@example') === false;
      email = email && email.replace(/\s/g, '').toLowerCase();
      return /.+@.+[.].+/.test(email) ? email : null;  //rudimentary format check
      },
   isObj(thing: unknown): boolean {
      return !!thing && (<LibraryObject>thing).constructor === Object;
      },
   removeWhitespace(text: string): string {
      // Usage:
      //    library.util.removeWhitespace('a b \t\n c') === 'abc';
      return text.replace(/\s/g, '');
      },
   details(thing: unknown): string {
      const obj = <Record<string, unknown>>thing;
      const elem = <JQuery>thing;
      let msg = typeof thing + ' --> ';
      const addProp = (property: string) => { msg += property + ':' + obj[property] + ' '; };
      const jQueryDetials = (elem: JQuery): string =>
         elem.length === 0 ? '' : ' [#1' +
            ' elem:' +  (<HTMLElement>elem.first()[0]).nodeName +
            ' id:' +    elem.first().id() +
            ' class:' + elem.first().attr('class') +
            ' kids:' +  elem.first().children().length + ']';
      if (thing instanceof $)
         msg += 'jquery:' + elem.jquery + ' elems:' + elem.length + jQueryDetials(elem);
      else if (thing === null)
         msg += '[null]';
      else if (typeof thing === 'object')
         Object.keys(obj).forEach(addProp);
      else
         msg += thing;
      return msg;
      },
   debug(thing: unknown): void {
      console.log(Date.now() + ': ' + library.util.details(thing));
      },
   };

const libraryCrypto = {
   hash(message: string, options?: LibraryCryptoHashOptions): Promise<string> {
      // Usage:
      //    library.crypto.hash('password1').then(console.log);
      const defaults = { algorithm: 'SHA-256', salt: '' };
      const settings = { ...defaults, ...options };
      const byteArray =    new TextEncoder().encode(message + settings.salt);
      const toHex =        (byte: number) => byte.toString(16).padStart(2, '0').slice(-2);
      const handleDigest = (digest: ArrayBuffer): string =>
         Array.from(new Uint8Array(digest)).map(toHex).join('');
      return crypto.subtle.digest('SHA-256', byteArray).then(handleDigest);
      },
   };

const libraryStorage = {
   dbSave(key: string, obj: Record<string, unknown>): LibraryObject {
      // Usage:
      //    library.storage.dbSave('profile', { name: 'Lee', admin: true });
      localStorage[key] = JSON.stringify(obj);
      return library.storage.dbRead(key);
      },
   dbRead(key: string): LibraryObject {
      // Usage:
      //    const profile = library.storage.dbSave('profile');
      return window.localStorage[key] === undefined ? {} : JSON.parse(window.localStorage[key]);
      },
   sessionSave(key: string, obj: LibraryObject): LibraryObject {
      // Usage:
      //    library.storage.dbSave('editor-settings', { line: 42, mode: 'insert' });
      window.sessionStorage[key] = JSON.stringify(obj);
      return library.storage.sessionRead(key);
      },
   sessionRead(key: string): LibraryObject {
      // Usage:
      //    const editorSettings = library.storage.sessionSave('editor-settings');
      return window.sessionStorage[key] === undefined ? {} : JSON.parse(window.sessionStorage[key]);
      },
   };

const libraryCounter = {
   key: 'counters',
   list(): LibraryCounterMap {
      const counters = sessionStorage[library.counter.key];
      return counters ? JSON.parse(counters) : {};
      },
   get(name = 'default'): number {
      const counters = <LibraryCounterMap>library.counter.list();
      return counters[name] || 0;
      },
   set(count = 0, name = 'default'): number {
      const counters = library.counter.list();
      counters[name] = count;
      sessionStorage[library.counter.key] = JSON.stringify(counters);
      return count;
      },
   reset(name = 'default'): number {
      return library.counter.set(0, name);
      },
   increment(name = 'default'): number {
      return library.counter.set(library.counter.get(name) + 1, name);
      },
   };

const libraryBrowser = {
   macOS(): boolean {
      return /Mac/.test(window.navigator.platform) && /Apple/.test(window.navigator.vendor);
      },
   iOS(): boolean {
      const iDevice = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
      return iDevice && /Apple/.test(window.navigator.vendor);
      },
   };

const libraryPopupImage = {
   // Usage (data-popup-image and data-popup-width are optional):
   //    <img src=thumb.png data-popup-image=full.jpg data-popup-width=300 alt=thumbnail>
   show(event: JQuery.EventBase): void {
      const defaultPopupWidth = 1000;
      const thumbnail = $(event.target).addClass('popup-image');
      thumbnail.parent().css({ position: 'relative' });
      thumbnail.next('.popup-image-layer').remove();
      const keyUpEventName = 'keyup.' + String(Date.now());
      const close = () => {
         $(window.document).off(keyUpEventName);
         thumbnail.next().fadeOut();
         };
      const escKeyClose = (event: JQuery.EventBase) => event.key === 'Escape' && close();
      const width = thumbnail.data().popupWidth || defaultPopupWidth;
      const maxWidth = Math.min(width, <number>$(window).width() - 30) + 'px';
      const imageSrc = thumbnail.data().popupImage || thumbnail.attr('src');
      const popup = $('<div>').addClass('popup-image-layer').on({ click: close })
         .append(library.ui.makeIcons($('<i data-icon=times>')))
         .append($('<img>').attr({ src: imageSrc }).css({ maxWidth: maxWidth }));
      popup.insertAfter(thumbnail);
      library.ui.keepOnScreen(popup, 30).fadeTo('slow', 1);
      $(document).on({ [keyUpEventName]: escKeyClose });
      },
   };

const libraryAnimate = {
   jiggleIt(elemOrEvent: JQuery | JQuery.EventBase): JQuery {
      // Usage (3 ways):
      //    library.animate.jiggleIt($('#logo'));
      //    $('#logo').click(jiggleIt);
      //    <img src=logo.svg data-click=library.animate.jiggleIt alt=logo>
      const node = <HTMLElement>library.ui.toElem(elemOrEvent)[0];
      node.style.animation = 'none';
      window.requestAnimationFrame(() => node.style.animation = 'jiggle-it 0.2s 3');
      return $(node);
      },
   rollIn(holderOrElems: JQuery): number {
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
      return window.setTimeout(roll, startDelay);
      },
   };

const libraryBubbleHelp = {
   // Usage:
   //    <div>Hover over me<span class=bubble-help>Help!</span></div>
   // Usage with dna.js:
   //    dna.registerInitializer(library.bubbleHelp.setup);
   setup(holder?: JQuery): JQuery {
      const uninitialized = '.bubble-help:not(.bubble-initialized)';
      const elems = (holder || $(window.document)).find(uninitialized).addBack(uninitialized);
      const wrapperHtml = '<span class=bubble-wrap></span>';
      const pointerHtml = '<span class=bubble-pointer>&#9660;</span>';
      const getHover = (event: JQuery.EventBase) => $(event.target).closest('.bubble-help-hover');
      const hi = (event: JQuery.EventBase) => {
         const help = getHover(event).find('.bubble-help');
         const wrapIt = () => help.wrap(wrapperHtml).parent().append(pointerHtml);
         const wrapper = help.parent().hasClass('bubble-wrap') ? help.parent() : wrapIt();
         wrapper.find('.bubble-help').show();
         wrapper.css({ top: -<number>wrapper.height() }).stop(true).hide().fadeIn();
         };
      const bye = (event: JQuery.EventBase) => getHover(event).find('.bubble-wrap').fadeOut('slow');
      const hoverEvents = { mouseenter: hi, mouseleave: bye, touchstart: hi, touchend: bye };
      elems.parent().addClass('bubble-help-hover').on(hoverEvents);
      return elems.addClass('bubble-initialized');
      },
   };

const libraryForm = {
   perfect(): JQuery {
      const form = $('form.perfect:not([action])');
      const version = form.data() && form.data().version || '';
      const extra = version + String.fromCharCode(46, 112) + 'hp';
      const attributes = { method: 'post', action: 'perfect' + extra };
      const field = (): HTMLElement => form.find('[name=version]')[0] || <HTMLElement>$('<input type=hidden name=version>')[0];
      const configure = () => form.attr(attributes).append($(field()).val(version));
      return form.find('textarea').on({ focus: () => window.setTimeout(configure, 5000) });  //bot are lazy
      },
   };

// Social bookmarking
const librarySocial = {
   // Usage:
   //    <div id=social-buttons></div>
   buttons: <LibrarySocialButton[]>[
      { title: 'Twitter',  icon: 'twitter',     x: 580, y: 350, link: 'https://twitter.com/share?text=${title}&url=${url}' },
      { title: 'Facebook', icon: 'facebook-f',  x: 580, y: 350, link: 'https://www.facebook.com/sharer.php?u=${url}' },
      { title: 'LinkedIn', icon: 'linkedin-in', x: 580, y: 350, link: 'https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}' },
      { title: 'Digg',     icon: 'digg',        x: 985, y: 700, link: 'https://digg.com/submit?url=${url}' },
      { title: 'Reddit',   icon: 'reddit',      x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}$title=${title}' },
      ],
   share(elem: JQuery): Window | null {
      const button = <LibrarySocialButton>library.social.buttons[elem.index()];
      const insert = (text: string, find: string, value: string): string => text.replace(find, encodeURIComponent(value));
      const linkTemp = insert(button.link, '${url}',   window.location.href);
      const link =     insert(linkTemp,    '${title}', window.document.title);
      return library.ui.popup(link, { width: button.x, height: button.y });
      },
   setup(): JQuery {
      const container = $('#social-buttons');
      const iconHtml = ['<i data-brand=', ' data-click=library.social.share></i>'];  //click by dna.js
      let html = '<span>';
      const addHtml = (button: LibrarySocialButton) => html += iconHtml[0] + button.icon + iconHtml[1];
      if (container.length)
         library.social.buttons.forEach(addHtml);
      return container.fadeTo(0, 0.0).html(html + '</span>').fadeTo('slow', 1.0);
      },
   };

// Extras for 3rd party stuff
const libraryExtra = {
   blogger(websiteUrl: string): JQuery {
      // Setup Blogger's Dynamic Views (sidebar)
      const onArticleLoad = () => {
         console.log('Article: %c' + $('h1.entry-title').text().trim(), 'color: purple;');
         $('#header >.header-bar h3').attr('data-href', websiteUrl);
         library.ui.normalize();
         window['hljsEnhance'].setup();
         };
      return $(window['blogger'].ui()).on({ viewitem: onArticleLoad });
      },
   gTags(scriptTag: string): void {
      // Google Tracking
      // Usage:
      //    <script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" async data-on-load=library.extra.gTags></script>
      const trackingID = (<string>$(scriptTag).attr('src')).split('=')[1];
      window['dataLayer'] = window['dataLayer'] || [];
      function gtag(...args: unknown[]) { window['dataLayer'].push(args); }
      gtag('js', new Date());
      gtag('config', trackingID);
      },
   };

const library = {
   version:    '[VERSION]',
   ui:         libraryUi,
   util:       libraryUtil,
   crypto:     libraryCrypto,
   storage:    libraryStorage,
   counter:    libraryCounter,
   browser:    libraryBrowser,
   popupImage: libraryPopupImage,
   animate:    libraryAnimate,
   bubbleHelp: libraryBubbleHelp,
   form:       libraryForm,
   social:     librarySocial,
   extra:      libraryExtra,
   initialize(): void {
      globalThis['library' + ''] = library;
      $.fn.id =      <any>library.ui.plugin.id;
      $.fn.enable =  library.ui.plugin.enable;
      $.fn.disable = library.ui.plugin.disable;
      $.fn.findAll = library.ui.plugin.findAll;
      library.social.setup();
      library.ui.setupForkMe();
      dna.registerInitializer(<any>library.ui.normalize);
      const clickAndTap = (callback: (event: JQuery.EventBase) => void) => ({ click: callback, touchstart: callback });
      const onLoadSetup = () => {
         library.ui.displayAddr();
         library.ui.setupVideos();
         library.form.perfect();
         library.bubbleHelp.setup();
         $(window.document)
            .on(clickAndTap(library.ui.revealSection), '.reveal-button')
            .on({ click: library.ui.popupClick },      '[data-href-popup]')
            .on({ click: library.popupImage.show },    '[data-popup-image], .popup-image');
         };
      $(onLoadSetup);
      },
   };
library.initialize();

export { library };
