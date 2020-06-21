// 对象收编变量


var bird = {
    // 背景图片起始位置
    skyPosition: 0,
    // 背景图片移动步进
    skyStep: 2,
    // 小鸟顶部位置
    birdTop: 220,
    // 点击开始的字体颜色
    startColor: 'blue',
    // init()初始化函数, 调用bird.init()即为调用其中对应的函数
    init: function () {
        this.initData();
        this.animate();
    },
    // initData()进行初始化数据
    initData: function () {
        // 命名时除了父元素命名为el，其余DOM元素在开头加上o，从视觉上可得知该元素为DOM元素
        this.el = document.getElementById('game')
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
    },
    // animate()用于管理所有动画函数
    animate: function () {
        // 引入count计数,利用count%10 判断。背景移动30ms执行一次,小鸟移动300ms执行一次
        var count = 0;
        var self = this;
        // 以下函数都由bird调用,this指向bird
        setInterval(() => {
            self.skyMove();
            count++;
            if (count % 2 === 0) {
                self.birdFly(count);
            }
            if (count % 10 === 0) {
                self.birdJump();
                self.startBound();
            }
        }, 30);

    },

    /** 
     * 天空移动 
     */
    skyMove: function () {
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + 'px'
    },

    /**
     * 小鸟蹦跳
     */
    birdJump: function () {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + 'px';
    },

    /**
    * 小鸟扇翅膀
    */
    // birdFly: function (count) {
    //     this.oBird.style.backgroundPositionX = count % 3 * (-30) + 'px'
    // },
    birdFly: function (count) {

        this.oBird.style.backgroundPositionX = count % 3 * (-30) + 'px'
    },
    /**
    * 点击开始
    */
    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = prevColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-' + prevColor);
        this.oStart.classList.add('start-' + this.startColor);
    }
};
