//! web-ignition v2.4.2 ~~ https://github.com/center-key/web-ignition ~~ MIT License

const libXDom = {
    stateDepot: [],
    state(elem) {
        const data = elem.dataset;
        elem.classList.add('libx-state');
        if (!data.libXState)
            data.libXState = String(libX.dom.stateDepot.push({}) - 1);
        return libX.dom.stateDepot[Number(data.libXState)];
    },
    cloneState(clone) {
        const copy = (elem) => {
            const data = elem.dataset;
            const newState = { ...libX.dom.stateDepot[Number(data.libXState)] };
            data.libXState = String(libX.dom.stateDepot.push(newState) - 1);
        };
        if (clone.classList.contains('libx-state'))
            copy(clone);
        libX.dom.forEach(clone.getElementsByClassName('libx-state'), copy);
        return clone;
    },
    componentState(elem) {
        const component = libX.ui.getComponent(elem);
        libX.util.assert(component, 'Component not found for element', elem);
        return libX.dom.state(component);
    },
    removeState(elem) {
        const data = elem.dataset;
        if (data.libXState)
            libX.dom.stateDepot[Number(data.libXState)] = {};
        return elem;
    },
    createCustom(tag, options) {
        const elem = globalThis.document.createElement(tag);
        if (options?.id)
            elem.id = options.id;
        if (options?.class)
            elem.classList.add(options.class);
        if (options?.href)
            elem.href = options.href;
        if (options?.html)
            elem.innerHTML = options.html;
        if (options?.name)
            elem.name = options.name;
        if (options?.rel)
            elem.rel = options.rel;
        if (options?.src)
            elem.src = options.src;
        if (options?.text)
            elem.textContent = options.text;
        if (options?.type)
            elem.type = options.type;
        if (options?.subTags)
            options.subTags.forEach(subTag => elem.appendChild(globalThis.document.createElement(subTag)));
        return elem;
    },
    create(tag, options) {
        const elem = globalThis.document.createElement(tag);
        if (options?.id)
            elem.id = options.id;
        if (options?.class)
            elem.classList.add(options.class);
        if (options?.href)
            elem.href = options.href;
        if (options?.html)
            elem.innerHTML = options.html;
        if (options?.name)
            elem.name = options.name;
        if (options?.rel)
            elem.rel = options.rel;
        if (options?.src)
            elem.src = options.src;
        if (options?.text)
            elem.textContent = options.text;
        if (options?.type)
            elem.type = options.type;
        if (options?.subTags)
            options.subTags.forEach(subTag => elem.appendChild(globalThis.document.createElement(subTag)));
        return elem;
    },
    select(selector) {
        return globalThis.document.body.querySelector(selector);
    },
    selectAll(selector) {
        return [...globalThis.document.body.querySelectorAll(selector)];
    },
    hasClass(elems, className) {
        const elemHas = (elem) => elem.classList.contains(className);
        return Array.prototype.some.call(elems, elemHas);
    },
    toggleClass(elem, className, state) {
        if (state === undefined ? !elem.classList.contains(className) : state)
            elem.classList.add(className);
        else
            elem.classList.remove(className);
        return elem;
    },
    replaceClass(elem, oldName, newName) {
        elem.classList.remove(oldName);
        elem.classList.add(newName);
        return elem;
    },
    addClass(elems, className) {
        const addToElem = (elem) => elem.classList.add(className);
        Array.prototype.forEach.call(elems, addToElem);
        return elems;
    },
    forEach(elems, fn) {
        Array.prototype.forEach.call(elems, fn);
        return elems;
    },
    map(elems, fn) {
        return Array.prototype.map.call(elems, fn);
    },
    filter(elems, fn) {
        return Array.prototype.filter.call(elems, fn);
    },
    filterBySelector(elems, selector) {
        const elemMatches = (elem) => elem.matches(selector);
        return Array.prototype.filter.call(elems, elemMatches);
    },
    filterByClass(elems, ...classNames) {
        const hasClass = (elem) => elem.classList.contains(classNames[0]);
        const filtered = Array.prototype.filter.call(elems, hasClass);
        return classNames.length === 1 ? filtered : libX.dom.filterByClass(filtered, ...classNames.splice(1));
    },
    find(elems, fn) {
        return Array.prototype.find.call(elems, fn) ?? null;
    },
    index(elem) {
        let index = 0;
        let prev = elem.previousElementSibling;
        while (prev) {
            index++;
            prev = prev.previousElementSibling;
        }
        return index;
    },
    indexOf(elems, elem) {
        return Array.prototype.indexOf.call(elems, elem);
    },
    findIndex(elems, selector) {
        const elemMatches = (elem) => elem.matches(selector);
        return Array.prototype.findIndex.call(elems, elemMatches);
    },
    isElem(elem) {
        return !!elem && typeof elem === 'object' && !!elem.nodeName;
    },
    getAttrs(elem) {
        return elem ? Object.values(elem.attributes) : [];
    },
    toElem(elemOrEvent) {
        return (libX.dom.isElem(elemOrEvent) ? elemOrEvent : elemOrEvent.target);
    },
    on(type, listener, options) {
        const defaults = { keyFilter: null, selector: null, container: null };
        const settings = { ...defaults, ...options };
        const noFilter = !settings.keyFilter;
        const noSelector = !settings.selector;
        const noContainer = !settings.container;
        const delegator = (event) => {
            const target = event.target;
            const elem = !target || noSelector ? target : target.closest(settings.selector);
            const expectedKey = () => noFilter || settings.keyFilter === event.key;
            const expectedElem = () => noContainer || settings.container.contains(target);
            if (elem && expectedKey() && expectedElem())
                listener(elem, event, settings.selector);
        };
        globalThis.document.addEventListener(type, delegator);
    },
    onClick(listener, selector) {
        libX.dom.on('click', listener, { selector: selector ?? null });
    },
    onChange(listener, selector) {
        libX.dom.on('change', listener, { selector: selector ?? null });
    },
    onInput(listener, selector) {
        libX.dom.on('input', listener, { selector: selector ?? null });
    },
    onKeyDown(listener, selector) {
        libX.dom.on('keydown', listener, { selector: selector ?? null });
    },
    onKeyUp(listener, selector) {
        libX.dom.on('keyup', listener, { selector: selector ?? null });
    },
    onEnterKey(listener, selector) {
        libX.dom.on('keypress', listener, { selector: selector ?? null, keyFilter: 'Enter' });
    },
    onFocusIn(listener, selector) {
        libX.dom.on('focusin', listener, { selector: selector ?? null });
    },
    onFocusOut(listener, selector) {
        libX.dom.on('focusin', listener, { selector: selector ?? null });
    },
    onCut(listener, selector) {
        libX.dom.on('cut', listener, { selector: selector ?? null });
    },
    onPaste(listener, selector) {
        libX.dom.on('paste', listener, { selector: selector ?? null });
    },
    onTouchStart(listener, selector) {
        libX.dom.on('touchstart', listener, { selector: selector ?? null });
    },
    onTouchEnd(listener, selector) {
        libX.dom.on('touchend', listener, { selector: selector ?? null });
    },
    onSubmit(listener, selector) {
        libX.dom.on('submit', listener, { selector: selector ?? null });
    },
    onHoverIn(listener, selector) {
        let ready = true;
        const delegator = (event) => {
            const target = event.target;
            const elem = target?.closest(selector);
            if (elem && ready)
                listener(elem, event, selector);
            ready = elem === null;
        };
        globalThis.document.addEventListener('pointerover', delegator);
    },
    onHoverOut(listener, selector) {
        let ready = false;
        let prevTarget = null;
        const delegator = (event) => {
            const target = event.target;
            const elem = target?.closest(selector);
            prevTarget = elem ?? prevTarget;
            if (elem === null && ready)
                listener(prevTarget, event, selector);
            ready = elem !== null;
        };
        globalThis.document.addEventListener('pointerover', delegator);
    },
    onReady(callback, options) {
        const browserless = !globalThis.document;
        const state = browserless ? 'browserless' : globalThis.document.readyState;
        if (browserless && !options?.quiet)
            console.info(new Date().toISOString(), 'Callback run in browserless context');
        if (state === 'loading')
            globalThis.document.addEventListener('DOMContentLoaded', callback);
        else
            globalThis.setTimeout(callback);
        return state;
    },
};
const libXUi = {
    isHidden(elem) {
        const computed = globalThis.getComputedStyle(elem);
        return computed.display === 'none' || computed.visibility === 'hidden' ||
            computed.visibility === 'collapse' || computed.opacity === '0' || elem.clientHeight === 0;
    },
    isVisible(elem) {
        return !libX.ui.isHidden(elem);
    },
    show(elem) {
        const style = elem.style;
        style.removeProperty('display');
        style.removeProperty('opacity');
        style.removeProperty('visibility');
        const computed = globalThis.getComputedStyle(elem);
        const override = (prop, values, standIn) => values.includes(computed.getPropertyValue(prop)) && style.setProperty(prop, standIn);
        override('display', ['none'], 'block');
        override('opacity', ['0'], '1');
        override('visibility', ['collapse', 'hidden'], 'visible');
        return elem;
    },
    hide(elem) {
        elem.style.display = 'none';
        return elem;
    },
    toggle(elem, display) {
        return display ? libX.ui.show(elem) : libX.ui.hide(elem);
    },
    fadeIn(elem) {
        const fadeTransition = 600;
        const computed = globalThis.getComputedStyle(elem);
        const startOpacity = libX.ui.isVisible(elem) ? computed.opacity : '0';
        libX.ui.show(elem);
        const style = elem.style;
        style.transition = 'all 0ms';
        style.opacity = startOpacity;
        const animate = () => {
            style.transition = `all ${fadeTransition}ms`;
            style.opacity = '1';
        };
        globalThis.requestAnimationFrame(animate);
        const cleanup = () => {
            style.removeProperty('transition');
            style.removeProperty('opacity');
            libX.ui.show(elem);
            return elem;
        };
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), fadeTransition + 100));
    },
    fadeOut(elem) {
        const fadeTransition = 600;
        const style = elem.style;
        style.transition = 'all 0ms';
        style.opacity = globalThis.getComputedStyle(elem).opacity;
        const animate = () => {
            style.transition = `all ${fadeTransition}ms`;
            style.opacity = '0';
        };
        if (libX.ui.isVisible(elem))
            globalThis.requestAnimationFrame(animate);
        const cleanup = () => {
            style.removeProperty('transition');
            style.opacity = '0';
            return elem;
        };
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), fadeTransition + 100));
    },
    slideFadeIn(elem) {
        const fadeTransition = 600;
        const style = elem.style;
        const verticals = [
            'height',
            'border-top-width',
            'border-bottom-width',
            'padding-top',
            'padding-bottom',
            'margin-top',
            'margin-bottom',
        ];
        const start = () => {
            libX.ui.show(elem);
            style.transition = 'all 0ms';
            style.opacity = '0';
            style.overflow = 'hidden';
            const computed = globalThis.getComputedStyle(elem);
            const heights = verticals.map(prop => computed.getPropertyValue(prop));
            verticals.forEach(prop => style.setProperty(prop, '0px'));
            const animate = () => {
                style.transition = `all ${fadeTransition}ms`;
                style.opacity = '1';
                verticals.forEach((prop, i) => style.setProperty(prop, heights[i]));
            };
            globalThis.requestAnimationFrame(animate);
        };
        if (libX.ui.isHidden(elem))
            start();
        const cleanup = () => {
            style.removeProperty('transition');
            style.removeProperty('opacity');
            style.removeProperty('overflow');
            verticals.forEach((prop) => style.removeProperty(prop));
            libX.ui.show(elem);
            return elem;
        };
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), fadeTransition + 100));
    },
    slideFadeOut(elem) {
        const fadeTransition = 600;
        const computed = globalThis.getComputedStyle(elem);
        const style = elem.style;
        style.transition = `all ${fadeTransition}ms`;
        style.opacity = String(Math.min(1, Number(computed.getPropertyValue('opacity'))));
        style.overflow = 'hidden';
        const verticals = [
            'height',
            'border-top-width',
            'border-bottom-width',
            'padding-top',
            'padding-bottom',
            'margin-top',
            'margin-bottom',
        ];
        const heights = verticals.map(prop => computed.getPropertyValue(prop));
        verticals.forEach((prop, i) => style.setProperty(prop, heights[i]));
        const animate = () => {
            style.opacity = '0';
            verticals.forEach(prop => style.setProperty(prop, '0px'));
        };
        globalThis.requestAnimationFrame(animate);
        const cleanup = () => {
            style.display = 'none';
            style.removeProperty('transition');
            style.removeProperty('opacity');
            style.removeProperty('overflow');
            verticals.forEach((prop) => style.removeProperty(prop));
            return elem;
        };
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), fadeTransition + 100));
    },
    slideFade(elem, show) {
        return show ? libX.ui.slideFadeIn(elem) : libX.ui.slideFadeOut(elem);
    },
    smoothHeight(updateUI, options) {
        const defaults = { container: globalThis.document.body, transition: 1000 };
        const settings = { ...defaults, ...options };
        const container = settings.container;
        const style = container.style;
        const setBaseline = () => {
            const height = String(container.clientHeight) + 'px';
            style.minHeight = height;
            style.maxHeight = height;
            style.overflow = 'hidden';
            container.classList.add('libx-animating');
        };
        const animate = () => {
            const turnOffTransition = () => {
                style.transition = 'none';
                style.maxHeight = 'none';
                container.classList.remove('libx-animating');
            };
            const animate = () => {
                style.minHeight = '0px';
                style.maxHeight = '100vh';
                globalThis.setTimeout(turnOffTransition, 1000);
            };
            const setAnimationLength = () => {
                style.transition = `all ${settings.transition}ms`;
                globalThis.requestAnimationFrame(animate);
            };
            globalThis.requestAnimationFrame(setAnimationLength);
        };
        const cleanup = () => {
            container.classList.replace('libx-animating', 'libx-animating-done');
            return container;
        };
        setBaseline();
        updateUI();
        animate();
        const delay = settings.transition + 100;
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), delay));
    },
    makeIcons(container = globalThis.document.body) {
        const iconify = (isBrand) => (icon) => {
            const data = icon.dataset;
            const name = isBrand ? data.brand : data.icon;
            icon.classList.add('font-icon');
            icon.classList.add(isBrand ? 'fab' : 'fas');
            icon.classList.add('fa-' + name);
        };
        if (container.matches('i[data-icon]'))
            iconify(false)(container);
        if (container.matches('i[data-brand]'))
            iconify(true)(container);
        container.querySelectorAll('i[data-icon]').forEach(iconify(false));
        container.querySelectorAll('i[data-brand]').forEach(iconify(true));
        return container;
    },
    normalize(container = globalThis.document.body) {
        const rawInput = (elem) => elem.spellcheck = false;
        const makeImageLink = (elem) => elem.closest('a').classList.add('image-link');
        const openInNewTab = (elem) => elem.target = '_blank';
        container.querySelectorAll('button:not([type])').forEach(elem => elem.type = 'button');
        container.querySelectorAll('button:not([tabindex])').forEach(elem => elem.tabIndex = 0);
        container.querySelectorAll('input:not([type])').forEach(elem => elem.type = 'text');
        container.querySelectorAll('input[type=email]').forEach(rawInput);
        container.querySelectorAll('a img, a i.font-icon').forEach(makeImageLink);
        if (!libX.browser.userAgentData().mobile)
            container.querySelectorAll('a.external-site, .external-site a').forEach(openInNewTab);
        return container;
    },
    displayAddr(container = globalThis.document.body) {
        const build = (elem, data) => `${data.name}<span>${String.fromCharCode(64)}${data.domain}</span>`;
        const display = (elem) => elem.innerHTML = build(elem, elem.dataset);
        libX.dom.forEach(container.getElementsByClassName('display-addr'), display);
        return container;
    },
    popup(url, options) {
        const defaults = { width: 600, height: 400 };
        const settings = { ...defaults, ...options };
        const dimensions = `left=200,top=100,width=${settings.width},height=${settings.height}`;
        return globalThis.window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
    },
    popupClick(elem) {
        const data = elem.dataset;
        const width = Number(data.width ?? '600');
        const height = Number(data.height ?? '400');
        return libX.ui.popup(data.hrefPopup, { width, height });
    },
    revealSection(elem) {
        const button = elem.closest('.reveal-button');
        const selector = `.reveal-target[data-reveal="${button.dataset.reveal}"]`;
        const findTarget = () => libX.dom.select(selector);
        const target = button.dataset.reveal ? findTarget() : button.nextElementSibling;
        libX.ui.slideFadeIn(target);
        return button;
    },
    keepOnScreen(elem, options) {
        const defaults = { padding: 10 };
        const settings = { ...defaults, ...options };
        const getPixels = (style) => /px$/.test(style) ? Number(style.slice(0, -2)) : 0;
        const pad = settings.padding;
        const client = elem.getBoundingClientRect();
        const computed = globalThis.getComputedStyle(elem);
        const moveL = Math.max(pad + client.right - globalThis.window.innerWidth, 0);
        const moveR = Math.max(pad - client.left, 0);
        const moveU = Math.max(pad + client.bottom - globalThis.window.innerHeight, 0);
        const moveD = Math.max(pad - client.top, 0);
        const newLeft = getPixels(computed.left) + moveR - moveL;
        const newTop = getPixels(computed.top) + moveD - moveU;
        const style = elem.style;
        style.left = String(newLeft) + 'px';
        style.top = String(newTop) + 'px';
        return elem;
    },
    autoDisableButtons() {
        const disable = (elem) => elem ? elem.disabled = true : false;
        const disableFormButton = (elem) => disable(elem.querySelector('button:not(.no-disable)'));
        const disableButton = (elem) => disable(elem.closest('nav, .no-disable') ? null : elem.closest('button'));
        libX.dom.onSubmit(disableFormButton, 'form');
        libX.dom.onClick(disableButton, 'button:not([type=submit],[data-href],[data-href-popup])');
    },
    loadImageFadeIn(elem, url, duration) {
        const fadeTransition = duration ?? 600;
        const style = elem.style;
        style.transition = `all 0ms`;
        style.opacity = '0';
        if (globalThis.getComputedStyle(elem).display === 'none')
            style.display = 'block';
        const load = (done) => {
            const cleanup = () => {
                style.removeProperty('transition');
                style.removeProperty('opacity');
                done(elem);
            };
            const handleImgage = () => {
                if (elem.matches('img'))
                    elem.src = url;
                else
                    style.backgroundImage = 'url("' + url + '")';
                style.transition = `all ${fadeTransition}ms`;
                style.opacity = '1';
                globalThis.setTimeout(cleanup, fadeTransition + 100);
            };
            const img = new Image();
            img.onload = handleImgage;
            img.src = url;
        };
        return new Promise(resolve => load(resolve));
    },
    setupVideos() {
        const makeClickable = (elem) => {
            const src = elem.querySelector('iframe')?.src ?? '';
            const url = src.replace('//www.youtube.com/embed', '//youtu.be');
            elem.dataset.href = url;
            elem.classList.add('external-site');
        };
        globalThis.document.querySelectorAll('figure.video-container-link').forEach(makeClickable);
        return;
    },
    setupForkMe() {
        const forkMe = globalThis.document.getElementById('fork-me');
        const wrap = () => {
            const header = forkMe.parentElement;
            const container = libX.dom.create('div');
            container.id = 'fork-me-container';
            const icon = libX.dom.create('i');
            icon.dataset.brand = 'github';
            icon.dataset.href = forkMe.href;
            container.appendChild(forkMe);
            container.appendChild(libX.ui.makeIcons(icon));
            return header.appendChild(container);
        };
        return forkMe ? wrap() : null;
    },
    getComponent(elem) {
        return elem?.closest('[data-component]') ?? null;
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
    assert(ok, message, info) {
        const quoteStr = (info) => typeof info === 'string' ? `"${info}"` : String(info);
        if (!ok)
            throw new Error(`[web-ignition] ${message} --> ${quoteStr(info)}`);
    },
};
const libXNav = {
    setupLinkMenu() {
        const linkMenu = globalThis.document.getElementById('link-menu');
        const setCurrentPage = () => {
            const path = globalThis.location.pathname;
            const pageName = path.replace(/index.[a-z]*$/, '').replace(/\/$/, '').replace(/.*\//, '');
            const active = linkMenu.querySelector(`a[href$="${pageName}"]`);
            const isIndex = path.endsWith('/') || /index\.[a-z]*$/.test(path);
            const isHome = linkMenu.children[0].getAttribute('href') === '.' && isIndex;
            const current = isHome ? linkMenu.firstElementChild : active;
            current?.classList.add('current');
        };
        if (linkMenu)
            setCurrentPage();
        return linkMenu;
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
        const value = globalThis.sessionStorage[key];
        return value ? JSON.parse(value) : {};
    },
    sessionSave(key, obj) {
        globalThis.sessionStorage[key] = JSON.stringify(obj);
        return libX.storage.sessionRead(key);
    },
    sessionRead(key) {
        const value = globalThis.sessionStorage[key];
        return value ? JSON.parse(value) : {};
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
    userAgentData() {
        const polyfill = () => {
            const brandEntry = globalThis.navigator.userAgent.split(' ').pop()?.split('/') ?? [];
            const hasTouch = !!navigator.maxTouchPoints;
            const platform = globalThis.navigator.platform;
            const mac = hasTouch ? 'iOS' : 'macOS';
            const platforms = { 'MacIntel': mac, 'Win32': 'Windows', 'iPhone': 'iOS', 'iPad': 'iOS' };
            return {
                brands: [{ brand: brandEntry[0] ?? '', version: brandEntry[1] ?? '' }],
                mobile: hasTouch || /Android|iPhone|iPad|Mobi/i.test(globalThis.navigator.userAgent),
                platform: platforms[platform] ?? platform,
            };
        };
        const uaData = globalThis.navigator['userAgentData'];
        return (uaData ?? polyfill());
    },
    iOS() {
        return libX.browser.userAgentData().platform === 'iOS';
    },
    macOS() {
        return libX.browser.userAgentData().platform === 'macOS';
    },
    msWindows() {
        return libX.browser.userAgentData().platform === 'Windows';
    },
    darkModeRequested() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
};
const libXPopupImage = {
    show(thumbnail) {
        const defaultPopupWidth = 1000;
        const gap = 30;
        thumbnail.classList.add('popup-image');
        thumbnail.parentElement.style.position = 'relative';
        if (thumbnail.nextElementSibling?.classList.contains(('popup-image-layer')))
            thumbnail.nextElementSibling.remove();
        const data = thumbnail.dataset;
        const width = data.popupWidth ? Number(data.popupWidth) : defaultPopupWidth;
        const maxWidth = Math.min(width, globalThis.window.innerWidth - gap);
        const src = data.popupImage ?? thumbnail.src;
        const popupLayer = libX.dom.create('div', { class: 'popup-image-layer' });
        const popupImg = libX.dom.create('img', { src: src });
        const closeIcon = libX.dom.create('i');
        popupImg.style.maxWidth = String(maxWidth) + 'px';
        closeIcon.dataset.icon = 'times';
        libX.ui.makeIcons(closeIcon);
        popupLayer.appendChild(popupImg);
        popupLayer.appendChild(closeIcon);
        thumbnail.after(popupLayer);
        libX.ui.fadeIn(popupLayer);
        libX.ui.keepOnScreen(popupLayer);
        const close = () => {
            libX.ui.fadeOut(popupLayer).then(elem => elem.remove());
            globalThis.window.removeEventListener('keyup', close);
        };
        popupLayer.addEventListener('click', close);
        libX.dom.on('keyup', close, { keyFilter: 'Escape' });
        return thumbnail;
    },
};
const libXAnimate = {
    jiggleIt(elemOrEvent) {
        const elem = libX.dom.toElem(elemOrEvent);
        const animatation = 'jiggle-it 200ms 3';
        const style = elem.style;
        style.animation = 'none';
        globalThis.requestAnimationFrame(() => style.animation = animatation);
        const cleanup = () => {
            style.removeProperty('animation');
            return elem;
        };
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), 200 * 3 + 100));
    },
    rollIn(container) {
        const startDelay = 300;
        const fadeDelay = 1500;
        const fadeTransition = 2000;
        const hide = (elem) => {
            const style = elem.style;
            style.transition = 'all 0ms';
            style.opacity = '0';
        };
        const fadeIn = (elem) => {
            const style = elem.style;
            style.transition = `all ${fadeTransition}ms`;
            style.opacity = '1';
        };
        const show = (elem, index) => globalThis.setTimeout(() => fadeIn(elem), startDelay + fadeDelay * index);
        libX.dom.forEach(container.children, hide);
        libX.dom.forEach(container.children, show);
        const cleanup = () => {
            libX.dom.forEach(container.children, elem => elem.style.removeProperty('transition'));
            return container;
        };
        const total = startDelay + fadeDelay * container.children.length - fadeDelay + fadeTransition;
        return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), total + 100));
    },
    montageLoop(container, options) {
        const defaults = {
            start: null,
            intervalMsec: 10000,
            fadeMsec: 3000,
        };
        const settings = { ...defaults, ...options };
        container.classList.add('montage-loop');
        if (!container.children.length)
            console.error('[montage-loop] No images found:', container);
        const transition = `all ${settings.fadeMsec}ms`;
        libX.dom.forEach(container.children, img => img.style.transition = transition);
        const start = (settings.start ?? Date.now()) % container.children.length;
        container.children[start].classList.add('current');
        const nextImage = () => {
            libX.dom.forEach(container.children, img => img.classList.remove('previous'));
            const previous = container.getElementsByClassName('current')[0];
            previous.classList.replace('current', 'previous');
            const next = previous.nextElementSibling || container.firstElementChild;
            next.classList.add('current');
        };
        globalThis.setInterval(nextImage, settings.intervalMsec);
        return container;
    },
};
const libXBubbleHelp = {
    setup(container = globalThis.document.body) {
        const hi = (target) => {
            const init = () => {
                const bubbleWrap = libX.dom.create('span');
                const bubblePointer = libX.dom.create('span');
                bubbleWrap.classList.add('bubble-wrap');
                bubblePointer.classList.add('bubble-pointer');
                bubblePointer.innerHTML = '&#9660;';
                bubbleWrap.appendChild(target.querySelector('.bubble-help'));
                bubbleWrap.appendChild(bubblePointer);
                target.appendChild(bubbleWrap);
                target.classList.add('bubble-help-initialized');
            };
            if (!target.classList.contains('bubble-help-initialized'))
                init();
            globalThis.window.requestAnimationFrame(() => target.classList.add('bubble-help-show'));
        };
        const bye = (target) => {
            const delayFadeOut = 200;
            globalThis.setTimeout(() => target.classList.remove('bubble-help-show'), delayFadeOut);
        };
        if (container.matches('bubble-help'))
            container.parentElement.classList.add('bubble-help-hover');
        libX.dom.forEach(container.getElementsByClassName('bubble-help'), elem => elem.parentElement.classList.add('bubble-help-hover'));
        const enable = () => {
            libX.dom.onHoverIn(hi, '.bubble-help-hover');
            libX.dom.onHoverOut(bye, '.bubble-help-hover');
            globalThis.document.body.classList.add('bubble-help-enabled');
        };
        if (!globalThis.document.body.classList.contains('bubble-help-enabled'))
            enable();
        return container;
    },
};
const libXMarbleChecklist = {
    setup(checklistElem) {
        const dbName = 'marble-checklist' + (checklistElem.id ? '-' + checklistElem.id : '');
        const items = [...checklistElem.children];
        const getId = (checkbox) => checkbox.closest('li').id;
        const addCheckboxElements = () => {
            items.forEach(li => li.appendChild(libX.dom.create('label', { subTags: ['input', 'b'] })));
            const boxes = [...checklistElem.querySelectorAll('input')];
            boxes.forEach(box => box.type = 'checkbox');
            return boxes;
        };
        const checkboxes = addCheckboxElements();
        const restoreChecklist = () => {
            const data = globalThis.localStorage.getItem(dbName);
            const checklist = !data ? null : JSON.parse(data);
            if (checklist)
                checkboxes.forEach(checkbox => checkbox.checked = !!checklist[getId(checkbox)]);
        };
        restoreChecklist();
        const saveChecklist = () => {
            const toEntryPair = (checkbox) => [getId(checkbox), checkbox.checked];
            const checklist = Object.fromEntries(checkboxes.map(toEntryPair));
            globalThis.localStorage.setItem(dbName, JSON.stringify(checklist));
        };
        const eventOptions = { container: checklistElem, selector: 'input[type=checkbox]' };
        libX.dom.on('click', saveChecklist, eventOptions);
    },
};
const libXForm = {
    perfect() {
        const form = globalThis.document.querySelector('form.perfect:not([action])');
        const backupField = () => {
            return libX.dom.create('input', { type: 'hidden', name: 'version' });
        };
        const configure = () => {
            const elem = form;
            const version = elem.dataset.version || '';
            const extra = version + String.fromCharCode(46, 112) + 'hp';
            const field = elem.querySelector('[name=version]') || backupField();
            field.value = version;
            elem.method = 'post';
            elem.action = 'perfect' + extra;
            elem.appendChild(field);
        };
        if (form)
            libX.dom.onFocusIn(() => globalThis.setTimeout(configure, 5000), 'form.perfect:not([action])');
        return form;
    },
};
const libXSocial = {
    buttons: [
        { title: 'Twitter', icon: 'x-twitter', x: 580, y: 350, link: 'https://twitter.com/share?text=${title}&url=${url}' },
        { title: 'Facebook', icon: 'facebook-f', x: 580, y: 350, link: 'https://www.facebook.com/sharer.php?u=${url}' },
        { title: 'LinkedIn', icon: 'linkedin-in', x: 580, y: 350, link: 'https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}' },
        { title: 'Reddit', icon: 'reddit', x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}&title=${title}' },
    ],
    share(elem) {
        const button = libX.social.buttons.find(info => info.icon === elem.dataset.brand);
        const insert = (text, find, value) => text.replace(find, encodeURIComponent(value));
        const linkWithUrl = insert(button.link, '${url}', globalThis.location.href);
        const link = insert(linkWithUrl, '${title}', globalThis.document.title);
        return libX.ui.popup(link, { width: button.x, height: button.y });
    },
    setup() {
        const container = globalThis.document.getElementById('social-buttons');
        const addIcons = () => {
            const span = libX.dom.create('span');
            const addIcon = (button) => {
                const icon = libX.dom.create('i');
                icon.dataset.brand = button.icon;
                span.appendChild(icon);
            };
            libX.social.buttons.forEach(addIcon);
            container.appendChild(span);
            libX.ui.makeIcons(container);
        };
        if (container)
            addIcons();
        libX.dom.onClick(libX.social.share, '#social-buttons i');
        return container;
    },
};
const libXExtra = {
    blogger(websiteUrl) {
        console.info('Blog associated with:', websiteUrl);
        const onArticleLoad = () => {
            const title = libX.dom.select('h1.entry-title').textContent.trim();
            console.info('Article: %c' + title, 'font-weight: bold; color: turquoise;');
            libX.dom.select('#header >.header-bar h3').dataset.href = websiteUrl;
            libX.ui.normalize();
            globalThis.hljsEnhance.setup();
        };
        const delayed = (delay) => globalThis.setTimeout(onArticleLoad, delay);
        globalThis.blogger.ui().addListener('updated', () => delayed(800));
        globalThis.blogger.ui().addListener('updated', () => delayed(2000));
    },
};
const libX = {
    version: '2.4.2',
    dom: libXDom,
    ui: libXUi,
    util: libXUtil,
    nav: libXNav,
    crypto: libXCrypto,
    storage: libXStorage,
    counter: libXCounter,
    browser: libXBrowser,
    popupImage: libXPopupImage,
    animate: libXAnimate,
    bubbleHelp: libXBubbleHelp,
    marbleChecklist: libXMarbleChecklist,
    form: libXForm,
    social: libXSocial,
    extra: libXExtra,
    initialize() {
        globalThis.libX = libX;
        const initializeDna = () => {
            const dna = globalThis['dna'];
            dna.registerInitializer(libX.ui.makeIcons, { onDomReady: false });
            dna.registerInitializer(libX.ui.normalize, { onDomReady: false });
        };
        if ('dna' in globalThis)
            initializeDna();
        const blockFormSubmit = (elem, event) => event.preventDefault();
        const onReadySetup = () => {
            libX.ui.makeIcons();
            libX.ui.normalize();
            libX.ui.setupForkMe();
            libX.ui.displayAddr();
            libX.ui.setupVideos();
            libX.nav.setupLinkMenu();
            libX.form.perfect();
            libX.bubbleHelp.setup();
            libX.social.setup();
            libX.dom.onClick(libX.ui.revealSection, '.reveal-button');
            libX.dom.onTouchStart(libX.ui.revealSection, '.reveal-button');
            libX.dom.onClick(libX.ui.popupClick, '[data-href-popup]');
            libX.dom.onClick(libX.popupImage.show, '[data-popup-image], .popup-image');
            libX.dom.onEnterKey(blockFormSubmit, 'form input:not([type=password])');
        };
        libX.dom.onReady(onReadySetup);
    },
};
libX.initialize();
globalThis.libX = libX;
