document.querySelectorAll(".compare-box").forEach((box) => {
  const range = box.querySelector("input[type=range]");
  const set = () => box.style.setProperty("--pos", range.value + "%");
  range.addEventListener("input", set);
  set();
});
