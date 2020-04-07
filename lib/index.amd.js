define(function () { 'use strict';

    function AsyncLoop() {
        this.reset();
    }

    AsyncLoop.prototype.reset = function () {
        this._config = {
            loopFn: null, //循环主函数
            start: null,  //diff模式下用来计算函数开始执行的时间点
            duration: 0, //diff模式下用来计算函数开始执行的时间段
            cycleTime: 5000,    //循环时间
            diffCycleTime: 5000,    //diff模式下计算后的循环时间
            _enabled: false,  //控制是否开启循环
            _handler: null, // 定时器函数
            _mode: 'sum' // diff 差
        };
        this.preLoopFn = null; //循环前置条件函数，可选，当其结果为true时进入主函数，否则进入下一次循环。
    };

    //init 初始化 loopFn， cycleTime， mode(可选)
    AsyncLoop.prototype.init = function (loopFn, cycleTime, mode) {
        this.reset();
        let _self_config = this._config;
        // cycleTime 最小为10ms 缺省值为5000ms
        cycleTime = cycleTime === undefined ? 5000 : ((cycleTime < 10) ? 10 : cycleTime);
        _self_config.loopFn = loopFn;
        _self_config.cycleTime = cycleTime;
        _self_config._mode = mode === 'diff' ? mode : 'sum';
        _self_config._handler && clearTimeout(_self_config._handler);
    };

    //initJudge 初始化前置条件函数(可选)
    AsyncLoop.prototype.initJudge = function (preLoopJudgeFn) {

        if (Object.prototype.toString.call(preLoopJudgeFn) !== "[object Function]") {
            return this.preLoopFn = null;
        }

        this.preLoopFn = function () {
            if (Boolean(preLoopJudgeFn())) {
                return true;
            }
            return false;
        };
    };
    //stop 暂停
    AsyncLoop.prototype.stop = function () {
        this._config._enabled = false;
    };

    //restart 重新开始
    AsyncLoop.prototype.restart = function () {
        this._config._enabled = true;
        this.request(0);
    };

    //restart 开始
    AsyncLoop.prototype.start = function () {
        this._config._enabled = true;
        this.request(0);
    };

    //_getDiffTime 内部函数 计算diff模式下的循环时间
    AsyncLoop.prototype._getDiffTime = function () {
        let _self_config = this._config;
        if (_self_config._mode !== 'diff') { return 0 }
        _self_config.duration = Date.now() - (_self_config.start || Date.now());
        _self_config.diffCycleTime = (_self_config.duration >= _self_config.cycleTime) ? 0 : (_self_config.cycleTime - _self_config.duration);
    };

    //request 发起循环
    AsyncLoop.prototype.request = function (time) {
        let _self = this;
        let _self_config = this._config;
        // diff 
        if (_self_config._mode === "diff") {
            this._getDiffTime();
        }
        // request(time)指定的时间优先级最高
        let cycleTime = time === undefined ? (_self_config._mode === "diff" ? _self_config.diffCycleTime : _self_config.cycleTime) : time;

        // 清除
        _self_config._handler && clearTimeout(_self_config._handler);

        // 定时器
        _self_config._handler = setTimeout(() => {

            // 前置条件判断
            if (_self.preLoopFn && !_self.preLoopFn()) {
                return _self.request();
            }
            // 暂停判断
            if (!_self_config._enabled) { return }

            // 获取函数执行开始时间
            _self_config.start = Date.now();

            // 执行主函数
            _self_config.loopFn && _self_config.loopFn();

        }, cycleTime);
    };

    return AsyncLoop;

});
