let score = 0;
let questionCount = 0;
let gameRunning = false;
let correctCount = 0;

// 生成随机数
function generateNumbers(){
    let numbers = [];
    for(let i=0;i<4;i++){
        numbers.push(Math.floor(Math.random()*100)); // 0-99，后续可以升级为大数比较
    }
    return numbers;
}

// 能否升级为 n 个数？
function displayNumbers(nums){
    ["A","B","C","D"].forEach((id,i)=>{
        $(id).innerText = nums[i]
    })
}

function handleClick(event){

    if(!gameRunning) return;

    // 取出数字元素
    const numsText = Array.from($$(".number-box:not(#E)"))
    // 排除 id 为 E 那个，querySelectorAll()返回一个节点列表
    // Array.from()节点列表转换为真正的数组
    const numsInt = numsText.map(ellement => parseInt(ellement.innerText));
    // map 数组映射，对数组中的每个元素执行一次函数再返回新的数组
    // innerText通过parseInt转换为数字，才能比较

    const clicked = parseInt(event.target.innerText);
    // 转换点击的数字text为int
    const max = Math.max(...numsInt);

    questionCount++;
    let isCorrect = false;
    if (clicked === max){ 
        score++; 
        correctCount++;
        isCorrect = true;
        event.target.classList.add("correct");
    }
    else {
        score--;
        event.target.classList.add("wrong");

        const nums=$$(".number-box");
        nums.forEach(ellement=>{
            if(parseInt(ellement.innerText)==max){
                ellement.classList.add("correct");
            }
        })
    }

    // 在更新完 questionCount 和 correctCount 后再更新进度条
    updateProgress();

    $("E").innerText = `做题数：${questionCount} 分数：${score} `;

    // 600ms后移除动画类，并刷新下一轮
    setTimeout(() => {
        $$(".number-box").forEach(el => el.classList.remove("correct", "wrong"));
        displayNumbers(generateNumbers());
    }, 600);

}

let lastAccuracy = 0; // 用来记录上一次正确率

function updateProgress() {
  const accuracy = questionCount > 0 ? (correctCount / questionCount)*100 : 0;
  
  const bar = $("progressBar");
  const text = $("progressText");
  console.log(accuracy);
  // 更新高度
  bar.style.height = `${accuracy}%`;
  text.textContent = `正确率：${accuracy.toFixed(1)}%`;

//   // 动态颜色变化（从绿色渐变到红色）
//   if (percent < 40) {
//     bar.style.background = "linear-gradient(to top, #4caf50, #81c784)";
//   } else if (percent < 80) {
//     bar.style.background = "linear-gradient(to top, #f9d423, #ff4e50)";
//   } else {
//     bar.style.background = "linear-gradient(to top, #ff6b6b, #fbd786)";
//   }

  // 根据正确率变化方向设置颜色趋势
  if (accuracy > lastAccuracy) {
    // 正确率上升 → 红橙激励色
    bar.style.background = "linear-gradient(to top, #ff6a00, #ffcc33)";
  } else if (accuracy < lastAccuracy) {
    // 正确率下降 → 蓝绿冷静色
    bar.style.background = "linear-gradient(to top, #2196f3, #4caf50)";
  } else {
    // 无变化 → 中性黄色
    bar.style.background = "linear-gradient(to top, #f9d423, #ff4e50)";
  }

  // 平滑过渡动画
  bar.style.transition = "height 0.6s ease, background 0.5s ease";

  // 当正确率达到90%以上时触发呼吸动画
  if (accuracy >= 90) {
    bar.style.animation = "pulse 1.2s ease-in-out infinite";
  } else {
    bar.style.animation = "none";
  }

  // 更新记录
  lastAccuracy = accuracy;
  showQuoteBubble(accuracy);
}

// 函数：显示浮动提示框
let lastQuote = "";
function showQuoteBubble(accuracy) {
  let quote = "";
  if (accuracy >= 90) {
    quote = "🏆 千里之行，始于足下。继续保持！";
  } else if (accuracy >= 60) {
    quote = "💡 千里之堤，溃于蚁穴。小心一题之差！";
  } else {
    quote = "😅 一失足成千古恨，稳住心态再来！";
  }

  // 避免频繁重复提示
  if (quote === lastQuote) return;
  lastQuote = quote;

  const bubble = $("quoteBubble");
  bubble.innerText = quote;
  bubble.classList.add("show");

  // 3秒后自动淡出
  clearTimeout(bubble.hideTimer);
  bubble.hideTimer = setTimeout(() => {
    bubble.classList.remove("show");
  }, 2000);
}

// 呼吸动画
const style = document.createElement("style");
style.textContent = `
@keyframes pulse {
  0% { box-shadow: 0 0 6px rgba(76,175,80,0.5); }
  50% { box-shadow: 0 0 16px rgba(76,175,80,0.8); }
  100% { box-shadow: 0 0 6px rgba(76,175,80,0.5); }
}`;
document.head.appendChild(style);


//等页面加载完成后再绑定事件

document.observe("dom:loaded",function(){

    $("startBtn").disabled = false;
    $("endBtn").disabled = true;

      // 先显示说明
    $("ruleModal").style.display = "flex";

    $("closeRule").observe("click", function() {
        $("ruleModal").style.display = "none";
    });
    
    // = () => { ... } 是箭头函数（Arrow Function）语法
    $("startBtn").onclick = () => {

        $("progressBar").style.height = "0%";
        $("progressText").textContent = "0%";
        
        $("startBtn").disabled = true;
        $("endBtn").disabled = false;

        if($("startBtn").innerText=="重新开始"){
            $("startBtn").innerText="开始游戏";
        }

    // 初始化游戏
        score = 0;
        questionCount = 0;
        gameRunning = true;
        correctCount=0;
        displayNumbers(generateNumbers());
        $("E").innerText = "游戏开始！"; // 提示信息
    }

    // = function(){}传统写法
    $("endBtn").onclick = function(){

        $("startBtn").disabled = false;  // 可以重新开始
        $("endBtn").disabled = true;     // 禁用结束按钮

        gameRunning = false;
        $("startBtn").innerText="重新开始";
        const accuracy = questionCount > 0 ? (correctCount / questionCount)*100 : 0;

        $("resultText").innerHTML = `
            做题数：${questionCount}<br>
            总分：${score}<br>
            正确率：${accuracy.toFixed(1)}%<br>
            ${accuracy >= 90 ? "&#127881; 恭喜你！正确率超过90%！" : "再接再厉！"}
        `;

        // 显示模态框
        $("resultModal").style.display = "flex";

        $("E").innerText = `共做 ${questionCount} 题，总分 ${score}，正确率 ${accuracy.toFixed(1)}%`;
        // if (accuracy >= 90) alert("🎉 恭喜你！正确率超过90%！");
    }

    $("closeModal").observe("click", function() {
        $("resultModal").style.display = "none";
    });

    var ids = ["A", "B", "C", "D"];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      $(id).observe("click", handleClick);
      // 或者 document.getElementById(id).addEventListener("click", handleClick);
    }

});





  

    // 报错：Prototype.js 与原生 JS 的冲突有关
    // ["A", "B", "C", "D"].forEach(id => {
    //     document.getElementById(id).addEventListener("click", handleClick);
    // }); 
    // 为 A~D 绑定点击事件
    // ["A", "B", "C", "D"].forEach(id => {
    //     $(id).observe("click", handleClick);
    // });
    
    // 可行：确保 forEach 调用的是原生数组的 forEach
    // Array.prototype.forEach.call(["A","B","C","D"], function(id){
    //     document.getElementById(id).addEventListener("click", handleClick);
    // });    
    // 这样即便 Prototype 覆盖了数组，Array.prototype.forEach 仍然调用的是原生版本。

    // 最原生/原始的方法

// 在 Prototype.js 中，$() 返回的是一个“增强版元素对象”（带有 Prototype 的方法，比如 .observe()），
// 但 它不一定包含原生的 .addEventListener() 方法。
// prototype 内部用的是 $(id).observe("click", handleClick);

// 用forEach传统版：
// ["A", "B", "C", "D"].forEach(function(id) {
//     document.getElementById(id).addEventListener("click", handleClick);
// });

// 不用forEach用for传统版：
// var ids = ["A", "B", "C", "D"];
// for (var i = 0; i < ids.length; i++) {
//   var id = ids[i];
//   document.getElementById(id).addEventListener("click", handleClick);
// }
