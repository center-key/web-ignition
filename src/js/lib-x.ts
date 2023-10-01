//////////////////////////////////////////
// web-ignition - lib-x.js              //
// Generic functions and web page setup //
// MIT License                          //
//////////////////////////////////////////

// Types
export type GlobalKey =  keyof typeof globalThis;
export type Json =       string | number | boolean | null | undefined | JsonObject | Json[];
export type JsonObject = { [key: string]: Json };
export type JsonData =   JsonObject | Json[];
export type LibXForEachCallback =        (elem: Element, index: number) => void;
export type LibXObject =                 { [key: string]: unknown };
export type LibXUiPopupSettings =        { width: number, height: number };
export type LibXUiKeepOnScreenSettings = { padding: number };
export type LibXCryptoHashSettings =     { algorithm: string, salt: string };
export type LibXCounterMap =             { [counter: string]: number };
export type LibXSocialButton =           { title: string, icon: string, x: number, y: number, link: string };
export type LibXEventListener =          (elem: Element, event: Event, selector: string | null) => void;
export type LibXSettingsEventsOn = {
   keyFilter:  KeyboardEvent["key"] | null,
   selector:   string | null,
   };
export type LibXMontageLoopSettings = {
   start:        number | null,  //index of first image to show        (default: nulll for random)
   intervalMsec: number,         //milliseconds between transitions    (default: 10,000)
   fadeMsec:     number,         //milliseconds to complete transition (default: 3,000)
   };
export type NavigatorUAData = {
   readonly brands: {
      brand:   string,  //examples: "Chromium", "Google Chrome"
      version: string,  //example: "106"
      }[],
   readonly mobile:   boolean;
   readonly platform: string;  //examples: "macOS", "Windows"
   };
export type LibX = typeof libX;
type Blogger = { ui: () => { addListener: (type: string, listener: () => void) => void, Lc: { wb: string[] } } };
declare global { var blogger:     Blogger }                //eslint-disable-line no-var
declare global { var dataLayer:   unknown[] }              //eslint-disable-line no-var
declare global { var hljsEnhance: { setup: () => void } }  //eslint-disable-line no-var
declare global { var libX:        LibX }                   //eslint-disable-line no-var

const libXDom = {
   stateDepot: <{ [key: string | number | symbol]: unknown }[]>[],
   state(elem: Element) {
      // Returns an object associated with the element that can be used to store values.
      // Usage:
      //    libX.dom.state(document.body).lastUpdate = Date.now();
      // Class added to element:
      //    <body class=libx-state data-libx-state=21>
      const data = (<HTMLElement>elem).dataset;
      elem.classList.add('libx-state');
      if (!data.libXState)
         data.libXState = String(libX.dom.stateDepot.push({}) - 1);
      return libX.dom.stateDepot[Number(data.libXState)]!;
      },
   cloneState(clone: Element): Element {
      // Use imediately after cloning an element in order to grant the clone its own state
      // data (note: it's a shallow copy).
      const copy = (elem: Element) => {
         const data =     (<HTMLElement>elem).dataset;
         const newState = { ...libX.dom.stateDepot[Number(data.libXState)] };
         data.libXState = String(libX.dom.stateDepot.push(newState) - 1);
         };
      if (clone.classList.contains('libx-state'))
         copy(clone);
      libX.dom.forEach(clone.getElementsByClassName('libx-state'), copy);
      return clone;
      },
   create<K extends keyof HTMLElementTagNameMap | string>(tag: K, options?: { id?: string, subTags?: string[], class?: string, href?: string, html?: string, name?: string, rel?: string, src?: string, text?: string, type?: string }) {
      const elem = globalThis.document.createElement(tag);
      if (options?.id)
         elem.id = options.id;
      if (options?.class)
         elem.classList.add(options.class);
      if (options?.href)
         (<HTMLAnchorElement>elem).href = options.href;
      if (options?.html)
         elem.innerHTML = options.html;
      if (options?.name)
         (<HTMLInputElement>elem).name = options.name;
      if (options?.rel)
         (<HTMLLinkElement>elem).rel = options.rel;
      if (options?.src)
         (<HTMLImageElement>elem).src = options.src;
      if (options?.text)
         elem.textContent = options.text;
      if (options?.type)
         (<HTMLInputElement>elem).type = options.type;
      if (options?.subTags)
         options.subTags.forEach(
            subTag => elem.appendChild(globalThis.document.createElement(subTag)));
      return <K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : HTMLElement>elem;
      },
   removeState(elem: Element): Element {
      const data = (<HTMLElement>elem).dataset;
      if (data.libXState)
         libX.dom.stateDepot[Number(data.libXState)] = {};
      return elem;
      },
   select(selector: string): HTMLElement | null {
      return globalThis.document.body.querySelector(selector);
      },
   selectAll(selector: string): HTMLElement[] {
      return <HTMLElement[]>[...globalThis.document.body.querySelectorAll(selector)];
      },
   hasClass(elems: Element[] | HTMLCollection | NodeListOf<Element>, className: string): boolean {
      // Returns true if any of the elements in the given list have the specified class.
      return Array.prototype.some.call(elems, elem => elem.classList.contains(className));
      },
   toggleClass(elem: Element, className: string, state?: boolean): Element {
      // Adds or removes an element class.
      if (state === undefined ? !elem.classList.contains(className) : state)
         elem.classList.add(className);
      else
         elem.classList.remove(className);
      return elem;
      },
   replaceClass(elem: Element, oldName: string, newName: string): Element {
      // Same as native elem.classList.replace() except the new class name is always added.
      elem.classList.remove(oldName);
      elem.classList.add(newName);
      return elem;
      },
   addClass<T extends Element[] | HTMLCollection | NodeListOf<Element>>(elems: T, className: string): T {
      // Adds the specified class to each of the elements in the given list.
      Array.prototype.forEach.call(elems, elem => elem.classList.add(className));
      return elems;
      },
   forEach<T extends HTMLCollection>(elems: T, fn: (elem: Element, index: number, elems: unknown[]) => unknown): T {
      // Loops over the given list of elements to pass each element to the specified function.
      Array.prototype.forEach.call(elems, fn);
      return elems;
      },
   map<T>(elems: HTMLCollection | NodeListOf<Element>, fn: (elem: Element, index: number, elems: unknown[]) => T): T[] {
      // Loops over the given list of elements to pass each element to the specified function.
      return <T[]>Array.prototype.map.call(elems, fn);
      },
   filter(elems: HTMLCollection | NodeListOf<Element>, fn: (elem: Element, index: number, elems: unknown[]) => unknown): Element[] {
      // Filters a list of elements.
      return Array.prototype.filter.call(elems, fn);
      },
   filterBySelector(elems: Element[] | HTMLCollection, selector: string): Element[] {
      // Returns direct child elements filtered by the specified selector.
      return Array.prototype.filter.call(elems, elem => elem.matches(selector));
      },
   filterByClass(elems: Element[] | HTMLCollection, ...classNames: string[]): Element[] {
      // Returns direct child elements filtered by one or more class names.
      const hasClass = (elem: Element) => elem.classList.contains(classNames[0]!);
      const filtered = Array.prototype.filter.call(elems, hasClass);
      return classNames.length === 1 ? filtered : libX.dom.filterByClass(filtered, ...classNames.splice(1));
      },
   find(elems: HTMLCollection | NodeListOf<Element>, fn: (elem: Element, index?: number, elems?: unknown[]) => boolean): Element | null {
      // Finds the first element that satisfies the given condition.
      return Array.prototype.find.call(elems, fn) ?? null;
      },
   index(elem: Element): number {
      // Returns the index of element within its container (relative to all its sibling elements).
      let index = 0;
      let prev =  elem.previousElementSibling;
      while (prev) {
         index++;
         prev = prev.previousElementSibling;
         }
      return index;
      },
   indexOf(elems: NodeListOf<Element>, elem: Element): number {
      // Returns the location an element within an array of elements.
      return Array.prototype.indexOf.call(elems, elem);
      },
   findIndex(elems: HTMLCollection | NodeListOf<Element>, selector: string): number {
      // Returns the location of the first matching element within an array of elements.
      return Array.prototype.findIndex.call(elems, (elem) => elem.matches(selector));
      },
   isElem(elem: unknown): boolean {
      return !!elem && typeof elem === 'object' && !!(<Element>elem).nodeName;
      },
   getAttrs(elem: Element): Attr[] {
      // Returns the attributes of the element in a regular array.
      return elem ? Object.values(elem.attributes) : [];
      },
   toElem(elemOrEvent: Element | Event): HTMLElement {
      // Allows convenient support of both:
      //    libX.dom.onClick(addBorder, 'h1');
      //    titleElem.addEventListener('click', addBorder);
      return <HTMLElement>(libX.dom.isElem(elemOrEvent) ? elemOrEvent : (<Event>elemOrEvent).target);
      },
   on(type: string, listener: LibXEventListener, options?: Partial<LibXSettingsEventsOn>) {
      // See types: https://developer.mozilla.org/en-US/docs/Web/Events
      const defaults = { keyFilter: null, selector: null };
      const settings = { ...defaults, ...options };
      const noFilter =   !settings.keyFilter;
      const noSelector = !settings.selector;
      const delegator = (event: Event) => {
         const target = <Element>event.target;
         const elem =   !target || noSelector ? target : <Element>target.closest(settings.selector!);
         if (elem && (noFilter || settings.keyFilter === (<KeyboardEvent>event).key))
            listener(elem, event, settings.selector);
         };
      globalThis.document.addEventListener(type, delegator);
      },
   onClick(listener: LibXEventListener, selector?: string) {
      libX.dom.on('click', listener, { selector: selector ?? null });
      },
   onChange(listener: LibXEventListener, selector?: string) {
      libX.dom.on('change', listener, { selector: selector ?? null });
      },
   onInput(listener: LibXEventListener, selector?: string) {
      libX.dom.on('input', listener, { selector: selector ?? null });
      },
   onKeyDown(listener: LibXEventListener, selector?: string) {
      libX.dom.on('keydown', listener, { selector: selector ?? null });
      },
   onKeyUp(listener: LibXEventListener, selector?: string) {
      libX.dom.on('keyup', listener, { selector: selector ?? null });
      },
   onEnterKey(listener: LibXEventListener, selector?: string) {
      libX.dom.on('keyup', listener, { selector: selector ?? null, keyFilter: 'Enter' });
      },
   onFocusIn(listener: LibXEventListener, selector?: string) {
      libX.dom.on('focusin', listener, { selector: selector ?? null });
      },
   onFocusOut(listener: LibXEventListener, selector?: string) {
      libX.dom.on('focusin', listener, { selector: selector ?? null });
      },
   onCut(listener: LibXEventListener, selector?: string) {
      libX.dom.on('cut', listener, { selector: selector ?? null });
      },
   onPaste(listener: LibXEventListener, selector?: string) {
      libX.dom.on('paste', listener, { selector: selector ?? null });
      },
   onTouchStart(listener: LibXEventListener, selector?: string) {
      libX.dom.on('touchstart', listener, { selector: selector ?? null });
      },
   onTouchEnd(listener: LibXEventListener, selector?: string) {
      libX.dom.on('touchend', listener, { selector: selector ?? null });
      },
   onSubmit(listener: LibXEventListener, selector?: string) {
      libX.dom.on('submit', listener, { selector: selector ?? null });
      },
   onHoverIn(listener: LibXEventListener, selector: string) {
      // Calls the listener function when the pointer devices moves over any of the elements
      // matching the selector.
      let ready = true;
      const delegator = (event: Event) => {
         const target = <Element>(<Element>event.target)?.closest(selector);
         if (target !== null && ready)
            listener(target, event, selector);
         ready = target === null;
         };
      globalThis.document.addEventListener('pointerover', delegator);
      },
   onHoverOut(listener: LibXEventListener, selector: string) {
      // Calls the listener function when the pointer devices moves off any of the elements
      // matching the selector.
      let ready = false;
      let prevTarget: Element | null = null;
      const delegator = (event: Event) => {
         const target = <Element>(<Element>event.target)?.closest(selector);
         prevTarget = target ?? prevTarget;
         if (target === null && ready)
            listener(prevTarget!, event, selector);
         ready = target !== null;
         };
      globalThis.document.addEventListener('pointerover', delegator);
      },
   onReady(callback: (...args: unknown[]) => unknown, options?: { quiet?: boolean }): DocumentReadyState | 'browserless' {
      // Calls the specified function once the web page is loaded and ready.
      // Example (execute myApp.setup() as soon as the DOM is interactive):
      //    libX.dom.onReady(myApp.setup);
      const state = globalThis.document ? globalThis.document.readyState : 'browserless';
      if (state === 'browserless' && !options?.quiet)
         console.log(new Date().toISOString(), 'Callback run in browserless context');
      if (['complete', 'browserless'].includes(state))
         callback();
      else
         globalThis.window.addEventListener('DOMContentLoaded', callback);
      return state;
      },
   };

const libXUi = {
   isHidden(elem: Element): boolean {
      const computed = globalThis.getComputedStyle(elem);
      return computed.display === 'none' || computed.visibility === 'hidden' ||
         computed.visibility === 'collapse' || computed.opacity === '0' || elem.clientHeight === 0;
      },
   isVisible(elem: Element): boolean {
      return !libX.ui.isHidden(elem);
      },
   show(elem: Element): Element {
      const style = (<HTMLElement>elem).style;
      style.removeProperty('display');
      style.removeProperty('opacity');
      style.removeProperty('visibility');
      const computed = globalThis.getComputedStyle(elem);
      const override = (prop: string, values: string[], standIn: string) =>
         values.includes(computed.getPropertyValue(prop)) && style.setProperty(prop, standIn);
      override('display',    ['none'],               'block');
      override('opacity',    ['0'],                  '1');
      override('visibility', ['collapse', 'hidden'], 'visible');
      return elem;
      },
   hide(elem: Element): Element {
      (<HTMLElement>elem).style.display = 'none';
      return elem;
      },
   toggle(elem: Element, display: boolean): Element {
      return display ? libX.ui.show(elem) : libX.ui.hide(elem);
      },
   fadeIn(elem: Element): Promise<Element> {
      // Smooth fade in effect.
      const fadeTransition =  600;
      const computed =        globalThis.getComputedStyle(elem);
      const startOpacity =    libX.ui.isVisible(elem) ? computed.opacity : '0';
      libX.ui.show(elem);
      const style = (<HTMLElement>elem).style;
      style.transition = 'all 0ms';
      style.opacity =    startOpacity;
      const animate = () => {
         style.transition = `all ${fadeTransition}ms`;
         style.opacity =    '1';
         };
      globalThis.requestAnimationFrame(animate);
      const cleanup = () => {
         style.removeProperty('transition');
         style.removeProperty('opacity');
         libX.ui.show(elem);  //ensure visibility in case another animation interfered
         return elem;
         };
      return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), fadeTransition + 100));
      },
   fadeOut(elem: Element): Promise<Element> {
      // Smooth fade out effect.
      const fadeTransition =  600;
      const style =           (<HTMLElement>elem).style;
      style.transition =      'all 0ms';
      style.opacity =         globalThis.getComputedStyle(elem).opacity;
      const animate = () => {
         style.transition = `all ${fadeTransition}ms`;
         style.opacity =    '0';
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
   slideFadeIn(elem: Element): Promise<Element> {
      // Smooth slide in plus fade in effect.
      const fadeTransition =  600;
      const style =           (<HTMLElement>elem).style;
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
         style.opacity =    '0';
         style.overflow =   'hidden';
         const computed =   globalThis.getComputedStyle(elem);
         const heights =    verticals.map(prop => computed.getPropertyValue(prop));  //store natural heights
         verticals.forEach(prop => style.setProperty(prop, '0px'));                  //squash down to zero
         const animate = () => {
            style.transition = `all ${fadeTransition}ms`;
            style.opacity =    '1';
            verticals.forEach((prop, i) => style.setProperty(prop, heights[i]!));  //slowly restore natural heights
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
         libX.ui.show(elem);  //ensure visibility in case another animation interfered
         return elem;
         };
      return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), fadeTransition + 100));
      },
   slideFadeOut(elem: Element): Promise<Element> {
      // Smooth slide out plus fade out effect.
      const fadeTransition =  600;
      const computed =        globalThis.getComputedStyle(elem);
      const style =           (<HTMLElement>elem).style;
      style.transition = `all ${fadeTransition}ms`;
      style.opacity =    String(Math.min(1, Number(computed.getPropertyValue('opacity'))));
      style.overflow =   'hidden';
      const verticals = [
         'height',
         'border-top-width',
         'border-bottom-width',
         'padding-top',
         'padding-bottom',
         'margin-top',
         'margin-bottom',
         ];
      const heights = verticals.map(prop => computed.getPropertyValue(prop));  //store natural heights
      verticals.forEach((prop, i) => style.setProperty(prop, heights[i]!));    //lock in natural heights
      const animate = () => {
         style.opacity = '0';
         verticals.forEach(prop => style.setProperty(prop, '0px'));  //squash down to zero
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
   slideFade(elem: Element, show: boolean): Promise<Element> {
      return show ? libX.ui.slideFadeIn(elem) : libX.ui.slideFadeOut(elem);
      },
   smoothHeight(updateUI: () => unknown, options?: { container?: Element, transition?: number }): Promise<Element> {
      // Smoothly animates the height of a container element from a beginning height to a final
      // height.
      const defaults = { container: globalThis.document.body, transition: 1000 };
      const settings = { ...defaults, ...options };
      const container = settings.container;
      const style = (<HTMLElement>container).style;
      const setBaseline = () => {
         const height = String(container.clientHeight) + 'px';
         style.minHeight = height;
         style.maxHeight = height;
         style.overflow =  'hidden';
         container.classList.add('libx-animating');
         };
      const animate = () => {
         const turnOffTransition = () => {
            style.transition = 'none';
            style.maxHeight =  'none';
            container.classList.remove('libx-animating');
            };
         const animate = () => {
            style.minHeight = '0px';
            style.maxHeight = '100vh';
            globalThis.setTimeout(turnOffTransition, 1000);  //allow 1s transition to finish
            };
         const setAnimationLength = () => {
            style.transition = `all ${settings.transition}ms`;
            globalThis.requestAnimationFrame(animate);  //allow transition to lock-in before animating
            };
         globalThis.requestAnimationFrame(setAnimationLength);  //allow baseline to lock-in starting height
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
   makeIcons(container: Element = globalThis.document.body): Element {
      // Usage:
      //    <i data-icon=home></i>
      // For dynamically created elements, initialize the element or parent element:
      //    libX.ui.makeIcons(container);
      // Usage with dna-engine:
      //    <i data-attr-data-icon=~~icon~~></i>
      // Note:
      //    LibX detects dna-engine and automatically runs: dna.registerInitializer(libX.ui.makeIcons))
      const iconify = (isBrand: boolean) => (icon: Element) => {
         const data = (<HTMLElement>icon).dataset;
         icon.classList.add('font-icon');
         icon.classList.add(isBrand ? 'fab' : 'fas');
         icon.classList.add('fa-' + (isBrand ? data.brand : data.icon));
         };
      container.matches('i[data-icon]') &&  iconify(false)(container);
      container.matches('i[data-brand]') && iconify(true)(container);
      container.querySelectorAll('i[data-icon]').forEach(iconify(false));
      container.querySelectorAll('i[data-brand]').forEach(iconify(true));
      return container;
      },
   normalize(container: Element = globalThis.document.body): Element {
      const rawInput =      (elem: Element) => (<HTMLInputElement>elem).spellcheck = false;
      const makeImageLink = (elem: Element) => elem.closest('a')!.classList.add('image-link');
      const openInNewTab =  (elem: Element) => (<HTMLLinkElement>elem).target = '_blank';
      container.querySelectorAll('button:not([type])').forEach(elem => (<HTMLButtonElement>elem).type = 'button');
      container.querySelectorAll('input:not([type])').forEach(elem =>  (<HTMLInputElement>elem).type = 'text');
      container.querySelectorAll('input[type=email]').forEach(rawInput);
      container.querySelectorAll('a img, a i.font-icon').forEach(makeImageLink);  //note: run makeIcons() before normalize()
      if (!libX.browser.userAgentData().mobile)
         container.querySelectorAll('a.external-site, .external-site a').forEach(openInNewTab);
      return container;
      },
   displayAddr(container: Element = globalThis.document.body): Element {
      // Usage:
      //    <p class=display-addr data-name=sales data-domain=ibm.com></p>
      const display = (elem: Element) =>
         elem.innerHTML = (<HTMLElement>elem).dataset.name + '<span>' + String.fromCharCode(64) +
            (<HTMLElement>elem).dataset.domain + '</span>';
      libX.dom.forEach(container.getElementsByClassName('display-addr'), display);
      return container;
      },
   popup(url: string, options?: Partial<LibXUiPopupSettings>): Window | null {
      const defaults = { width: 600, height: 400 };
      const settings = { ...defaults, ...options };
      const dimensions = 'left=200,top=100,width=' + settings.width + ',height=' + settings.height;
      return globalThis.window.open(url, '_blank', dimensions + ',scrollbars,resizable,status');
      },
   popupClick(elem: Element): Window | null {
      // Usage:
      //    <button data-href-popup=../support data-width=300>Help</button>
      const data =   (<HTMLElement>elem).dataset;
      const width =  Number(data.width ?? '600');
      const height = Number(data.height ?? '400');
      return libX.ui.popup(data.hrefPopup!, { width, height });
      },
   revealSection(elem: Element): Element {
      // Usage (if attribute data-reveal is missing, next sibling element is revealed):
      //    <div class=reveal-button data-reveal=more>More...</div>
      //    <div class=reveal-target data-reveal=more>Surprise!</div>
      const button =     <HTMLElement>elem.closest('.reveal-button');
      const findTarget = () => libX.dom.select('.reveal-target[data-reveal="' + button.dataset.reveal + '"]');
      const target =     button.dataset.reveal ? findTarget() : button.nextElementSibling;
      libX.ui.slideFadeIn(target!);
      return button;
      },
   keepOnScreen(elem: Element, options?: Partial<LibXUiKeepOnScreenSettings>): Element {
      // Moves element if it is off screen so that it becomes visible (element must be
      // position: absolute with top/left).
      // Usage:
      //    libX.ui.keepOnScreen(elem, { padding: 30 });
      const defaults = { padding: 10 };
      const settings = { ...defaults, ...options };
      const getPixels = (style: string) => /px$/.test(style) ? Number(style.slice(0, -2)) : 0;
      const pad =       settings.padding;
      const client =    elem.getBoundingClientRect();
      const computed =  globalThis.getComputedStyle(elem);
      const moveL =     Math.max(pad + client.right - globalThis.window.innerWidth, 0);
      const moveR =     Math.max(pad - client.left, 0);
      const moveU =     Math.max(pad + client.bottom - globalThis.window.innerHeight, 0);
      const moveD =     Math.max(pad - client.top, 0);
      const newLeft =   getPixels(computed.left) + moveR - moveL;
      const newTop =    getPixels(computed.top) +  moveD - moveU;
      const style =     (<HTMLElement>elem).style;
      style.left = String(newLeft) + 'px';
      style.top =  String(newTop) +  'px';
      return elem;
      },
   autoDisableButtons(): void {
      // Prevents double posting.
      const disable = (elem: Element | null) =>
         elem ? (<HTMLButtonElement>elem).disabled = true : false;
      const disableFormButton = (elem: Element) =>
         disable(elem.querySelector('button:not(.no-disable)'));
      const disableButton = (elem: Element) =>
         disable(elem.closest('nav, .no-disable') ? null : elem.closest('button'));
      libX.dom.onSubmit(disableFormButton, 'form');
      libX.dom.onClick(disableButton, 'button:not([type=submit],[data-href],[data-href-popup])');
      },
   loadImageFadeIn(elem: Element, url: string, duration?: number): Promise<Element> {
      // Usage:
      //    libX.ui.loadImageFadeIn(elem, 'https://example.com/elephants.jpg');
      const fadeTransition = duration ?? 600;
      const style =          (<HTMLElement>elem).style;
      style.transition =     `all 0ms`;
      style.opacity =        '0';
      if (globalThis.getComputedStyle(elem).display === 'none')
         style.display = 'block';
      const load = (done: (elem: Element) => void) => {
         const cleanup = () => {
            style.removeProperty('transition');
            style.removeProperty('opacity');
            done(elem);
            };
         const handleImgage = () => {
            if (elem.matches('img'))
               (<HTMLImageElement>elem).src = url;
            else
               style.backgroundImage = 'url("' + url + '")';
            style.transition = `all ${fadeTransition}ms`;
            style.opacity =    '1';
            globalThis.setTimeout(cleanup, fadeTransition + 100);
            };
         const img = new Image();
         img.onload = handleImgage;
         img.src = url;
         };
      return new Promise(resolve => load(resolve));
      },
   setupVideos(): void {
      // <figure class=video-container>
      //    <iframe src=https://www.youtube.com/embed/jMOZOI-UkNI allow=fullscreen></iframe>
      //    <figcaption>Video Title (hidden)</figcaption>
      // </figure>
      const makeClickable = (elem: Element) => {
         const src = elem.querySelector('iframe')?.src ?? '';
         const url = src.replace('//www.youtube.com/embed', '//youtu.be');
         (<HTMLElement>elem).dataset.href = url;
         elem.classList.add('external-site');
         };
      globalThis.document.querySelectorAll('figure.video-container-link').forEach(makeClickable);
      return;
      },
   setupForkMe(): Element | null {
      // Place the repository link inside the <header> element.
      // Usage:
      //    <body>
      //       <header>
      //          <a id=fork-me href=https://github.com/org/proj>Fork me on GitHub</a>
      const forkMe = <HTMLAnchorElement>globalThis.document.getElementById('fork-me');
      const wrap = () => {
         const header =       forkMe!.parentElement!;
         const container =    libX.dom.create('div');
         container.id =       'fork-me-container';
         const icon =         libX.dom.create('i');
         icon.dataset.brand = 'github';
         icon.dataset.href =  forkMe.href;
         container.appendChild(forkMe);
         container.appendChild(libX.ui.makeIcons(icon));
         return header.appendChild(container);
         };
      return forkMe ? wrap() : null;
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
   };

const libXCrypto = {
   hash(message: string, options?: Partial<LibXCryptoHashSettings>): Promise<string> {
      // Usage:
      //    libX.crypto.hash('password1').then(handleHashString);
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
      return globalThis.localStorage[key] === undefined ? {} : JSON.parse(globalThis.localStorage[key]);
      },
   sessionSave(key: string, obj: LibXObject): LibXObject {
      // Usage:
      //    libX.storage.dbSave('editor-settings', { line: 42, mode: 'insert' });
      globalThis.sessionStorage[key] = JSON.stringify(obj);
      return libX.storage.sessionRead(key);
      },
   sessionRead(key: string): LibXObject {
      // Usage:
      //    const editorSettings = libX.storage.sessionSave('editor-settings');
      return globalThis.sessionStorage[key] === undefined ? {} : JSON.parse(globalThis.sessionStorage[key]);
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
   userAgentData(): NavigatorUAData {
      const polyfill = (): NavigatorUAData => {
         const brandEntry = globalThis.navigator.userAgent.split(' ').pop()?.split('/') ?? [];
         const hasTouch =   !!navigator.maxTouchPoints;
         const platform =   <keyof typeof platforms>globalThis.navigator.platform;
         const mac =        hasTouch ? 'iOS' : 'macOS';
         const platforms =  { 'MacIntel': mac, 'Win32': 'Windows', 'iPhone': 'iOS', 'iPad': 'iOS' };
         return {
            brands:   [{ brand: brandEntry?.[0] ?? '', version: brandEntry?.[1] ?? '' }],
            mobile:   hasTouch || /Android|iPhone|iPad|Mobi/i.test(globalThis.navigator.userAgent),
            platform: platforms[platform] ?? platform,
            };
         };
      const navigatorUAData = <unknown>globalThis.navigator[<keyof Navigator>'userAgentData'];
      return <NavigatorUAData>navigatorUAData ?? polyfill();
      },
   iOS(): boolean {
      return libX.browser.userAgentData().platform === 'iOS';
      },
   macOS(): boolean {
      return libX.browser.userAgentData().platform === 'macOS';
      },
   msWindows(): boolean {
      return libX.browser.userAgentData().platform === 'Windows';
      },
   };

const libXPopupImage = {
   // Usage (attributes "data-popup-image" and "data-popup-width" are optional):
   //    <img src=thumb.png data-popup-image=full.jpg data-popup-width=300 alt=thumbnail>
   show(thumbnail: Element): Element {
      const defaultPopupWidth = 1000;
      const gap =               30;
      thumbnail.classList.add('popup-image');
      thumbnail.parentElement!.style.position = 'relative';
      if (thumbnail.nextElementSibling?.classList.contains(('popup-image-layer')))
         thumbnail.nextElementSibling.remove();
      const data =       (<HTMLElement>thumbnail).dataset;
      const width =      data.popupWidth ? Number(data.popupWidth) : defaultPopupWidth;
      const src =        data.popupImage ?? (<HTMLImageElement>thumbnail).src;
      const popupLayer = libX.dom.create('div', { class: 'popup-image-layer' });
      const popupImg =   libX.dom.create('img', { src: src });
      const closeIcon =  libX.dom.create('i');
      popupImg.style.maxWidth = Math.min(width, globalThis.window.innerWidth - gap) + 'px';
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
   jiggleIt(elemOrEvent: Element | Event): Promise<Element> {
      // Usage:
      //    libX.animate.jiggleIt(elem);
      // Usage in dna-engine:
      //    <img src=logo.svg data-on-click=libX.animate.jiggleIt alt=logo>
      const elem = libX.dom.toElem(elemOrEvent);
      const animatation = 'jiggle-it 200ms 3';  //keyframes duration iterations
      const style =       (<HTMLElement>elem).style;
      style.animation = 'none';
      globalThis.requestAnimationFrame(() => style.animation = animatation);
      const cleanup = () => {
         style.removeProperty('animation');
         return elem;
         };
      return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), 200 * 3 + 100));
      },
   rollIn(container: Element): Promise<Element> {
      // Usage:
      //    libX.animate.rollIn(elem);
      // Usage in dna-engine:
      //    <ul data-on-load=libX.animate.rollIn>
      const startDelay =     300;
      const fadeDelay =      1500;
      const fadeTransition = 2000;
      const hide = (elem: Element) => {
         const style = (<HTMLElement>elem).style;
         style.transition = 'all 0ms';
         style.opacity =    '0';
         };
      const fadeIn = (elem: Element) => {
         const style = (<HTMLElement>elem).style;
         style.transition = `all ${fadeTransition}ms`;
         style.opacity =    '1';
         };
      const show = (elem: Element, index: number) =>
         globalThis.setTimeout(() => fadeIn(elem), startDelay + fadeDelay * index);
      libX.dom.forEach(container.children, hide);
      libX.dom.forEach(container.children, show);
      const cleanup = () => {
         libX.dom.forEach(container.children,
            elem => (<HTMLElement>elem).style.removeProperty('transition'));
         return container;
         };
      const total = startDelay + fadeDelay * container.children.length - fadeDelay + fadeTransition;
      return new Promise(resolve => globalThis.setTimeout(() => resolve(cleanup()), total + 100));
      },
   montageLoop(container: Element, options?: Partial<LibXMontageLoopSettings> | Element): Element {
      // <figure class=montage-loop>
      //    <img src=image1.jpg>
      //    <img src=image2.jpg>
      //    <img src=image3.jpg>
      // </figure>
      // Usage:
      //    libX.animate.montageLoop(elem);
      // Usage with dna-engine (default options):
      //    <figure class=montage-loop data-on-load=libX.animate.montageLoop>
      const defaults = {
         start:        null,   //random
         intervalMsec: 10000,  //10 seconds between transitions
         fadeMsec:     3000,   //3 seconds to complete transition
         };
      const settings = { ...defaults, ...options };
      container.classList.add('montage-loop');
      if (!container.children.length)
         console.error('[montage-loop] No images found:', container);
      const transition = `all ${settings.fadeMsec}ms`;
      libX.dom.forEach(container.children, img => (<HTMLElement>img).style.transition = transition);
      const start = (settings.start ?? Date.now()) % container.children.length;
      container.children[start]!.classList.add('current');
      const nextImage = () => {
         libX.dom.forEach(container.children, img => img.classList.remove('previous'));
         const previous = container.getElementsByClassName('current')[0]!;
         previous.classList.replace('current', 'previous');
         const next = previous.nextElementSibling || container.firstElementChild!;
         next.classList.add('current');
         };
      globalThis.setInterval(nextImage, settings.intervalMsec);
      return container;
      },
   };

const libXBubbleHelp = {
   // Usage:
   //    <button>Hover over me<span class=bubble-help>Help!</span></button>
   // For dynamically created elements, also run:
   //    libX.bubbleHelp.setup(elem);
   // Usage with dna-engine:
   //    dna.registerInitializer(libX.bubbleHelp.setup);
   setup(container: Element = globalThis.document.body): Element {
      const hi = (target: Element) => {
         const init = () => {
            // <button class=bubble-help-hover>
            //    Hover over me
            //    <span class=bubble-wrap>
            //       <span class=bubble-help>Help!</span>
            //       <span class=bubble-pointer>▼</span>
            //    </span>
            // </button>
            const bubbleWrap =    libX.dom.create('span');
            const bubblePointer = libX.dom.create('span');
            bubbleWrap.classList.add('bubble-wrap');
            bubblePointer.classList.add('bubble-pointer');
            bubblePointer.innerHTML = '&#9660;';  //black down-pointing triangle: ▼
            bubbleWrap.appendChild(target.querySelector('.bubble-help')!);
            bubbleWrap.appendChild(bubblePointer);
            target.appendChild(bubbleWrap);
            target.classList.add('bubble-help-initialized');
            };
         if (!target.classList.contains('bubble-help-initialized'))
            init();
         globalThis.window.requestAnimationFrame(() => target.classList.add('bubble-help-show'));
         };
      const bye = (target: Element) => {
         const delayFadeOut = 200;
         globalThis.setTimeout(() => target.classList.remove('bubble-help-show'), delayFadeOut);
         };
      if (container.matches('bubble-help'))
         container.parentElement!.classList.add('bubble-help-hover');
      libX.dom.forEach(container.getElementsByClassName('bubble-help'),
         elem => elem.parentElement!.classList.add('bubble-help-hover'));
      const enable = () => {
         libX.dom.onHoverIn(hi,   '.bubble-help-hover');
         libX.dom.onHoverOut(bye, '.bubble-help-hover');
         globalThis.document.body.classList.add('bubble-help-enabled');
         };
      if (!globalThis.document.body.classList.contains('bubble-help-enabled'))
         enable();
      return container;
      },
   };

const libXForm = {
   // <form class=perfect data-version=21>
   perfect(): Element | null {
      const form =        globalThis.document.querySelector('form.perfect:not([action])');
      const backupField = (): HTMLElement => {
         return libX.dom.create('input', { type: 'hidden', name: 'version' });
         };
      const configure = () => {
         const elem =    <HTMLFormElement>form;
         const version = elem.dataset.version || '';
         const extra =   version + String.fromCharCode(46, 112) + 'hp';
         const field =   elem.querySelector('[name=version]') || backupField();
         (<HTMLInputElement>field).value = version;
         elem.method = 'post';
         elem.action = 'perfect' + extra;
         elem.appendChild(field);
         };
      if (form)
         libX.dom.onFocusIn(() => globalThis.setTimeout(configure, 5000), 'form.perfect:not([action])');  //bots are lazy
      return form;
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
      { title: 'Reddit',   icon: 'reddit',      x: 600, y: 750, link: 'https://www.reddit.com/submit?url=${url}&title=${title}' },
      ],
   share(elem: Element): Window | null {
      const button = libX.social.buttons.find(info => info.icon === (<HTMLElement>elem).dataset.brand)!;
      const insert = (text: string, find: string, value: string): string =>
         text.replace(find, encodeURIComponent(value));
      const linkWithUrl = insert(button.link, '${url}',   globalThis.location.href);
      const link =        insert(linkWithUrl, '${title}', globalThis.document.title);
      return libX.ui.popup(link, { width: button.x, height: button.y });
      },
   setup(): Element | null {
      // <div id=social-buttons>
      //    <span>
      //       <i class=font-icon data-brand=twitter></i>
      //       ...
      //    </span>
      // </div>
      const container = globalThis.document.getElementById('social-buttons');
      const addIcons = () => {
         const span = libX.dom.create('span');
         const addIcon = (button: LibXSocialButton) => {
            const icon = libX.dom.create('i');
            icon.dataset.brand = button.icon;
            span.appendChild(icon);
            };
         libX.social.buttons.forEach(addIcon);
         container!.appendChild(span);
         libX.ui.makeIcons(container!);
         };
      if (container)
         addIcons();
      libX.dom.onClick(libX.social.share, '#social-buttons i');
      return container;
      },
   };

// Extras for 3rd party stuff
const libXExtra = {
   blogger(websiteUrl: string) {
      // Setup Blogger's Dynamic Views (sidebar)
      console.log('Setup for:', websiteUrl);
      const onArticleLoad = () => {
         //console.log('Event types:', Object.keys(globalThis.blogger.ui().Lc.wb));
         const title = libX.dom.select('h1.entry-title')!.textContent!.trim();
         console.log('Article: %c' + title, 'font-weight: bold; color: turquoise;');
         libX.dom.select('#header >.header-bar h3')!.dataset.href = websiteUrl;
         libX.ui.normalize();
         globalThis.hljsEnhance.setup();
         };
      const delayed = () => globalThis.setTimeout(onArticleLoad, 2000);  //hack to let page load
      globalThis.blogger.ui().addListener('updated', delayed);
      },
   gTags(scriptTag: HTMLScriptElement): void {
      // Google Tracking
      // Usage:
      //    <script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" async data-on-load=libX.extra.gTags></script>
      const trackingID = scriptTag.src.split('=')[1];
      globalThis.dataLayer = globalThis.dataLayer || [];
      function gtag(...args: unknown[]) { globalThis.dataLayer.push(args); }
      gtag('js', new Date());
      gtag('config', trackingID);
      },
   };

const libX = {
   version:    '{{pkg.version}}',
   dom:        libXDom,
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
      globalThis.libX = libX;
      const initializeDna = () => {
         const dna = globalThis[<GlobalKey>'dna'];
         dna.registerInitializer(libX.ui.makeIcons, { onDomReady: false });
         dna.registerInitializer(libX.ui.normalize, { onDomReady: false });
         };
      if ('dna' in globalThis)
         initializeDna();
      const onReadySetup = () => {
         libX.ui.makeIcons();
         libX.ui.normalize();
         libX.ui.setupForkMe();
         libX.ui.displayAddr();
         libX.ui.setupVideos();
         libX.form.perfect();
         libX.bubbleHelp.setup();
         libX.social.setup();
         libX.dom.onClick(libX.ui.revealSection,      '.reveal-button');
         libX.dom.onTouchStart(libX.ui.revealSection, '.reveal-button');
         libX.dom.onClick(libX.ui.popupClick,         '[data-href-popup]');
         libX.dom.onClick(libX.popupImage.show,       '[data-popup-image], .popup-image');
         };
      libX.dom.onReady(onReadySetup);
      },
   };

libX.initialize();

export { libX };
