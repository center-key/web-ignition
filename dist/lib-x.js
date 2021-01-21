//! lib-x.js ~ web-ignition v1.4.1 ~ github.com/center-key/web-ignition ~ MIT License

const libXUi = {
    plugin: {
        id: function (name) {
            const elem = this;
            return name === undefined ? elem.attr('id') : elem.attr({ id: name });
        },
        enable: function (setOn) {
            const elem = this;
            return elem.prop({ disabled: setOn !== undefined && !setOn });
        },
        disable: function (setOff) {
            const elem = this;
            return elem.prop({ disabled: setOff === undefined || !!setOff });
        },
        findAll: function (selector) {
            const elem = this;
            return elem.find(selector).addBack(selector);
        },
    },
    toElem(elemOrNodeOrEventOrIndex, that) {
        const elem = elemOrNodeOrEventOrIndex instanceof $ && elemOrNodeOrEventOrIndex;
        const target = elemOrNodeOrEventOrIndex && elemOrNodeOrEventOrIndex.target;
        return elem || $(target || elemOrNodeOrEventOrIndex || that);
    },
    makeIcons(holder) {
        const makeIcon = (node) => $(node).addClass('fa-' + $(node).data().icon);
        const makeBrand = (node) => $(node).addClass('fa-' + $(node).data().brand);
        holder['findAll']('i[data-icon]').addClass('font-icon fas').toArray().forEach(makeIcon);
        holder['findAll']('i[data-brand]').addClass('font-icon fab').toArray().forEach(makeBrand);
        return holder;
    },
    normalize(holder) {
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
    displayAddr() {
        const elems = $('.display-addr');
        const display = (node) => {
            const data = $(node).data();
            $(node).html(data.name + '<span>' + String.fromCharCode(64) + data.domain + '</span>');
        };
        elems.toArray().forEach(display);
        return elems;
    },
    popup(url, options) {
        const defaults = { width: 600, height: 400 };
        const settings = { ...defaults, ...options };
        const dimensions = 'left=200,top=100,width=' + settings.width + ',height=' + settings.height;
        return window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
    },
    popupClick(event) {
        const data = $(event.target).data();
        return libX.ui.popup(data.hrefPopup, data);
    },
    revealSection(event) {
        const button = $(event.target).closest('.reveal-button');
        const findTarget = '.reveal-target[data-reveal=' + button.data().reveal + ']';
        const target = button.data().reveal ? $(findTarget) : button.next();
        dna.ui.slideFadeOut(button);
        return dna.ui.slideFadeIn(target);
    },
    keepOnScreen(elem, padding = 10) {
        const gap = elem.offset().left;
        const moveR = Math.max(-gap, -padding) + padding;
        const moveL = Math.max(gap + elem.width() - $(window).width(), -padding) + padding;
        return elem.css({ left: '+=' + (moveR - moveL) + 'px' });
    },
    autoDisableButtons() {
        const disableButton = (event) => {
            const elem = $(event.target);
            if (!elem.closest('nav,.no-disable').length)
                elem.closest('button').disable();
        };
        const disableFormButton = (event) => $(event.target).find('button:not(.no-disable)').disable();
        $(window.document)
            .on({ submit: disableFormButton }, 'form')
            .on({ click: disableButton }, 'button:not([type=submit],[data-href],[data-href-popup])');
    },
    loadImageFadeIn(elem, url, duration) {
        const handleImg = (event) => {
            elem.fadeIn(duration || 1500);
            return elem[0].nodeName === 'IMG' ?
                elem.attr({ src: event.target.src }) :
                elem.css({ backgroundImage: 'url(' + event.target.src + ')' });
        };
        const img = new Image();
        img.onload = handleImg;
        img.src = url;
        return elem;
    },
    setupVideos() {
        const makeVideoClickable = (node) => {
            const elem = $(node);
            const url = elem.find('iframe').attr('src');
            elem.attr('data-href', url.replace('//www.youtube.com/embed', '//youtu.be'));
        };
        $('figure.video-container-link').toArray().forEach(makeVideoClickable);
        $('figure.video-container iframe').attr({ allow: 'fullscreen' });
    },
    setupForkMe() {
        const forkMe = $('#fork-me').removeAttr('id').wrap($('<div id=fork-me>'));
        const icon = $('<i>', { 'data-brand': 'github', 'data-href': forkMe.attr('href') });
        return forkMe.after(icon).parent().show().parent().addClass('forkable');
    },
};
const libXUtil = {
    cleanupEmail(email) {
        email = email && email.replace(/\s/g, '').toLowerCase();
        return /.+@.+[.].+/.test(email) ? email : null;
    },
    isObj(thing) {
        return !!thing && thing.constructor === Object;
    },
    removeWhitespace(text) {
        return text.replace(/\s/g, '');
    },
    details(thing) {
        const obj = thing;
        const elem = thing;
        let msg = typeof thing + ' --> ';
        const addProp = (property) => { msg += property + ':' + obj[property] + ' '; };
        const jQueryDetials = (elem) => elem.length === 0 ? '' : ' [#1' +
            ' elem:' + elem.first()[0].nodeName +
            ' id:' + elem.first().id() +
            ' class:' + elem.first().attr('class') +
            ' kids:' + elem.first().children().length + ']';
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
    debug(thing) {
        console.log(Date.now() + ': ' + libX.util.details(thing));
    },
};
const libXCrypto = {
    hash(message, options) {
        const defaults = { algorithm: 'SHA-256', salt: '' };
        const settings = { ...defaults, ...options };
        const byteArray = new TextEncoder().encode(message + settings.salt);
        const toHex = (byte) => byte.toString(16).padStart(2, '0').slice(-2);
        const handleDigest = (digest) => Array.from(new Uint8Array(digest)).map(toHex).join('');
        return crypto.subtle.digest('SHA-256', byteArray).then(handleDigest);
    },
};
const libXStorage = {
    dbSave(key, obj) {
        localStorage[key] = JSON.stringify(obj);
        return libX.storage.dbRead(key);
    },
    dbRead(key) {
        return window.localStorage[key] === undefined ? {} : JSON.parse(window.localStorage[key]);
    },
    sessionSave(key, obj) {
        window.sessionStorage[key] = JSON.stringify(obj);
        return libX.storage.sessionRead(key);
    },
    sessionRead(key) {
        return window.sessionStorage[key] === undefined ? {} : JSON.parse(window.sessionStorage[key]);
    },
};
const libXCounter = {
    key: 'counters',
    list() {
        const counters = sessionStorage[libX.counter.key];
        return counters ? JSON.parse(counters) : {};
    },
    get(name = 'default') {
        const counters = libX.counter.list();
        return counters[name] || 0;
    },
    set(count = 0, name = 'default') {
        const counters = libX.counter.list();
        counters[name] = count;
        sessionStorage[libX.counter.key] = JSON.stringify(counters);
        return count;
    },
    reset(name = 'default') {
        return libX.counter.set(0, name);
    },
    increment(name = 'default') {
        return libX.counter.set(libX.counter.get(name) + 1, name);
    },
};
const libXBrowser = {
    macOS() {
        return /Mac/.test(window.navigator.platform) && /Apple/.test(window.navigator.vendor);
    },
    iOS() {
        const iDevice = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
        return iDevice && /Apple/.test(window.navigator.vendor);
    },
};
const libXPopupImage = {
    show(event) {
        const defaultPopupWidth = 1000;
        const thumbnail = $(event.target).addClass('popup-image');
        thumbnail.parent().css({ position: 'relative' });
        thumbnail.next('.popup-image-layer').remove();
        const keyUpEventName = 'keyup.' + String(Date.now());
        const close = () => {
            $(window.document).off(keyUpEventName);
            thumbnail.next().fadeOut();
        };
        const escKeyClose = (event) => event.key === 'Escape' && close();
        const width = thumbnail.data().popupWidth || defaultPopupWidth;
        const maxWidth = Math.min(width, $(window).width() - 30) + 'px';
        const imageSrc = thumbnail.data().popupImage || thumbnail.attr('src');
        const popup = $('<div>').addClass('popup-image-layer').on({ click: close })
            .append(libX.ui.makeIcons($('<i data-icon=times>')))
            .append($('<img>').attr({ src: imageSrc }).css({ maxWidth: maxWidth }));
        popup.insertAfter(thumbnail);
        libX.ui.keepOnScreen(popup, 30).fadeTo('slow', 1);
        $(document).on({ [keyUpEventName]: escKeyClose });
    },
};
const libXAnimate = {
    jiggleIt(elemOrEvent) {
        const node = libX.ui.toElem(elemOrEvent)[0];
        node.style.animation = 'none';
        window.requestAnimationFrame(() => node.style.animation = 'jiggle-it 0.2s 3');
        return $(node);
    },
    rollIn(holderOrElems) {
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
const libXBubbleHelp = {
    setup(holder) {
        const uninitialized = '.bubble-help:not(.bubble-initialized)';
        const elems = (holder || $(window.document)).find(uninitialized).addBack(uninitialized);
        const wrapperHtml = '<span class=bubble-wrap></span>';
        const pointerHtml = '<span class=bubble-pointer>&#9660;</span>';
        const getHover = (event) => $(event.target).closest('.bubble-help-hover');
        const hi = (event) => {
            const help = getHover(event).find('.bubble-help');
            const wrapIt = () => help.wrap(wrapperHtml).parent().append(pointerHtml);
            const wrapper = help.parent().hasClass('bubble-wrap') ? help.parent() : wrapIt();
            wrapper.find('.bubble-help').show();
            wrapper.css({ top: -wrapper.height() }).stop(true).hide().fadeIn();
        };
        const bye = (event) => getHover(event).find('.bubble-wrap').fadeOut('slow');
        const hoverEvents = { mouseenter: hi, mouseleave: bye, touchstart: hi, touchend: bye };
        elems.parent().addClass('bubble-help-hover').on(hoverEvents);
        return elems.addClass('bubble-initialized');
    },
};
const libXForm = {
    perfect() {
        const form = $('form.perfect:not([action])');
        const version = form.data() && form.data().version || '';
        const extra = version + String.fromCharCode(46, 112) + 'hp';
        const attributes = { method: 'post', action: 'perfect' + extra };
        const backupField = () => $('<input type=hidden name=version>')[0];
        const field = () => form.find('[name=version]')[0] || backupField();
        const configure = () => form.attr(attributes).append($(field()).val(version));
        return form.find('textarea').on({ focus: () => window.setTimeout(configure, 5000) });
    },
};
const libXSocial = {
    buttons: [
        { title: 'Twitter', icon: 'twitter', x: 580, y: 350, link: 'https://twitter.com/share?text=${title}&url=${url}' },
        { title: 'Facebook', icon: 'facebook-f', x: 580, y: 350, link: 'https://www.facebook.com/sharer.php?u=${url}' },
        { title: 'LinkedIn', icon: 'linkedin-in', x: 580, y: 350, link: 'https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}' },
        { title: 'Digg', icon: 'digg', x: 985, y: 700, link: 'https://digg.com/submit?url=${url}' },
        { title: 'Reddit', icon: 'reddit', x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}$title=${title}' },
    ],
    share(elem) {
        const button = libX.social.buttons[elem.index()];
        const insert = (text, find, value) => text.replace(find, encodeURIComponent(value));
        const linkTemp = insert(button.link, '${url}', window.location.href);
        const link = insert(linkTemp, '${title}', window.document.title);
        return libX.ui.popup(link, { width: button.x, height: button.y });
    },
    setup() {
        const container = $('#social-buttons');
        const iconHtml = ['<i data-brand=', ' data-click=libX.social.share></i>'];
        let html = '<span>';
        const addHtml = (button) => html += iconHtml[0] + button.icon + iconHtml[1];
        if (container.length)
            libX.social.buttons.forEach(addHtml);
        return container.fadeTo(0, 0.0).html(html + '</span>').fadeTo('slow', 1.0);
    },
};
const libXExtra = {
    blogger(websiteUrl) {
        const onArticleLoad = () => {
            console.log('Article: %c' + $('h1.entry-title').text().trim(), 'color: purple;');
            $('#header >.header-bar h3').attr('data-href', websiteUrl);
            libX.ui.normalize();
            window['hljsEnhance'].setup();
        };
        return $(window['blogger'].ui()).on({ viewitem: onArticleLoad });
    },
    gTags(scriptTag) {
        const trackingID = $(scriptTag).attr('src').split('=')[1];
        window['dataLayer'] = window['dataLayer'] || [];
        function gtag(...args) { window['dataLayer'].push(args); }
        gtag('js', new Date());
        gtag('config', trackingID);
    },
};
const libX = {
    version: '1.4.1',
    ui: libXUi,
    util: libXUtil,
    crypto: libXCrypto,
    storage: libXStorage,
    counter: libXCounter,
    browser: libXBrowser,
    popupImage: libXPopupImage,
    animate: libXAnimate,
    bubbleHelp: libXBubbleHelp,
    form: libXForm,
    social: libXSocial,
    extra: libXExtra,
    initialize() {
        globalThis['libX' + ''] = libX;
        $.fn.id = libX.ui.plugin.id;
        $.fn.enable = libX.ui.plugin.enable;
        $.fn.disable = libX.ui.plugin.disable;
        $.fn.findAll = libX.ui.plugin.findAll;
        libX.social.setup();
        libX.ui.setupForkMe();
        dna.registerInitializer(libX.ui.normalize);
        const clickAndTap = (callback) => ({ click: callback, touchstart: callback });
        const onLoadSetup = () => {
            libX.ui.displayAddr();
            libX.ui.setupVideos();
            libX.form.perfect();
            libX.bubbleHelp.setup();
            $(window.document)
                .on(clickAndTap(libX.ui.revealSection), '.reveal-button')
                .on({ click: libX.ui.popupClick }, '[data-href-popup]')
                .on({ click: libX.popupImage.show }, '[data-popup-image], .popup-image');
        };
        $(onLoadSetup);
    },
};
libX.initialize();
