class _config {
    loopFn: Function | null = null;
    start: string | null = null;
    duration: number = 0;
    cycleTime: number = 5000;
    diffCycleTime: number = 5000;
    _enabled: boolean = false;
    _handler: Function = null;
    _mode: string = 'sum';
}

class AsyncLoop {
    _config: _config
    preLoopFn: Function | null
    reset: Function = function () {
        this._config = new _config;
        this.preLoopFn = null; //循环前置条件函数，可选，当其结果为true时进入主函数，否则进入下一次循环。
    }
    init: Function = function (loopFn: Function, cycleTime?: number, mode?: string) {
        this.reset();
        let _self_config = this._config;

        // cycleTime 最小为10ms 缺省值为5000ms
        cycleTime = cycleTime === undefined ? 5000 : ((cycleTime < 10) ? 10 : cycleTime);

        _self_config.loopFn = loopFn;
        _self_config.cycleTime = cycleTime;
        _self_config._mode = mode === 'diff' ? mode : 'sum';
        _self_config._handler && clearTimeout(_self_config._handler);
    }
    initJudge: Function = function (preLoopJudgeFn: Function): void {
        this.preLoopFn = function (): boolean {
            if (Boolean(preLoopJudgeFn())) {
                return true;
            }
            return false;
        };
    }
    stop: Function = function (): void {
        this._config._enabled = false;
    }
    start: Function = function (): void {
        this._config._enabled = true;
        this.request(0);
    }
    restart: Function = function (): void {
        this._config._enabled = true;
        this.request(0);
    }
    protected _getDiffTime: Function = function () {
        let _self_config = this._config;
        if (_self_config._mode !== 'diff') { return 0 }
        _self_config.duration = Date.now() - (_self_config.start || Date.now());
        _self_config.diffCycleTime = (_self_config.duration >= _self_config.cycleTime) ? 0 : (_self_config.cycleTime - _self_config.duration);
    }
    request: Function = function (time?: number): void {
        let _self = this;
        let _self_config = this._config;
        if (_self_config._mode === "diff") {
            this._getDiffTime()
        }
        let cycleTime = time === undefined ? (_self_config._mode === "diff" ? _self_config.diffCycleTime : _self_config.cycleTime) : time;

        _self_config._handler && clearTimeout(_self_config._handler);

        _self_config._handler = setTimeout(() => {

            if (_self.preLoopFn && !_self.preLoopFn()) {
                return _self.request();
            }
            if (!_self_config._enabled) { return }

            _self_config.start = Date.now();

            _self_config.loopFn && _self_config.loopFn();

        }, cycleTime);
    }
}

