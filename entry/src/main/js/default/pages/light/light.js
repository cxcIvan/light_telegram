import morseCode from "../../common/morseCode.js"
import brightness from '@system.brightness';
import router from '@system.router';
const chipTime = 250 // 最小时间粒度，用于定时器检查是否需要修改当前class
export default {
    data: {
        color: "white",
        classType: "container",
        countdownTime: 3, // 倒计时秒数
        sourceWords: [], // 原文例如 SOS
        // indexOfWord: 0, // 遍历当前原文 sourceWords 的下标
        targetCodes: [], // 从原文解码的摩尔斯电码 例如 000111000
        indexOfCode: 0, // 遍历当前摩尔斯 targetCodes 的下标
        status: "countdown", // 背景默认为黑色,
        shortTime: chipTime * 2, // 短信号亮的时间
        longTime: chipTime * 6, // 长信号亮的时间
        darkTime: chipTime, // 黑的时间,
        totalTime: 0, // 当前状态保持的时间
        timerId: null
    },
    onShow(){
        this.setKeepScreenOn()
    },
    onInit() {
        this.sourceWords = this.words

        this.updateCountdown();
        var clist = []
        for (var i = 0; i < this.sourceWords.length; i++){
            var m = morseCode[this.sourceWords[i]]
            clist = clist.concat(m)
        }

        this.targetCodes = clist
    },
    // 开始倒计时
    updateCountdown(){
        const self = this
        const intervalId = setInterval(function (){
            if(self.countdownTime > 0){
                self.countdownTime--
            }
        }, 1000) // 每隔 1s 倒数减一，

        const timerId = setTimeout(function (){
            self.status = "dark"
            clearInterval(intervalId) // 删除倒计时定时器
            self.toLight()
            self.beginLight()
        }, 3500) // 3秒半之后关闭倒计时，并开始闪烁
        this.timerId = timerId
    },
    beginLight(){
        const self = this
        clearInterval(self.timerId)
        setInterval(function (){ // 定时判定

            if (self.countdownTime <= 0 && self.indexOfCode != null && self.targetCodes.length > 0 && self.targetCodes != null && self.targetCodes.length > 0){
                if (self.indexOfCode < self.targetCodes.length){ // 判断当前摩尔斯电码是否遍历完毕
                    self.totalTime += chipTime // 新增时间
                    var needTime = 0; // 需要等待的发光时间
                    if (self.targetCodes[self.indexOfCode] == 0){ // 短亮
                        needTime = self.shortTime
                    } else if (self.targetCodes[self.indexOfCode] == 1){ // 长亮
                        needTime = self.longTime
                    }

                    if (self.totalTime == needTime){ // 亮灯时间到期
                        self.toDark() // 变暗
                    } else if (self.totalTime == needTime + self.darkTime) { // 亮灯时间和黑暗时间全部到期
                        self.toLight() // 发光
                        self.totalTime = 0
                        self.indexOfCode += 1
                        self.indexOfCode %= self.targetCodes.length
                    }
                }
            }
        }, chipTime)
    },
    toLight(){
        this.status = "light"
    },
    toDark(){
        this.status = "dark"
    },
    setKeepScreenOn() { // 设置屏幕长亮
        brightness.setKeepScreenOn({
            keepScreenOn: true,
            success: function () { console.log('handling set keep screen on success.') },
            fail: function (data, code) { console.log('handling set keep screen on fail, code:' + code + ', data: ' + data);
            },
        });
    },
    onSwipe(swipeEvent){
        if (swipeEvent.direction == "right"){ // 向右滑动回到首页
            router.replace({
                uri: "pages/index/index",
                params: {

                }})
        }
    }
}
