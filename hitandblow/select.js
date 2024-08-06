const buttons = document.querySelectorAll(".num");
const backspace = document.getElementById("backspace");
const go = document.getElementById("go");
go.disabled = true;
const player_input_num = document.getElementById("player_input_num");
const table = document.getElementById("table");
if (window.sessionStorage.getItem("digits")){
    digit = parseInt(window.sessionStorage.getItem("digits"));
}else {
    digit = 3;
}
for (let button of buttons) {
    button.addEventListener("click", function() {
        if (player_input_num.textContent.length < digit && !player_input_num.textContent.includes(button.textContent)) player_input_num.textContent += button.textContent;
        if (player_input_num.textContent.length == digit) go.disabled = false;
    })
}
backspace.addEventListener("click", function() {
    if (player_input_num.textContent.length > 0) player_input_num.textContent = player_input_num.textContent.slice(0, -1);
    go.disabled = true;
})
go.addEventListener("click", function() {
    window.sessionStorage.setItem(['player_num'],[player_input_num.textContent]);
    window.location.href = "index.html";
})