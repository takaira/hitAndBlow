const modal = document.getElementById('easyModal');
const buttonClose = document.getElementsByClassName('modalClose')[0];

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

let digit;
if (window.sessionStorage.getItem("digits")){
    digit = parseInt(window.sessionStorage.getItem("digits"));
}else {
    digit = 3;
}
let auto_play = false;
let group_count = 1;
let result_list = [{}];
let count_flag = true;
let use_list = new Set();
let clear_flag = false;
const buttons = document.querySelectorAll(".num");
if (auto_play) for (let button of buttons) button.disabled = true;
const backspace = document.getElementById("backspace");
if (auto_play) backspace.disabled = true;
const go = document.getElementById("go");
go.disabled = true;
const now_num = document.getElementById("now_num");
const table = document.getElementById("table");
let random_num = "";
let now_index = 0;
function intRandom(){
    return Math.floor(Math.random() * 10);
}
while(random_num.length < digit) {
    let tmp = intRandom();
    if (!random_num.includes(tmp)) {
        random_num += tmp;
    }
}
random_num = "013";
for (let button of buttons) {
    button.addEventListener("click", function() {
        if (now_num.textContent.length < digit && !now_num.textContent.includes(button.textContent)) now_num.textContent += button.textContent;
        if (now_num.textContent.length == digit && !auto_play) go.disabled = false;
    })
    if (auto_play) button.disabled = true;
}
backspace.addEventListener("click", function() {
    if (now_num.textContent.length > 0) now_num.textContent = now_num.textContent.slice(0, -1);
    go.disabled = true;
})
if (auto_play) {
    // 案１---------------------------------------------------
    // for (let i = 0; i < 10; i++) {
    //     let my_random = "";
    //     if (count == 1) {
    //         while(my_random.length < digit) {
    //             let tmp = intRandom();
    //             if (!my_random.includes(tmp)) {
    //                 my_random += tmp;
    //             }
    //         }
    //         // my_random = "312";
    //     }
    //     else if (count == 2) {
    //         if (result_list[i]["hit"] + result_list[i]["blow"] < 3) {
    //             while(my_random.length < digit) {
    //                 let tmp = intRandom();
    //                 if (!my_random.includes(tmp) && !result_list[i]["result"].includes(tmp)) {
    //                     my_random += tmp;
    //                 }
    //             }
    //         } else {
    //             let array = result_list[count - 1]["result"];
    //             use_list.add(array);
    //             my_random = "";
    //             if (count_flag) {
    //                 count_flag = false;
    //             }
    //             console.log(array);
    //             while(my_random.length < digit) {
    //                 let tmp = array[Math.floor(Math.random() * array.length)];
    //                 if(!my_random.includes(tmp)) {
    //                     my_random += tmp;
    //                 }
    //                 if(use_list.has(my_random)) {
    //                     my_random = "";
    //                 }
    //             }
    //             use_list.add(my_random);
    //         }
    //     }
    //     now_num.textContent = my_random;
    //     atack();
    //     if (count_flag) count++;
    //     if (clear_flag) break;
    // }
    // --------------------------------------------------------------------------------------
    // 案２
    let group1 = "";
    let group2 = "";
    let group3 = "";
    let master_group = "";
    let count = 0;

    let my_random = "";
    while(my_random.length < digit) {
        let tmp = intRandom();
        if (!my_random.includes(tmp)) {
            my_random += tmp;
        }
    }
    // my_random = "213";
    group1 = my_random;

    now_num.textContent = my_random;
    atack();
    if (!clear_flag) {
        if (result_list[1]["hit"] + result_list[1]["blow"] == 3) {
            if (result_list[1]["hit"] == 0) {
                my_random = group1[1] + group1[2] + group1[0];
                now_num.textContent = my_random;
                atack();
                if (!clear_flag) {
                    my_random = group1[2] + group1[0] + group1[1];
                    now_num.textContent = my_random;
                    atack();
                }
            }
            else if (result_list[1]["hit"] == 1) {
                my_random = group1[0] + group1[2] + group1[1];
                now_num.textContent = my_random;
                atack();
                if (!clear_flag) {
                    if (result_list[2]["hit"] == 0) {
                        my_random = group1[1] + group1[0] + group1[2];
                        now_num.textContent = my_random;
                        atack();
                        if (!clear_flag) {
                            my_random = group1[2] + group1[1] + group1[0];
                            now_num.textContent = my_random;
                            atack();
                        }
                    }
                }
            }
        }
        else if (result_list[1]["hit"] + result_list[1]["blow"] == 2) {
            my_random = "";
            while(my_random.length < digit) {
                let tmp = intRandom();
                if (!my_random.includes(tmp) && !group1.includes(tmp)) {
                    my_random += tmp;
                }
            }
            group2 = my_random;
            now_num.textContent = my_random;
            atack();
            if (result_list[2]["hit"] + result_list[2]["blow"] == 1) {
                if (result_list[1]["hit"] == 0) {
                    if (result_list[2]["hit"] == 0) {
                        my_random = group2[1] + group1[0] + group1[1];
                        now_num.textContent = my_random;
                        atack();
                        if (!clear_flag) {
                            if (result_list[3]["blow"] == 3) {
                                my_random = group1[1] + group2[1] +group1[0];
                                now_num.textContent = my_random;
                                atack();
                            }
                            else if (result_list[3]["blow"] == 2) {
                                my_random = group1[2] + group2[2] + group1[0];
                                now_num.textContent = my_random;
                                atack();
                                if (!clear_flag) {
                                    if (result_list[4]["hit"] == 0 && result_list[4]["blow"] == 1) {
                                        my_random = group1[1] + group1[2] + group2[1];
                                        now_num.textContent = my_random;
                                        atack();
                                    }
                                    else if (result_list[4]["hit"] == 1 && result_list[4]["blow"] == 0) {
                                        my_random = group1[1] + group1[2] + group2[0];
                                        now_num.textContent = my_random;
                                        atack();
                                        if (!clear_flag) {
                                            if (result_list[5]["hit"] == 1 && result_list[5]["blow"] == 0) {
                                                my_random =  +  + group1[0];
                                            }
                                        }
                                    }
                                    else if (result_list[4]["hit"] == 1 && result_list[4]["blow"] == 1) {
                                        my_random = group1[1] + group2[0] + group1[0];
                                        now_num.textContent = my_random;
                                        atack();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
go.addEventListener("click", atack);
function atack() {
    let blow = 0;
    let hit = 0;
    for (let i = 0; i < digit; i++) {
        if (random_num[i] == now_num.textContent[i]) hit++;
        else if (random_num.includes(now_num.textContent[i])) blow++;
    }
    now_index++;
    var trElem = table.tBodies[0].insertRow(-1);
    var cellElem = trElem.insertCell(0);
    let newText = document.createTextNode(now_num.textContent);
    cellElem.appendChild(newText);
    var cellElem = trElem.insertCell(1);
    newText = document.createTextNode(hit);
    cellElem.appendChild(newText);
    var cellElem = trElem.insertCell(2);
    newText = document.createTextNode(blow);
    cellElem.appendChild(newText);
    go.disabled = true;
    if (auto_play) {
        var new_data = { result : now_num.textContent, hit : hit, blow : blow };
        result_list.push(new_data);
    }
    now_num.textContent = "";
    if (hit == digit) {
        clear_flag = true;
        modalOpen();
    }
}