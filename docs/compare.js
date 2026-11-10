document.querySelectorAll(".compare-box").forEach((box) => {
  const range = box.querySelector("input[type=range]");
  const set = () => {
    const v = Number(range.value);
    box.style.setProperty("--pos", v + "%");
    range.setAttribute("aria-valuetext", `${v}% before, with the dark overlay; ${100 - v}% after, cleared`);
  };
  range.addEventListener("input", set);
  set();
});
