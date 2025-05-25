const menuBtn = document.querySelector(".menu");
const menuList = document.querySelector(".list");
menuBtn.addEventListener("click", () => {
    menuList.classList.toggle("active");
    menuBtn.classList.toggle("open");

})



/**
 * for land and potrate
 */
const repeatBtn = document.querySelector(".repeat");
const calculator = document.querySelector(".calculator");
const potratMode = document.querySelector(".potrat-mode");
const header = document.querySelector(".header");

repeatBtn.addEventListener("click", () => {
    calculator.classList.toggle("land-scape");
    potratMode.classList.toggle("to-land-scape");
    header.classList.toggle("not");
})










