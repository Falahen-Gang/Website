let el = document.querySelector(".scroll");
let height =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;

window.addEventListener("scroll", () => {
  let scrollTop = document.documentElement.scrollTop;
  el.style.width = `${(scrollTop / height) * 100}%`;
});

let up = document.querySelector(".up");

window.onscroll = function () {
  if (window.scrollY >= 600) {
    up.style.right = "5px";
  } else {
    up.style.right = "-60px";
  }
};

up.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
