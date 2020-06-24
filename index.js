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
    birdStepY: 0,
    // 边界碰撞判断高度
    minTop: 0,
    maxTop: 570,
    // 显示的柱子数目
    pipeNum: 7,
    // pipeArr用于存放所有柱子，从而避免每次刷新都重新获取柱子dom
    pipeArr: [],
    // 得分
    score: 0,
    // 最后一根柱子的索引
    pipeLastIndex: 6,

    // init()初始化函数, 调用bird.init()即为调用其中对应的函数
    init() {
        this.initData();
        this.animate();
        this.handle();
        // 如果当前的session中有一个play，就说明是重新开始
        if (sessionStorage.getItem('play')) {
            this.startGame();
        }
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
        this.oFinalScore = this.oEnd.getElementsByClassName('final-score')[0];
        this.oRankList = this.oEnd.getElementsByClassName('rank-list')[0];
        this.oReStart = this.oEnd.getElementsByClassName('restart')[0];
        this.scoreArr = this.getScore();
    },
    // 获取本地的数据score
    getScore() {
        // 第一次取数据，键值不存在, 值为null
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr : [];
    },
    // animate()用于管理所有动画函数
    animate() {
        // 引入count计数,利用count%10 判断。背景移动30ms执行一次,小鸟移动300ms执行一次
        var count = 0;
        var self = this;

        // 以下函数都由bird调用,this指向bird
        this.timer = setInterval(() => {
            self.skyMove();
            // 当开始游戏，柱子移动，小鸟跳
            if (self.startFlag) {
                self.pipeMove();
                self.birdDrop();
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
     * 柱子移动 
     */
    pipeMove() {
        // 获取所有的柱子, 后减去共同的移动值this.skyStep
        for (let i = 0; i < this.pipeNum; i++) {
            var oUpperPipe = this.pipeArr[i].upper;
            var oLowerPipe = this.pipeArr[i].lower;
            var pipeLeftPosition = oUpperPipe.offsetLeft - this.skyStep;

            // 柱子本身宽度为52px，当柱子left小于-52px,则在视野中消失
            if (pipeLeftPosition < -52) {
                // 获取最后一根柱子的left值lastPipeLeft
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].upper.offsetLeft;
                oUpperPipe.style.left = lastPipeLeft + 300 + 'px';
                oLowerPipe.style.left = lastPipeLeft + 300 + 'px';
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeNum;
                // 重新获取柱子高度
                var newPipeHeight = this.getPipeHeight();
                oUpperPipe.style.height = newPipeHeight.upper + 'px';
                oLowerPipe.style.height = newPipeHeight.lower + 'px';

                // 将当前柱子移至最后柱子后300px处，不再需要执行步进，因此用continue跳出本次循环
                continue;
            }
            oUpperPipe.style.left = pipeLeftPosition + 'px';
            oLowerPipe.style.left = pipeLeftPosition + 'px';
        }
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
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';
        // 进行碰撞检测
        this.judgeKnock();
        this.addScore();
    },
    // 获取上下柱子高度
    getPipeHeight() {
        var upperPipeHeight = 50 + Math.floor(Math.random() * 175)
        var lowerPipeHeight = 600 - 150 - upperPipeHeight;
        return {
            upper: upperPipeHeight,
            lower: lowerPipeHeight
        }
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
    judgePipe() {
        var index = this.score % this.pipeNum;
        // 小鸟经过第一组柱子，当小鸟高度为上柱子bottom或下柱子top，发生碰撞
        var pipeY = this.pipeArr[index].y;
        var pipeX = this.pipeArr[index].upper.offsetLeft;
        var birdY = this.birdTop;
        if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
            this.failGame();
        }
    },
    // addScore()加分
    addScore() {
        var index = this.score % this.pipeNum;
        var pipeX = this.pipeArr[index].upper.offsetLeft;
        if (pipeX < 13) {
            this.oScore.innerText = ++this.score;
        }
    },
    // 所有关于事件的函数在handle中执行
    handle() {
        this.handleStart();
        this.handleClick();
        this.handleReStart();
    },
    // handleStart()为点击开始函数
    handleStart() {
        this.oStart.onclick = this.startGame.bind(this);
    },
    startGame() {
        this.startFlag = true;
        this.oStart.style.display = 'none';
        this.oScore.style.display = 'block';
        this.skyStep = 5;
        this.oBird.style.left = 80 + 'px';
        // 点击开始后取消小鸟的过渡效果
        this.oBird.style.transition = 'none'
        // createPipe()创建柱子
        for (let i = 0; i < this.pipeNum; i++) {
            this.createPipe(300 * (i + 1));
        }
    },
    handleClick() {
        // 鼠标单击小鸟上跳
        var self = this;
        this.el.onclick = function (e) {
            if (!e.target.classList.contains('start')) {
                self.birdStepY = -10;
            }
            // self.judgePipe();
        };
    },
    // 重新开始游戏
    handleReStart() {
        this.oReStart.onclick = function () {
            // 点击重新开始，不是从开始游戏的页面起
            sessionStorage.setItem('play', true);
            // 刷新页面
            window.location.reload();

        }
    },
    // 创建一组上下柱子
    createPipe(leftDistance) {
        // 设定上下柱子之间空隙为150px
        // 上柱子高度为upperPipeHeight，下柱子高度为lowerPipeHeight
        var upperPipeHeight = 50 + Math.floor(Math.random() * 175)
        var lowerPipeHeight = 600 - 150 - upperPipeHeight;
        // oUpperPipe为上柱子dom
        var oUpperPipe = createEle('div', ['pipe', 'pipe-top'], {
            height: upperPipeHeight + 'px',
            left: leftDistance + 'px'
        });
        // oLowerPipe为下柱子dom
        var oLowerPipe = createEle('div', ['pipe', 'pipe-bottom'], {
            height: lowerPipeHeight + 'px',
            left: leftDistance + 'px'
        });
        this.el.appendChild(oUpperPipe);
        this.el.appendChild(oLowerPipe);

        this.pipeArr.push({
            upper: oUpperPipe,
            lower: oLowerPipe,
            y: [upperPipeHeight, upperPipeHeight + 150]
        })
    },
    // 存储分数
    setScore() {
        this.scoreArr.push({
            score: this.score,
            time: this.getCurrentTime(),
        })
        // 对分数进行排序
        this.scoreArr.sort(function (a, b) {
            return b.score - a.score;
        })
        setLocal('score', this.scoreArr);
    },
    // 获取当前时间
    getCurrentTime() {
        var currentTime = new Date();
        var year = formatNum(currentTime.getFullYear());
        var mouth = formatNum(currentTime.getMonth() + 1);
        var day = formatNum(currentTime.getDate());
        var hour = formatNum(currentTime.getHours());
        var minute = formatNum(currentTime.getMinutes());
        var second = formatNum(currentTime.getSeconds());
        return `${year}.${mouth}.${day} ${hour}:${minute}:${second}`;
    },
    // failGame()游戏结束函数
    failGame() {
        clearInterval(this.timer);
        // 当游戏失败，存储score
        this.setScore();
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oScore.style.display = 'none';
        this.oBird.style.display = 'none';
        // Your Results显示当前score
        this.oFinalScore.innerText = this.score;
        this.renderRankList();
    },
    // 将得分渲染到排行中
    renderRankList() {
        var template = '';
        shownListLength = this.scoreArr.length < 8 ? this.scoreArr.length : 8;
        for (let i = 0; i < shownListLength; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first'
                    break;
                case 1:
                    degreeClass = 'second'
                    break;
                case 2:
                    degreeClass = 'third'
                    break;
            }
            template += `
             <li class="rank-item">
                    <span class="rank-degree ${degreeClass}">${i + 1}</span>
                    <span class="rank-score">${this.scoreArr[i].score}</span>
                    <span class="rank-time">${this.scoreArr[i].time}</span>
                </li>
            `
            this.oRankList.innerHTML = template;
        }
    }
};
