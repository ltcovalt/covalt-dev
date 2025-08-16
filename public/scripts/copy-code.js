document.addEventListener("click", function (e) {
  const target = e.target;
  if (!target.classList.contains("copy-code")) return;

  const pre = target.closest("pre");
  const codeEl = pre?.querySelector("code");
  const codeText = codeEl?.textContent ?? "";

  if (!codeText) return;

  navigator.clipboard.writeText(codeText).then(() => {
    target.textContent = "Copied";
    setTimeout(() => (target.textContent = "Copy"), 1000);
  });
});
