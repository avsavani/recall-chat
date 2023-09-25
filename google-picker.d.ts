// google-picker.d.ts
declare namespace google {
    export namespace auth2 {
        export function init(options: any): Promise<any>;
    }

    export namespace picker {
        export enum ViewId {
            DOCS = 'docs',
            // ... Add other view IDs here ...
        }

        export enum Feature {
            NAV_HIDDEN = 'navHidden',
            MULTISELECT_ENABLED = 'multiSelectEnabled',
            // ... Add other features here ...
        }

        export class View {
            constructor(viewId: ViewId);
            setMimeTypes(mimeTypes: string): void;
        }

        export class PickerBuilder {
            constructor();
            enableFeature(feature: Feature): PickerBuilder;
            setAppId(appId: string): PickerBuilder;
            setOAuthToken(token: string): PickerBuilder;
            addView(view: View): PickerBuilder;
            setDeveloperKey(key: string): PickerBuilder;
            setCallback(callback: (data: any) => void): PickerBuilder;
            build(): Picker;
        }

        export class Picker {
            setVisible(visible: boolean): void;
        }

        export class DocsUploadView extends View {
            constructor();
            // Add any other required methods or properties here
        }
    }

    export function load(apiName: string, callback: (() => void) | {}): void;
}

declare global {
    interface Window {
        google: typeof google;
    }
}

// window.d.ts
declare global {
    interface Window {
        gisLoaded: () => void;
        gapiLoaded: () => void;
    }
}


export { };