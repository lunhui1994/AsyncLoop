
 function AsyncLoop() {
    this._config = {
        loopFn: null, //循环主函数
        start: null,  //diff模式下用来计算函数开始执行的时间点
        duration: null, //diff模式下用来计算函数开始执行的时间段
        cycleTime: null,    //循环时间
        diffCycleTime: null,    //diff模式下计算后的循环时间
        _enabled: false,  //控制是否开启循环
        _handler: null, // 定时器函数
        _mode: 'sum' // diff 差
    }
    this.preLoopFn = null; //循环前置条件函数，可选，当其结果为true时进入主函数，否则进入下一次循环。
}

//init 初始化 loopFn， cycleTime， mode(可选)

AsyncLoop.prototype.init = function (loopFn, cycleTime, mode) {
    this._config.loopFn = loopFn;
    this._config.cycleTime = cycleTime;
    this._config._mode = mode === 'diff' ? mode : 'sum';
    this._config._enabled = true;
    this._config._handler && clearTimeout(this._config._handler);
}

//initJudge 初始化前置条件函数(可选)

AsyncLoop.prototype.initJudge = function (preLoopJudgeFn) {
    this.preLoopFn = function () {
        if (Boolean(preLoopJudgeFn())) {
            return true;
        }
        return false;
    };
}
//stop 暂停
AsyncLoop.prototype.stop = function () {
    this._config._enabled = false;
}
//restart 重新开始
AsyncLoop.prototype.restart = function () {
    this._config._enabled = true;
    this.request(0);
}
//_getDiffTime 内部函数 计算diff模式下的循环时间
AsyncLoop.prototype._getDiffTime = function () {
    this._config.duration = new Date().getTime() - (this._config.start || new Date().getTime());
    this._config.diffCycleTime = (this._config.duration >= this._config.cycleTime) ? 0 : (this._config.cycleTime - this._config.duration);
}

//request 发起循环
AsyncLoop.prototype.request = function (time) {

    // diff 
    if (this._config._mode === "diff") {
        this._getDiffTime()
    }
    // request(time)指定的时间优先级最高
    let cycleTime = time === undefined ? (this._config._mode === "diff" ? this._config.diffCycleTime : this._config.cycleTime) : time;

    // 清除
    this._config._handler && clearTimeout(this._config._handler);
    
    // 定时器
    this._config._handler = setTimeout(() => {

        // 前置条件判断
        if (this.preLoopFn && !this.preLoopFn()) {
            return this.request();
        }
        // 暂停判断
        if (!this._config._enabled) { return }

        // 获取函数执行开始时间
        this._config.start = new Date().getTime();
        
        // 执行主函数
        this._config.loopFn && this._config.loopFn();

    }, cycleTime);
}

// export default AsyncLoop