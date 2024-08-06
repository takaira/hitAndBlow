const selectNumbers = document.querySelectorAll(".selectnumber");
for (let selectNumber of selectNumbers) {
    selectNumber.addEventListener("click", function() {
        window.sessionStorage.setItem(['digits'],[selectNumber.textContent]);
        window.location.href = "index.html";
    })
}