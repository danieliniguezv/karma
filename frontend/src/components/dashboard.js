export function TextElement(text) {
	const textElement = document.createElement('p');
	textElement.textContent = text;
	return textElement;
}
