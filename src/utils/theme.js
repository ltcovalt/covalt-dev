/**
 * Sets the active theme and updates local storage
 * @param {string} theme - theme name to set as active
 */
export const setTheme = (theme) => {
	document.documentElement.setAttribute('data-theme', theme);
	try {
		localStorage.setItem('theme', theme);
	} catch (ex) {
		console.log(ex);
	}
};

/**
 * retrieves the current theme from the first available location
 * data-theme attribute, local storage, or the data-theme-default attribute
 */
export const getTheme = () => {
	const theme =
		document.documentElement.getAttribute('data-theme') ||
		localStorage.getItem('theme') ||
		document.documentElement.getAttribute('data-theme-default');
	return theme;
};