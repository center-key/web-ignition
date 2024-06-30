//! web-ignition v2.2.5 ~~ https://github.com/center-key/web-ignition ~~ MIT License

export type GlobalKey = keyof typeof globalThis;
export type Json = string | number | boolean | null | undefined | JsonObject | Json[];
export type JsonObject = {
    [key: string]: Json;
};
export type JsonData = JsonObject | Json[];
export type LibXForEachCallback = (elem: Element, index: number) => void;
export type LibXObject = {
    [key: string]: unknown;
};
export type LibXUiPopupSettings = {
    width: number;
    height: number;
};
export type LibXUiKeepOnScreenSettings = {
    padding: number;
};
export type LibXCryptoHashSettings = {
    algorithm: string;
    salt: string;
};
export type LibXCounterMap = {
    [counter: string]: number;
};
export type LibXSocialButton = {
    title: string;
    icon: string;
    x: number;
    y: number;
    link: string;
};
export type LibXEventListener = (elem: Element, event: Event, selector: string | null) => void;
export type LibXSettingsEventsOn = {
    keyFilter: KeyboardEvent["key"] | null;
    selector: string | null;
};
export type LibXMontageLoopSettings = {
    start: number | null;
    intervalMsec: number;
    fadeMsec: number;
};
export type NavigatorUAData = {
    readonly brands: {
        brand: string;
        version: string;
    }[];
    readonly mobile: boolean;
    readonly platform: string;
};
export type LibX = typeof libX;
type Blogger = {
    ui: () => {
        addListener: (type: string, listener: () => void) => void;
        Lc: {
            wb: string[];
        };
    };
};
declare global {
    var blogger: Blogger;
}
declare global {
    var dataLayer: unknown[];
}
declare global {
    var hljsEnhance: {
        setup: () => void;
    };
}
declare global {
    var libX: LibX;
}
declare const libX: {
    version: string;
    dom: {
        stateDepot: {
            [key: string | number | symbol]: unknown;
        }[];
        state(elem: Element): {
            [key: string]: unknown;
            [key: number]: unknown;
            [key: symbol]: unknown;
        };
        cloneState(clone: Element): Element;
        componentState(elem: Element): {
            [key: string]: unknown;
            [key: number]: unknown;
            [key: symbol]: unknown;
        };
        removeState(elem: Element): Element;
        create<K extends keyof HTMLElementTagNameMap | string>(tag: K, options?: {
            id?: string;
            subTags?: string[];
            class?: string;
            href?: string;
            html?: string;
            name?: string;
            rel?: string;
            src?: string;
            text?: string;
            type?: string;
        }): K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : HTMLElement;
        select(selector: string): HTMLElement | null;
        selectAll(selector: string): HTMLElement[];
        hasClass(elems: Element[] | HTMLCollection | NodeListOf<Element>, className: string): boolean;
        toggleClass(elem: Element, className: string, state?: boolean): Element;
        replaceClass(elem: Element, oldName: string, newName: string): Element;
        addClass<T extends Element[] | HTMLCollection | NodeListOf<Element>>(elems: T, className: string): T;
        forEach<T extends HTMLCollection>(elems: T, fn: (elem: Element, index: number, elems: unknown[]) => unknown): T;
        map<T>(elems: HTMLCollection | NodeListOf<Element>, fn: (elem: Element, index: number, elems: unknown[]) => T): T[];
        filter(elems: HTMLCollection | NodeListOf<Element>, fn: (elem: Element, index: number, elems: unknown[]) => unknown): Element[];
        filterBySelector(elems: Element[] | HTMLCollection, selector: string): Element[];
        filterByClass(elems: Element[] | HTMLCollection, ...classNames: string[]): Element[];
        find(elems: HTMLCollection | NodeListOf<Element>, fn: (elem: Element, index?: number, elems?: unknown[]) => boolean): Element | null;
        index(elem: Element): number;
        indexOf(elems: NodeListOf<Element>, elem: Element): number;
        findIndex(elems: HTMLCollection | NodeListOf<Element>, selector: string): number;
        isElem(elem: unknown): boolean;
        getAttrs(elem: Element): Attr[];
        toElem(elemOrEvent: Element | Event): HTMLElement;
        on(type: string, listener: LibXEventListener, options?: Partial<LibXSettingsEventsOn>): void;
        onClick(listener: LibXEventListener, selector?: string): void;
        onChange(listener: LibXEventListener, selector?: string): void;
        onInput(listener: LibXEventListener, selector?: string): void;
        onKeyDown(listener: LibXEventListener, selector?: string): void;
        onKeyUp(listener: LibXEventListener, selector?: string): void;
        onEnterKey(listener: LibXEventListener, selector?: string): void;
        onFocusIn(listener: LibXEventListener, selector?: string): void;
        onFocusOut(listener: LibXEventListener, selector?: string): void;
        onCut(listener: LibXEventListener, selector?: string): void;
        onPaste(listener: LibXEventListener, selector?: string): void;
        onTouchStart(listener: LibXEventListener, selector?: string): void;
        onTouchEnd(listener: LibXEventListener, selector?: string): void;
        onSubmit(listener: LibXEventListener, selector?: string): void;
        onHoverIn(listener: LibXEventListener, selector: string): void;
        onHoverOut(listener: LibXEventListener, selector: string): void;
        onReady(callback: (...args: unknown[]) => unknown, options?: {
            quiet?: boolean;
        }): DocumentReadyState | "browserless";
    };
    ui: {
        isHidden(elem: Element): boolean;
        isVisible(elem: Element): boolean;
        show(elem: Element): Element;
        hide(elem: Element): Element;
        toggle(elem: Element, display: boolean): Element;
        fadeIn(elem: Element): Promise<Element>;
        fadeOut(elem: Element): Promise<Element>;
        slideFadeIn(elem: Element): Promise<Element>;
        slideFadeOut(elem: Element): Promise<Element>;
        slideFade(elem: Element, show: boolean): Promise<Element>;
        smoothHeight(updateUI: () => unknown, options?: {
            container?: Element;
            transition?: number;
        }): Promise<Element>;
        makeIcons(container?: Element): Element;
        normalize(container?: Element): Element;
        displayAddr(container?: Element): Element;
        popup(url: string, options?: Partial<LibXUiPopupSettings>): Window | null;
        popupClick(elem: Element): Window | null;
        revealSection(elem: Element): Element;
        keepOnScreen(elem: Element, options?: Partial<LibXUiKeepOnScreenSettings>): Element;
        autoDisableButtons(): void;
        loadImageFadeIn(elem: Element, url: string, duration?: number): Promise<Element>;
        setupVideos(): void;
        setupForkMe(): Element | null;
        getComponent(elem: Element): Element | null;
    };
    util: {
        cleanupEmail(email: string): string | null;
        isObj(thing: unknown): boolean;
        removeWhitespace(text: string): string;
        assert(ok: boolean | unknown, message: string, info: unknown): void;
    };
    nav: {
        setupLinkMenu(): HTMLElement | null;
    };
    crypto: {
        hash(message: string, options?: Partial<LibXCryptoHashSettings>): Promise<string>;
    };
    storage: {
        dbSave(key: string, obj: LibXObject): LibXObject;
        dbRead(key: string): LibXObject;
        sessionSave(key: string, obj: LibXObject): LibXObject;
        sessionRead(key: string): LibXObject;
    };
    counter: {
        key: string;
        list(): LibXCounterMap;
        get(name?: string): number;
        set(count?: number, name?: string): number;
        reset(name?: string): number;
        increment(name?: string): number;
    };
    browser: {
        userAgentData(): NavigatorUAData;
        iOS(): boolean;
        macOS(): boolean;
        msWindows(): boolean;
        darkModeRequested(): boolean;
    };
    popupImage: {
        show(thumbnail: Element): Element;
    };
    animate: {
        jiggleIt(elemOrEvent: Element | Event): Promise<Element>;
        rollIn(container: Element): Promise<Element>;
        montageLoop(container: Element, options?: Partial<LibXMontageLoopSettings> | Element): Element;
    };
    bubbleHelp: {
        setup(container?: Element): Element;
    };
    form: {
        perfect(): Element | null;
    };
    social: {
        buttons: LibXSocialButton[];
        share(elem: Element): Window | null;
        setup(): Element | null;
    };
    extra: {
        blogger(websiteUrl: string): void;
        gTags(scriptTag: HTMLScriptElement): void;
    };
    initialize(): void;
};
export { libX };
