//! lib-x.js ~ web-ignition v1.4.3 ~ github.com/center-key/web-ignition ~ MIT License

/// <reference types="jquery" />
declare global {
    interface JQuery {
        id: (name?: string | number) => string | undefined | JQuery;
        enable: (setOn?: boolean) => JQuery;
        disable: (setOff?: boolean) => JQuery;
        findAll: (selector: string) => JQuery;
    }
}
export declare type Json = string | number | boolean | null | undefined | Json[] | {
    [key: string]: Json;
};
export declare type JsonObject = {
    [key: string]: Json;
};
export declare type JsonArray = Json[];
export declare type JsonData = JsonObject | JsonArray;
export declare type LibXObject = {
    [key: string]: unknown;
};
export declare type LibXUiPopupOptions = {
    width?: number;
    height?: number;
};
export declare type LibXCryptoHashOptions = {
    algorithm?: string;
    salt?: string;
};
export declare type LibXUiEnei = JQuery | HTMLElement | JQuery.EventBase | number;
export declare type LibXCounterMap = {
    [counter: string]: number;
};
export declare type LibXSocialButton = {
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
