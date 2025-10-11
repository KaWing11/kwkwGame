let score = 0;
let questionCount = 0;
let gameRunning = false;

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
    if (clicked === max) score++;

    $("E").innerText = `做题数：${questionCount} 分数：${score}`;
    displayNumbers(generateNumbers());
}

//等页面加载完成后再绑定事件

document.observe("dom:loaded",function(){
    
    // = () => { ... } 是箭头函数（Arrow Function）语法
    $("startBtn").onclick = () => {
    // 初始化游戏
        score = 0;
        questionCount = 0;
        gameRunning = true;
        displayNumbers(generateNumbers());
        $("E").innerText = "游戏开始！"; // 提示信息
    }

    // = function(){}传统写法
    $("endBtn").onclick = function(){
        gameRunning = false;
        const accuracy = (score / questionCount)*100;
        $("E").innerText = `共做 ${questionCount} 题，总分 ${score}，正确率 ${accuracy.toFixed(1)}%`;
        if (accuracy >= 90) alert("恭喜你！正确率超过90%！");
    }

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
    var ids = ["A", "B", "C", "D"];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      $(id).observe("click", handleClick);
      // 或者 document.getElementById(id).addEventListener("click", handleClick);
    }

});
  
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
