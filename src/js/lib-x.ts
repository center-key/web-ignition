//////////////////////////////////////////
// web-ignition - lib-x.js              //
// Generic functions and web page setup //
// MIT License                          //
//////////////////////////////////////////

import { dna, DnaCallback } from 'dna.js';

declare global {
   interface JQuery {
      id:      (name?: string | number) =>  JQuery | string | undefined,
      enable:  (setOn?: boolean) =>         JQuery,
      disable: (setOff?: boolean) =>        JQuery,
      findAll: (selector: string) =>        JQuery,
      forEach: (fn: LibXForEachCallback) => JQuery,
      }
   }
export type Json =       string | number | boolean | null | undefined | JsonObject | Json[];
export type JsonObject = { [key: string]: Json };
export type JsonData =   JsonObject | Json[];
export type LibXForEachCallback =        (elem: JQuery, index: number) => void;
export type LibXObject =                 { [key: string]: unknown };
export type LibXUiPopupSettings =        { width: number, height: number };
export type LibXUiPopupOptions =         Partial<LibXUiPopupSettings>;
export type LibXUiKeepOnScreenSettings = { padding: number };
export type LibXUiKeepOnScreenOptions =  Partial<LibXUiKeepOnScreenSettings>;
export type LibXCryptoHashSettings =     { algorithm: string, salt: string };
export type LibXCryptoHashOptions =      Partial<LibXCryptoHashSettings>;
export type LibXUiEnei =                 JQuery | HTMLElement | JQuery.EventBase | number;
export type LibXCounterMap =             { [counter: string]: number };
export type LibXSocialButton =           { title: string, icon: string, x: number, y: number, link: string };
export type LibXMontageLoopSettings = {
   container:  string | JQuery,  //selector for <img> elements holder  (default: '.montage-loop')
   start:      number | null,    //index of first image to show        (default: nulll for random)
   intervalMs: number,           //milliseconds between transitions    (default: 10,000)
   fadeMs:     number,           //milliseconds to complete transition (default: 3,000)
   };
export type LibXMontageLoopOptions = Partial<LibXMontageLoopSettings>;

const libXUi = {
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
      forEach: function(fn: LibXForEachCallback): JQuery {
         // Usage:
         //    const addRandomNumber = (elem) => elem.text(Math.random());
         //    elems.forEach(addRandomNumber).fadeIn();
         const elems = <JQuery><unknown>this;
         return elems.each((index, node) => fn($(node), index));
         },
      },
   toElem(elemOrNodeOrEventOrIndex: LibXUiEnei, that?: JQuery): JQuery {
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
      const makeIcon =  (elem: JQuery) => elem.addClass('fa-' + elem.data().icon);
      const makeBrand = (elem: JQuery) => elem.addClass('fa-' + elem.data().brand);
      holder['findAll']('i[data-icon]').addClass( 'font-icon fas').forEach(makeIcon);
      holder['findAll']('i[data-brand]').addClass('font-icon fab').forEach(makeBrand);
      return holder;
      },
   normalize(holder?: JQuery): JQuery {
      const elem = holder || $(document.body);
      libX.ui.makeIcons(elem);
      elem.find('button:not([type])').attr({ type: 'button' });
      elem.find('input:not([type])').attr({ type: 'text' });
      elem.find('input[type=email]').attr({ autocorrect: 'off', spellcheck: false });
      elem.find('a img, a i.font-icon').closest('a').addClass('image-link');
      if (!libX.browser.iOS())
         elem.find('a.external-site, .external-site a').attr({ target: '_blank' });
      return elem;
      },
   displayAddr(): JQuery {
      // Usage:
      //    <p class=display-addr data-name=sales data-domain=ibm.com></p>
      const elems = $('.display-addr');
      const display = (elem: JQuery) =>
         elem.html(elem.data().name + '<span>' + String.fromCharCode(64) + elem.data().domain + '</span>');
      return elems.forEach(display);
      },
   popup(url: string, options?: LibXUiPopupOptions): Window | null {
      const defaults = { width: 600, height: 400 };
      const settings = { ...defaults, ...options };
      const dimensions = 'left=200,top=100,width=' + settings.width + ',height=' + settings.height;
      return window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
      },
   popupClick(event: JQuery.EventBase): Window | null {
      // Usage (see popup() for default width and height):
      //    <button data-href-popup=../support data-width=300>Help</button>
      const data = $(event.target).data();
      return libX.ui.popup(data.hrefPopup, data);
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
   keepOnScreen(elem: JQuery, options?: LibXUiKeepOnScreenOptions): JQuery {
      // Moves element if it is off screen so that it becomes visible (element must be
      // position: absolute with top/left).
      // Usage:
      //    libX.ui.keepOnScreen($('#sidebar'), { padding: 30 });
      const defaults = { padding: 10 };
      const settings = { ...defaults, ...options };
      const pad = settings.padding;
      const win = {
         width:  <number>$(window).width(),
         height: <number>$(window).height(),
         scroll: <number>$(window).scrollTop(),
         };
      const offset = <JQuery.Coordinates>elem.offset();
      const moveR =  Math.max(-offset.left, -pad) + pad;
      const moveL =  Math.max(offset.left + <number>elem.width() - win.width, -pad) + pad;
      const moveU =  Math.min(win.scroll + win.height - offset.top - <number>elem.height() - pad, 0);
      const moveD =  Math.max(moveU, win.scroll - offset.top + pad);
      return elem.css({ left: `+=${moveR - moveL}px`, top: `+=${moveD}px` });
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
      //    libX.ui.loadImageFadeIn($('img#banner'), 'https://example.com/elephants.jpg');
      const handleImg = (event: JQuery.EventBase): JQuery => {
         elem.fadeIn(duration ?? 1500);
         return (<HTMLElement>elem[0]).nodeName === 'IMG' ?
            elem.attr({ src: event.target.src }) :
            elem.css({ backgroundImage: 'url(' + event.target.src + ')' });
         };
      const img = new Image();
      img.onload = <(this: GlobalEventHandlers, ev: Event) => JQuery><unknown>handleImg;
      img.src = url;
      return elem;
      },
   setupVideos(): JQuery {
      // <figure class=video-container>
      //    <iframe src=https://www.youtube.com/embed/jMOZOI-UkNI></iframe>
      // </figure>
      const makeVideoClickable = (elem: JQuery) => {
         const src = <string>elem.find('iframe').attr('src');
         const url = src.replace('//www.youtube.com/embed', '//youtu.be');
         elem.attr('data-href', url).addClass('external-site');
         };
      $('figure.video-container-link').forEach(makeVideoClickable);
      return $('figure.video-container iframe').attr({ allow: 'fullscreen' }).parent();
      },
   setupForkMe(): JQuery {
      // <a id=fork-me href=https://github.com/org/proj>Fork me on GitHub</a>
      const forkMe = $('#fork-me').removeAttr('id').wrap($('<div id=fork-me>'));
      const icon = $('<i>', { 'data-brand': 'github', 'data-href': forkMe.attr('href') });
      return forkMe.after(icon).parent().show().parent().addClass('forkable');
      },
   };

const libXUtil = {
   cleanupEmail(email: string): string | null {
      // Usage:
      //    libX.util.cleanupEmail(' Lee@Example.Com ') === 'lee@exampe.com';
      //    libX.util.cleanupEmail('bogus@example') === false;
      email = email && email.replace(/\s/g, '').toLowerCase();
      return /.+@.+[.].+/.test(email) ? email : null;  //rudimentary format check
      },
   isObj(thing: unknown): boolean {
      return !!thing && (<LibXObject>thing).constructor === Object;
      },
   removeWhitespace(text: string): string {
      // Usage:
      //    libX.util.removeWhitespace('a b \t\n c') === 'abc';
      return text.replace(/\s/g, '');
      },
   details(thing: unknown): string {
      const obj = <LibXObject>thing;
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
      console.log(Date.now() + ': ' + libX.util.details(thing));
      },
   };

const libXCrypto = {
   hash(message: string, options?: LibXCryptoHashOptions): Promise<string> {
      // Usage:
      //    libX.crypto.hash('password1').then(console.log);
      const defaults = { algorithm: 'SHA-256', salt: '' };
      const settings = { ...defaults, ...options };
      const byteArray =    new TextEncoder().encode(message + settings.salt);
      const toHex =        (byte: number) => byte.toString(16).padStart(2, '0').slice(-2);
      const handleDigest = (digest: ArrayBuffer): string =>
         Array.from(new Uint8Array(digest)).map(toHex).join('');
      return crypto.subtle.digest('SHA-256', byteArray).then(handleDigest);
      },
   };

const libXStorage = {
   dbSave(key: string, obj: LibXObject): LibXObject {
      // Usage:
      //    libX.storage.dbSave('profile', { name: 'Lee', admin: true });
      localStorage[key] = JSON.stringify(obj);
      return libX.storage.dbRead(key);
      },
   dbRead(key: string): LibXObject {
      // Usage:
      //    const profile = libX.storage.dbSave('profile');
      return window.localStorage[key] === undefined ? {} : JSON.parse(window.localStorage[key]);
      },
   sessionSave(key: string, obj: LibXObject): LibXObject {
      // Usage:
      //    libX.storage.dbSave('editor-settings', { line: 42, mode: 'insert' });
      window.sessionStorage[key] = JSON.stringify(obj);
      return libX.storage.sessionRead(key);
      },
   sessionRead(key: string): LibXObject {
      // Usage:
      //    const editorSettings = libX.storage.sessionSave('editor-settings');
      return window.sessionStorage[key] === undefined ? {} : JSON.parse(window.sessionStorage[key]);
      },
   };

const libXCounter = {
   key: 'counters',
   list(): LibXCounterMap {
      const counters = sessionStorage[libX.counter.key];
      return counters ? JSON.parse(counters) : {};
      },
   get(name = 'default'): number {
      const counters = <LibXCounterMap>libX.counter.list();
      return counters[name] || 0;
      },
   set(count = 0, name = 'default'): number {
      const counters = libX.counter.list();
      counters[name] = count;
      sessionStorage[libX.counter.key] = JSON.stringify(counters);
      return count;
      },
   reset(name = 'default'): number {
      return libX.counter.set(0, name);
      },
   increment(name = 'default'): number {
      return libX.counter.set(libX.counter.get(name) + 1, name);
      },
   };

const libXBrowser = {
   macOS(): boolean {
      const agent = window.navigator.userAgent;
      return /Macintosh/.test(agent) && /Mac OS X|macOS/i.test(agent);
      },
   iOS(): boolean {
      const iDevice = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
      return iDevice && /Apple/.test(window.navigator.vendor);
      },
   };

const libXPopupImage = {
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
         .append(libX.ui.makeIcons($('<i data-icon=times>')))
         .append($('<img>').attr({ src: imageSrc }).css({ maxWidth: maxWidth }));
      popup.insertAfter(thumbnail);
      libX.ui.keepOnScreen(popup, { padding: 30 }).fadeTo('slow', 1);
      $(document).on({ [keyUpEventName]: escKeyClose });
      },
   };

const libXAnimate = {
   jiggleIt(elemOrEvent: JQuery | JQuery.EventBase): JQuery {
      // Usage (3 ways):
      //    libX.animate.jiggleIt($('#logo'));
      //    $('#logo').click(jiggleIt);
      //    <img src=logo.svg data-click=libX.animate.jiggleIt alt=logo>
      const node = <HTMLElement>libX.ui.toElem(elemOrEvent)[0];
      node.style.animation = 'none';
      window.requestAnimationFrame(() => node.style.animation = 'jiggle-it 0.2s 3');
      return $(node);
      },
   rollIn(holderOrElems: JQuery): number {
      // Usage:
      //    libX.animate.rollIn($('.diagram'));
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
   montageLoop(optionsOrContainer?: LibXMontageLoopOptions | JQuery): JQuery {
      // <figure class=montage-loop>
      //    <img src=image1.jpg>
      //    <img src=image2.jpg>
      //    <img src=image3.jpg>
      // </figure>
      // Usage:
      //    libX.animate.montageLoop();
      // Usage with dna.js (default options):
      //    <figure class=montage-loop data-on-load=libX.animate.montageLoop>
      const options = optionsOrContainer instanceof $ ? { container: <JQuery>optionsOrContainer } : optionsOrContainer;
      const defaults = {
         container:  '.montage-loop',  //selector for <img> elements holder
         start:      null,             //random
         intervalMs: 10000,            //10 seconds between transitions
         fadeMs:     3000,             //3 seconds to complete transition
         };
      const settings =  { ...defaults, ...options };
      const container = typeof settings.container === 'string' ? $(settings.container) : settings.container;
      const imgs =      container.first().addClass('montage-loop').children('img');
      if (!imgs.length)
         console.error('[montage-loop] No images found:', settings.container);
      imgs.css({ transition: `all ${settings.fadeMs}ms` });
      imgs.eq(settings.start ?? Date.now() % imgs.length).addClass('current');
      const nextImage = () => {
         const previous = imgs.removeClass('previous').filter('.current').addClass('previous');
         const index =    (previous.index() + 1) % imgs.length;
         imgs.removeClass('current').eq(index).addClass('current');
         };
      window.setInterval(nextImage, settings.intervalMs);
      return imgs;
      },
   };

const libXBubbleHelp = {
   // Usage:
   //    <div>Hover over me<span class=bubble-help>Help!</span></div>
   // Usage with dna.js:
   //    dna.registerInitializer(libX.bubbleHelp.setup);
   setup(holder?: JQuery): JQuery {
      const uninitialized = '.bubble-help:not(.bubble-initialized)';
      const elems = (holder || $(window.document)).find(uninitialized).addBack(uninitialized);
      const wrapperHtml = '<span class=bubble-wrap></span>';
      const pointerHtml = '<span class=bubble-pointer>&#9660;</span>';
      const getHover = (event: JQuery.EventBase) => $(event.target).closest('.bubble-help-hover');
      const hi = (event: JQuery.EventBase) => {
         const help =    getHover(event).find('.bubble-help');
         const wrapIt =  () => help.wrap(wrapperHtml).parent().append(pointerHtml);
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

const libXForm = {
   perfect(): JQuery {
      const form =        $('form.perfect:not([action])');
      const version =     form.data() && form.data().version || '';
      const extra =       version + String.fromCharCode(46, 112) + 'hp';
      const attributes =  { method: 'post', action: 'perfect' + extra };
      const backupField = (): HTMLElement => <HTMLElement>$('<input type=hidden name=version>')[0];
      const field =       (): HTMLElement => form.find('[name=version]')[0] || backupField();
      const configure =   () => form.attr(attributes).append($(field()).val(version));
      return form.find('textarea').on({ focus: () => window.setTimeout(configure, 5000) });  //bot are lazy
      },
   };

// Social bookmarking
const libXSocial = {
   // Usage:
   //    <div id=social-buttons></div>
   buttons: <LibXSocialButton[]>[
      { title: 'Twitter',  icon: 'twitter',     x: 580, y: 350, link: 'https://twitter.com/share?text=${title}&url=${url}' },
      { title: 'Facebook', icon: 'facebook-f',  x: 580, y: 350, link: 'https://www.facebook.com/sharer.php?u=${url}' },
      { title: 'LinkedIn', icon: 'linkedin-in', x: 580, y: 350, link: 'https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}' },
      { title: 'Digg',     icon: 'digg',        x: 985, y: 700, link: 'https://digg.com/submit?url=${url}' },
      { title: 'Reddit',   icon: 'reddit',      x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}&title=${title}' },
      ],
   share(elem: JQuery): Window | null {
      const button = <LibXSocialButton>libX.social.buttons[elem.index()];
      const insert = (text: string, find: string, value: string): string =>
         text.replace(find, encodeURIComponent(value));
      const linkTemp = insert(button.link, '${url}',   window.location.href);
      const link =     insert(linkTemp,    '${title}', window.document.title);
      return libX.ui.popup(link, { width: button.x, height: button.y });
      },
   setup(): JQuery {
      const container = $('#social-buttons');
      const iconHtml = ['<i data-brand=', ' data-click=libX.social.share></i>'];  //click by dna.js
      let html = '<span>';
      const addHtml = (button: LibXSocialButton) => html += iconHtml[0] + button.icon + iconHtml[1];
      if (container.length)
         libX.social.buttons.forEach(addHtml);
      return container.fadeTo(0, 0.0).html(html + '</span>').fadeTo('slow', 1.0);
      },
   };

// Extras for 3rd party stuff
const libXExtra = {
   blogger(websiteUrl: string): JQuery {
      // Setup Blogger's Dynamic Views (sidebar)
      console.log('Setup for:', websiteUrl);
      const onArticleLoad = () => {
         console.log('Article: %c' + $('h1.entry-title').text().trim(), 'color: purple;');
         $('#header >.header-bar h3').attr('data-href', websiteUrl);
         libX.ui.normalize();
         window['hljsEnhance'].setup();
         };
      window.setTimeout(libX.ui.normalize, 2000);  //hack to workaround Blogger js errors
      return $(window['blogger'].ui()).on({ viewitem: onArticleLoad });
      },
   gTags(scriptTag: string): void {
      // Google Tracking
      // Usage:
      //    <script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" async data-on-load=libX.extra.gTags></script>
      const trackingID = (<string>$(scriptTag).attr('src')).split('=')[1];
      window['dataLayer'] = window['dataLayer'] || [];
      function gtag(...args: unknown[]) { window['dataLayer'].push(args); }
      gtag('js', new Date());
      gtag('config', trackingID);
      },
   };

const libX = {
   version:    '~~~version~~~',
   ui:         libXUi,
   util:       libXUtil,
   crypto:     libXCrypto,
   storage:    libXStorage,
   counter:    libXCounter,
   browser:    libXBrowser,
   popupImage: libXPopupImage,
   animate:    libXAnimate,
   bubbleHelp: libXBubbleHelp,
   form:       libXForm,
   social:     libXSocial,
   extra:      libXExtra,
   initialize(): void {
      globalThis['libX' + ''] = libX;
      $.fn.id =      libX.ui.plugin.id;
      $.fn.enable =  libX.ui.plugin.enable;
      $.fn.disable = libX.ui.plugin.disable;
      $.fn.findAll = libX.ui.plugin.findAll;
      $.fn.forEach = libX.ui.plugin.forEach;
      libX.social.setup();
      libX.ui.setupForkMe();
      dna.registerInitializer(<DnaCallback>libX.ui.normalize);
      const clickAndTap = (callback: (event: JQuery.EventBase) => void) =>
         ({ click: callback, touchstart: callback });
      const onLoadSetup = () => {
         libX.ui.displayAddr();
         libX.ui.setupVideos();
         libX.form.perfect();
         libX.bubbleHelp.setup();
         $(window.document)
            .on(clickAndTap(libX.ui.revealSection), '.reveal-button')
            .on({ click: libX.ui.popupClick },      '[data-href-popup]')
            .on({ click: libX.popupImage.show },    '[data-popup-image], .popup-image');
         };
      $(onLoadSetup);
      },
   };
libX.initialize();

export { libX };
