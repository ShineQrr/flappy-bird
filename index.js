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
    // 触发小鸟飞动的变量,状态表示游戏是否开始
    startFlag: false,
    // 小鸟掉落的步进
    birdStepBy: 0,
    minTop: 0,
    maxTop: 570,

    // init()初始化函数, 调用bird.init()即为调用其中对应的函数
    init() {
        this.initData();
        this.animate();
        this.handle();
    },

    // initData()进行初始化数据
    initData() {
        // 命名时除了父元素命名为el，其余DOM元素在开头加上o，从视觉上可得知该元素为DOM元素
        this.el = document.getElementById('game')
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
    },

    // animate()用于管理所有动画函数
    animate() {
        // 引入count计数,利用count%10 判断。背景移动30ms执行一次,小鸟移动300ms执行一次
        var count = 0;
        var self = this;

        // 以下函数都由bird调用,this指向bird
        this.timer = setInterval(() => {
            self.skyMove();
            if (self.startFlag) {
                this.birdDrop()
            }
            count++;
            if (count % 2 === 0) {
                self.birdFly(count);
            }
            if (count % 10 === 0 && !self.startFlag) {
                self.birdJump();
                self.startBound();
            }
        }, 30);

    },

    /** 
     * 天空移动 
     */
    skyMove() {
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + 'px'
    },

    /**
     * 小鸟蹦跳
     */
    birdJump() {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + 'px';
    },
    /**
    * 小鸟扇翅膀
    */
    birdFly(count) {
        this.oBird.style.backgroundPositionX = count % 3 * (-30) + 'px'
    },
    /**
    * 小鸟掉落
    */
    birdDrop() {
        this.birdTop += ++this.birdStepBy;
        this.oBird.style.top = this.birdTop + 'px';
        // 进行碰撞检测
        this.judgeKnock();
    },
    /**
    * 点击开始
    */
    startBound() {
        var prevColor = this.startColor;
        this.startColor = prevColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-' + prevColor);
        this.oStart.classList.add('start-' + this.startColor);
    },

    // judgeKnock()进行碰撞检测：边界碰撞+柱子碰撞
    judgeKnock() {
        this.judgeBoundary();
        this.judgePipe();
    },
    // 进行边界的碰撞检测
    judgeBoundary() {
        if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
            this.failGame();
        }

    },
    // 进行柱子的碰撞检测
    judgePipe() { },
    // 所有关于事件的函数在handle中执行
    handle() {
        this.handleStart();
    },
    handleStart() {
        var self = this;
        this.oStart.onclick = function () {
            self.startFlag = true;
            self.oStart.style.display = 'none';
            self.oScore.style.display = 'block';
            self.skyStep = 5;
            self.oBird.style.left = 30 + 'px';
        }
    },
    // failGame()游戏结束函数
    failGame() {
        clearInterval(this.timer);
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oScore.style.display = 'none';
    }
};
