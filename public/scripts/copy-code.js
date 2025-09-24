document.addEventListener('click', function (e) {
	const target = e.target;
	if (!target.classList.contains('code-copy')) return;
	const codeBlock = target.closest('.code-block');
	const code = codeBlock?.querySelector('code')?.textContent ?? '';
	if (!code) return;

	navigator.clipboard.writeText(code).then(() => {
		target.textContent = 'Copied';
		setTimeout(() => (target.textContent = 'Copy'), 1000);
	});
});