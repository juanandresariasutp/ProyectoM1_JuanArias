const lockedColors = new Set();
let currentPalette = [];
let paletteSize = 6;
let toastTimeoutId = null;

function randomHexColor() {
	const value = Math.floor(Math.random() * 0xffffff);
	return `#${value.toString(16).padStart(6, '0').toUpperCase()}`;
}

function buildPalette() {
	if (currentPalette.length !== paletteSize) {
		const resizedPalette = [];

		for (let index = 0; index < paletteSize; index += 1) {
			const existingColor = currentPalette[index];
			resizedPalette.push(existingColor || randomHexColor());
		}

		currentPalette = resizedPalette;

		Array.from(lockedColors).forEach((index) => {
			if (index >= paletteSize) {
				lockedColors.delete(index);
			}
		});

		return;
	}

	currentPalette = currentPalette.map((color, index) => {
		if (lockedColors.has(index)) {
			return color;
		}
		return randomHexColor();
	});
}

function toggleLock(index) {
	if (lockedColors.has(index)) {
		lockedColors.delete(index);
	} else {
		lockedColors.add(index);
	}
	renderPalette();
}

function renderPalette() {
	const container = document.getElementById('paletteContainer');
	if (!container) {
		return;
	}

	container.style.setProperty('--palette-columns', String(paletteSize));

	container.innerHTML = '';

	currentPalette.forEach((color, index) => {
		const card = document.createElement('div');
		card.className = 'color-card';
		card.style.backgroundColor = color;

		const code = document.createElement('span');
		code.className = 'color-code';
		code.textContent = color;

		const lockBtn = document.createElement('button');
		lockBtn.className = 'lock-btn';
		lockBtn.type = 'button';
		lockBtn.textContent = lockedColors.has(index) ? '🔒' : '🔓';
		lockBtn.setAttribute('aria-label', lockedColors.has(index) ? 'Desbloquear color' : 'Bloquear color');
		lockBtn.addEventListener('click', () => toggleLock(index));

		card.appendChild(code);
		card.appendChild(lockBtn);
		container.appendChild(card);
	});
}

function ensureToastElement() {
	let toast = document.getElementById('paletteToast');
	if (!toast) {
		toast = document.createElement('div');
		toast.id = 'paletteToast';
		toast.className = 'palette-toast';
		toast.setAttribute('aria-live', 'polite');
		document.body.appendChild(toast);
	}
	return toast;
}

function showToast(message) {
	const toast = ensureToastElement();
	toast.textContent = message;
	toast.classList.add('is-visible');

	if (toastTimeoutId) {
		clearTimeout(toastTimeoutId);
	}

	toastTimeoutId = window.setTimeout(() => {
		toast.classList.remove('is-visible');
	}, 1600);
}

function generate() {
	buildPalette();
	renderPalette();
	showToast(`Nueva paleta generada (${paletteSize} colores)`);
}

function updateQuantity() {
	const select = document.getElementById('quantitySelect');
	if (select) {
		paletteSize = Number(select.value) || 6;
	}

	buildPalette();
	renderPalette();
	showToast(`Cantidad actualizada a ${paletteSize} colores`);
}

function downloadPalette() {
	const content = currentPalette.join('\n');
	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = 'palette-colorfly.txt';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}

window.generate = generate;
window.updateQuantity = updateQuantity;
window.downloadPalette = downloadPalette;

document.addEventListener('DOMContentLoaded', () => {
	updateQuantity();
	generate();
});
