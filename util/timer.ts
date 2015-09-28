export class Timer {
    target: number = 0;

    base: number = 0;

    last: number = 0;

    pausedAt: number = 0;

    constructor(seconds: number = 0) {
        this.base = Timing.elapsed;
        this.last = Timing.elapsed;

        this.target = seconds;
    }

    set(seconds: number = 0) {
        this.target = seconds;
        this.base = Timing.elapsed;
        this.pausedAt = 0;
    }

    reset() {
        this.base = Timing.elapsed;
        this.pausedAt = 0;
    }

    tick(): number {
        var delta = Timing.elapsed - this.last;
        this.last = Timing.elapsed;
        return (this.pausedAt ? 0 : delta);
    }

    pause() {
        if (!this.pausedAt) {
            this.pausedAt = Timing.elapsed;
        }
    }

    unpause() {
        if (this.pausedAt) {
            this.base += Timing.elapsed - this.pausedAt;
            this.pausedAt = 0;
        }
    }

    get delta(): number {
        return (this.pausedAt || Timing.elapsed) - this.base - this.target;
    }

    get isExpired(): boolean {
        return this.delta > 0;
    }

    get isPaused(): boolean {
        return this.pausedAt > 0;
    }
}

class GlobalTiming {
    _scale: number = 1.0;
    _last: number = 0;
    _maxStep: number = 0.05;

    startTime;
    elapsed: number;
    frameTime: number;
    timestamp: number;

    constructor() {
        this.startTime = new Date();

        this.elapsed = this.frameTime = Number.MIN_VALUE;
    }

    step() {
        var current = window.performance.now(),
            frame = (current - this._last) / 1000.0;

        this.timestamp = current;
        this.frameTime = Math.min(frame, this._maxStep) * this._scale;
        this.elapsed += this.frameTime;
        this._last = current;
    }
}

export var Timing = new GlobalTiming();
