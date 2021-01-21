//! lib-x.js ~ web-ignition v1.4.1 ~ github.com/center-key/web-ignition ~ MIT License

/// <reference types="jquery" />
declare global {
    interface JQuery {
        id: (name?: string | number) => JQuery;
        enable: (setOn?: boolean) => JQuery;
        disable: (setOff?: boolean) => JQuery;
        findAll: (selector: string) => JQuery;
    }
}
declare type LibXObject = Record<string, unknown>;
declare type LibXUiPopupOptions = {
    width?: number;
    height?: number;
};
declare type LibXCryptoHashOptions = {
    algorithm?: string;
    salt?: string;
};
declare type LibXUiEnei = JQuery | HTMLElement | JQuery.EventBase | number;
declare type LibXCounterMap = Record<string, number>;
declare type LibXSocialButton = {
    title: string;
    icon: string;
    x: number;
    y: number;
    link: string;
};
declare const libX: {
    version: string;
    ui: {
        plugin: {
            id: (name?: string | number | undefined) => string | undefined | JQuery;
            enable: (setOn?: boolean | undefined) => JQuery;
            disable: (setOff?: boolean | undefined) => JQuery;
            findAll: (selector: string) => JQuery;
        };
        toElem(elemOrNodeOrEventOrIndex: LibXUiEnei, that?: JQuery<HTMLElement> | undefined): JQuery;
        makeIcons(holder: JQuery): JQuery;
        normalize(holder?: JQuery<HTMLElement> | undefined): JQuery;
        displayAddr(): JQuery;
        popup(url: string, options?: LibXUiPopupOptions | undefined): Window | null;
        popupClick(event: JQuery.EventBase): Window | null;
        revealSection(event: JQuery.EventBase): JQuery;
        keepOnScreen(elem: JQuery, padding?: number): JQuery;
        autoDisableButtons(): void;
        loadImageFadeIn(elem: JQuery, url: string, duration?: number | undefined): JQuery;
        setupVideos(): void;
        setupForkMe(): JQuery;
    };
    util: {
        cleanupEmail(email: string): string | null;
        isObj(thing: unknown): boolean;
        removeWhitespace(text: string): string;
        details(thing: unknown): string;
        debug(thing: unknown): void;
    };
    crypto: {
        hash(message: string, options?: LibXCryptoHashOptions | undefined): Promise<string>;
    };
    storage: {
        dbSave(key: string, obj: Record<string, unknown>): LibXObject;
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
        macOS(): boolean;
        iOS(): boolean;
    };
    popupImage: {
        show(event: JQuery.EventBase): void;
    };
    animate: {
        jiggleIt(elemOrEvent: JQuery | JQuery.EventBase): JQuery;
        rollIn(holderOrElems: JQuery): number;
    };
    bubbleHelp: {
        setup(holder?: JQuery<HTMLElement> | undefined): JQuery;
    };
    form: {
        perfect(): JQuery;
    };
    social: {
        buttons: LibXSocialButton[];
        share(elem: JQuery): Window | null;
        setup(): JQuery;
    };
    extra: {
        blogger(websiteUrl: string): JQuery;
        gTags(scriptTag: string): void;
    };
    initialize(): void;
};
export { libX };
