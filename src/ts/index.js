var _config = /** @class */ (function () {
    function _config() {
        this.loopFn = null;
        this.start = null;
        this.duration = 0;
        this.cycleTime = 5000;
        this.diffCycleTime = 5000;
        this._enabled = false;
        this._handler = null;
        this._mode = 'sum';
    }
    return _config;
}());
var AsyncLoop = /** @class */ (function () {
    function AsyncLoop() {
        this.reset = function () {
            this._config = new _config;
            this.preLoopFn = null; //循环前置条件函数，可选，当其结果为true时进入主函数，否则进入下一次循环。
        };
        this.init = function (loopFn, cycleTime, mode) {
            this.reset();
            var _self_config = this._config;
            // cycleTime 最小为10ms 缺省值为5000ms
            cycleTime = cycleTime === undefined ? 5000 : ((cycleTime < 10) ? 10 : cycleTime);
            _self_config.loopFn = loopFn;
            _self_config.cycleTime = cycleTime;
            _self_config._mode = mode === 'diff' ? mode : 'sum';
            _self_config._handler && clearTimeout(_self_config._handler);
        };
        this.initJudge = function (preLoopJudgeFn) {
            this.preLoopFn = function () {
                if (Boolean(preLoopJudgeFn())) {
                    return true;
                }
                return false;
            };
        };
        this.stop = function () {
            this._config._enabled = false;
        };
        this.start = function () {
            this._config._enabled = true;
            this.request(0);
        };
        this.restart = function () {
            this._config._enabled = true;
            this.request(0);
        };
        this._getDiffTime = function () {
            var _self_config = this._config;
            if (_self_config._mode !== 'diff') {
                return 0;
            }
            _self_config.duration = Date.now() - (_self_config.start || Date.now());
            _self_config.diffCycleTime = (_self_config.duration >= _self_config.cycleTime) ? 0 : (_self_config.cycleTime - _self_config.duration);
        };
        this.request = function (time) {
            var _self = this;
            var _self_config = this._config;
            if (_self_config._mode === "diff") {
                this._getDiffTime();
            }
            var cycleTime = time === undefined ? (_self_config._mode === "diff" ? _self_config.diffCycleTime : _self_config.cycleTime) : time;
            _self_config._handler && clearTimeout(_self_config._handler);
            _self_config._handler = setTimeout(function () {
                if (_self.preLoopFn && !_self.preLoopFn()) {
                    return _self.request();
                }
                if (!_self_config._enabled) {
                    return;
                }
                _self_config.start = Date.now();
                _self_config.loopFn && _self_config.loopFn();
            }, cycleTime);
        };
    }
    return AsyncLoop;
}());
