// Type definitions for ccapture.js 1.1
// Project: https://github.com/spite/ccapture.js#readme
// Definitions by: Sam Alexander <https://github.com/samalexander>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
export default class CCapture {
    constructor(settings: CCapture.Settings);

    start(): void;

    capture(canvas: HTMLElement): void;

    stop(): void;

    save(cb?: (blob: Blob) => void): void;
}

export abstract class CCFrameEncoder extends CCaptureEncoder {
    settings:CCapture.Settings
    constructor(settings:CCapture.Settings)
}

export abstract class CCaptureEncoder {
  constructor (settings:CCapture.Settings)
  start(canvas:HTMLCanvasElement) : void
  add(canvas:HTMLCanvasElement) : void
  save(cb:(blob:Blob) => void) : void
  dispose() : void
  step() : void
}

export namespace CCapture {
    interface Settings {
        /**
         * Target framerate for the capture
         */
        framerate?: number | undefined;
        /**
         * Super-sampling of frames to create a motion-blurred frame (0 or 1 make no effect)
         */
        motionBlurFrames?: number | undefined;
        format: "webm" | "gif" | "png" | "jpg" | "ffmpegserver";
        /**
         * Quality for webm/jpg
         */
        quality?: number | undefined;
        /**
         * Name of the files to be exported. if no name is provided, a GUID will be generated
         */
        name?: string | undefined;
        /**
         * Dumps info on the console
         */
        verbose?: boolean | undefined;
        /**
         * Adds a widget with capturing info
         */
        display?: boolean | undefined;
        /**
         * Automatically stops and downloads when reaching that time (seconds).
         * Very convenient for long captures: set it and forget it (remember autoSaveTime!)
         */
        timeLimit?: number | undefined;
        /**
         * It will automatically download the captured data every n seconds (only available for webm/png/jpg)
         */
        autoSaveTime?: number | undefined;
        /**
         * Skip to that mark (seconds)
         */
        startTime?: number | undefined;
        /**
         * Path to the gif worker script
         */
        workersPath?: string | undefined;

        syncVideo?: HTMLVideoElement;

        /* used for ffmpegserver */
        url?: string|undefined;
        codec?: string|undefined;
        extension?: string|undefined
	    onFFMpegServerConnected?: () => void;
        onFFMpegServerStarted?: () => void;

        /* used for custom video encoder */
        customEncoder?: (new (settings:Settings) => CCaptureEncoder)|undefined
        outputPath?: string|undefined
        sourcePath?: string|undefined
    }
}
