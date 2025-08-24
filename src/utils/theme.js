/**
 * Sets the active theme and updates local storage
 * @param {string} theme - theme name to set as active
 */
export const setTheme = (theme) => {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	if (currentTheme === theme) return;

	document.documentElement.setAttribute('data-theme', theme);
	try { localStorage.setItem('theme', theme); } catch { };
	window.dispatchEvent(new CustomEvent('theme:change', { detail: theme }));
};

/**
 * retrieves the current theme from the first available location
 * data-theme attribute, local storage, or the data-theme-default attribute
 */
export const getTheme = () => {
	let theme = document.documentElement.getAttribute('data-theme');
	theme ??= (() => {
		try { return localStorage.getItem('theme'); }
		catch { return null; }
	})();
	theme ??= document.documentElement.getAttribute('data-theme-default');
	return theme;
};

export const syncRadios = (theme = getTheme()) => {
	document.querySelectorAll('input.theme-controller').forEach((el) => {
		el.checked = el.value === theme;
	});
};