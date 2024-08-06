// モーダル操作 ------------------------------------------------------
const modal = document.getElementById('easyModal');
const buttonClose = document.getElementsByClassName('modalClose')[0];
const modal_h1 = document.getElementById('modal-h1');
const modal_p = document.getElementById('modal-p');

function modalOpen() {
  modal.style.display = 'block';
}

// バツ印がクリックされた時
buttonClose.addEventListener('click', modalClose);
function modalClose() {
  modal.style.display = 'none';
}

// モーダルコンテンツ以外がクリックされた時
addEventListener('click', outsideClose);
function outsideClose(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}
// -------------------------------------------------------------------
// dom受け取り -------------------------------------------------------
const num_buttons = document.querySelectorAll(".num");
const backspace = document.getElementById("backspace");
const go = document.getElementById("go");
go.disabled = true;
const player_input_num = document.getElementById("player_input_num");
const table = document.getElementById("table");
const cpu_tables = document.querySelectorAll(".cpu-table");
// -------------------------------------------------------------------
// 初期値、入力値代入 -------------------------------------------------
let digit;
if (window.sessionStorage.getItem("digits")){
    digit = parseInt(window.sessionStorage.getItem("digits"));
}else {
    digit = 3;
}
const N = 10 ** digit;
let player_num;
let vs_cpu;
if (window.sessionStorage.getItem("player_num")){
    player_num = window.sessionStorage.getItem("player_num");
    vs_cpu = true;
}else {
    for (let cpu_table of cpu_tables) {
        cpu_table.style.display = "none";
    }
    vs_cpu = false;
}
let possible_set = new Set();
for (let i = 12; i < N; i++) {
    let num = ('0000' + i).slice(-digit)
    if (num_check(num)) possible_set.add(num);
};
// --------------------------------------------------------------------
// 関数 ---------------------------------------------------------------
// 0~9の乱数生成
function intRandom(){
    return Math.floor(Math.random() * 10);
}
// 重複チェック
function num_check(num) {
    const set_num = new Set(num);
    if (set_num.size == digit) {
        return true;
    }
    else {
        return false;
    }
}
// hit数,blow数を求める
function atack(num_a, num_b) {
    let hit = 0;
    let blow = 0;
    for (let i = 0; i < digit; i++) {
        if (num_a[i] == num_b[i]) hit++;
        else if (num_a.includes(num_b[i])) blow++;
    }
    return [hit, blow];
}
// reduceによりSetの最大(最小)値を求める
const setMax = function (a, b) {return Math.max(a, b);};
const setMin = function (a, b) {return Math.min(a, b);};
// cpu処理
function cpu(trElem) {
    let new_possible_obj = {"dummy":{"dummy": "dummy"}};
    let select_max_obj = {};
    for (let i = 12; i < N; i++) {
        select_num = ('0000' + i).slice(-digit);
        if (num_check(select_num)) {
            for (let possible_num of possible_set) {
                let [hit, blow] = atack(select_num, possible_num);
                if (select_num in new_possible_obj) {
                    if (("" + hit + blow) in new_possible_obj[select_num]) {
                        new_possible_obj[select_num][("" + hit + blow)].add(possible_num);
                    }
                    else {
                        new_possible_obj[select_num][("" + hit + blow)] = new Set([possible_num]);
                    }
                }
                else {
                    new_possible_obj[select_num] = {};
                    new_possible_obj[select_num][("" + hit + blow)] = new Set([possible_num]);
                }
            }
            let choice_count_set = Object.values(new_possible_obj[select_num]).map(function(element) {
                return element.size;
            });
            let choice_count_max = "" + choice_count_set.reduce(setMax);
            if (choice_count_max in select_max_obj){
                select_max_obj[choice_count_max].add(select_num);
            }
            else {
                select_max_obj[choice_count_max] = new Set([select_num]);
            }
        }
    }
    const min_choice_count = "" + Object.keys(select_max_obj).reduce(setMin);
    let cpu_choice;
    const intersection = new Set([...select_max_obj[min_choice_count]].filter(element => possible_set.has(element)));
    if (intersection.size > 0) {
        const arr = Array.from(intersection);
        cpu_choice = arr[Math.floor(Math.random() * arr.length)];
    }
    else {
        const arr = Array.from(select_max_obj[min_choice_count]);
        cpu_choice = arr[Math.floor(Math.random() * arr.length)];
    }
    let [hit, blow] = atack(player_num, cpu_choice);
    possible_set = new_possible_obj[cpu_choice][("" + hit + blow)];
    var cellElem = trElem.insertCell(3);
    let newText = document.createTextNode(cpu_choice);
    cellElem.appendChild(newText);
    var cellElem = trElem.insertCell(4);
    newText = document.createTextNode(hit);
    cellElem.appendChild(newText);
    var cellElem = trElem.insertCell(5);
    newText = document.createTextNode(blow);
    cellElem.appendChild(newText);
    if (hit == digit) {
        modal_h1.textContent = "LOSE";
        modal_p.textContent = "CPUの勝ちです";
        modalOpen();
    }
}
// --------------------------------------------------------------------
// プレイヤーが当てたい数 ----------------------------------------------
let cpu_num = "";
while(cpu_num.length < digit) {
    let tmp = intRandom();
    if (!cpu_num.includes(tmp)) {
        cpu_num += tmp;
    }
}
// --------------------------------------------------------------------
// ボタン処理----------------------------------------------------------
for (let num_button of num_buttons) {
    num_button.addEventListener("click", function() {
        if (player_input_num.textContent.length < digit && !player_input_num.textContent.includes(num_button.textContent)) player_input_num.textContent += num_button.textContent;
        if (player_input_num.textContent.length == digit) go.disabled = false;
    })
}
backspace.addEventListener("click", function() {
    if (player_input_num.textContent.length > 0) player_input_num.textContent = player_input_num.textContent.slice(0, -1);
    go.disabled = true;
})
go.addEventListener("click", function() {
    let [hit, blow] = atack(cpu_num, player_input_num.textContent);
    var trElem = table.tBodies[0].insertRow(-1);
    var cellElem = trElem.insertCell(0);
    let newText = document.createTextNode(player_input_num.textContent);
    cellElem.appendChild(newText);
    var cellElem = trElem.insertCell(1);
    newText = document.createTextNode(hit);
    cellElem.appendChild(newText);
    var cellElem = trElem.insertCell(2);
    newText = document.createTextNode(blow);
    cellElem.appendChild(newText);
    go.disabled = true;
    if (vs_cpu) {
        cpu(trElem);
    }
    player_input_num.textContent = "";
    if (hit == digit) {
        modal_h1.textContent = "WIN";
        modal_p.textContent = "あなたの勝ちです";
        modalOpen();
    }
})
// --------------------------------------------------------------------