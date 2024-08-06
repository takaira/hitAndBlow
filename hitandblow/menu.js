window.sessionStorage.clear();
const selectNumbers = document.querySelectorAll(".selectnumber");
for (let selectNumber of selectNumbers) {
    selectNumber.addEventListener("click", function() {
        window.sessionStorage.setItem(['digits'],[selectNumber.textContent]);
        window.location.href = "index.html";
    })
}
const cpu_selectNumbers = document.querySelectorAll(".cpu_selectnumber");
for (let cpu_selectNumber of cpu_selectNumbers) {
    cpu_selectNumber.addEventListener("click", function() {
        window.sessionStorage.setItem(['digits'],[cpu_selectNumber.textContent]);
        window.location.href = "select.html";
    })
}