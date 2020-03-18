# 说明

1. index.html 中即为使用用例。推荐测试

2. 代码中也有详细注释。

3. 可进行二次加工修改以符合个人使用。

4. sum && diff 周期时序图

    1. sum模式周期时序图 500ms为例
    ```
    rfn########---------------rfn##---------------rfn########################---------------rfn####
    -----------500ms##########-----500ms##########---------------------------500ms##########
    ```
    2. diff模式周期时序图 500ms为例
    ```
    rfn########----rfn############rfn########################rfn####--------rfn######------rfn####
    500ms##########500ms##########500ms##########------------500ms##########500ms##########
    ```

## 语法

` let myInterval = new AsyncLoop() `

## Api

### 1. init 

> init 初始化 loopFn， cycleTime， mode(可选)

#### 语法：

` myInterval.init(loopFn, cycleTime [, mode]) `

#### 使用方法一

```
function timeoutFn() {
            // 模拟异步函数
            setTimeout(function(){

                // 异步回调...

                myInterval.request(); //需要在循环函数尾部调起下次循环

            }, 2000)

        }

myInterval.init(() => {

            timeoutFn();

        }, 5000, 'diff');

```

#### 使用方法二

```
function timeoutFn() {
            // 模拟异步函数
            return new Promise((resolve) => {
                setTimeout(function(){

                    // 异步回调...

                    resolve()

                }, 2000)
            })
        }

myInterval.init(async () => {

            await timeoutFn();

            myInterval.request();

        }, 5000, 'diff');

```

#### loopFn
你需要循环的异步函数

#### cycleTime
> 基本循环周期：**sum**模式下为`loopFnTime + cycleTime`, **diff**模式下为` max(loopFntime, cycleTime);` 

> loopFnTime 为异步函数执行时间

#### mode (可选)
> 循环模式：分为**sum**和**diff**模式,默认为**sum**

    1. sum模式周期时序图 500ms为例
        rfn########---------------rfn##---------------rfn########################---------------rfn####
        -----------500ms##########-----500ms##########---------------------------500ms##########

    2. diff模式周期时序图 500ms为例
        rfn########----rfn############rfn########################rfn####--------rfn######------rfn####
        500ms##########500ms##########500ms##########------------500ms##########500ms##########

> **rfn########** 为异步函数执行；**500ms##########** 为基准周期；

### 2. request 

> 主功能函数, 相当于调用一次循环;需要写在异步函数尾部,具体看init的使用方式。

#### 语法：
` myInterval.request([time]) `

#### 使用

` myInterval.request(0) ` 表示立即调用一次循环

#### time (可选)

> 会在time时间后调用异步函数，如缺省则使用初始化时的循环周期。

### 3. initJudge

> **initJudge** 初始化前置条件函数，默认为**null**，当其返回结果为**true**时进入主函数，否则不执行**loopFn**直接进入下一次循环。

#### 语法

` myInterval.initJudge(JudgeFn);`

#### 使用

```
let list = [1, 2, 3];
myInterval.initJudge(function() {
            return list.length > 2;
        });
```

### start

> **start** 开始循环

#### 使用
```
myInterval.start();

```

### stop

> **stop** 停止循环

#### 使用
```
myInterval.stop();
```

### restart

> **restart** 重启循环。

#### 使用
```
myInterval.restart();
```