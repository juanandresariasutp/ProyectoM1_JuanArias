const lockedColors = new Set();
let currentPalette = [];
let paletteSize = 6;
let toastTimeoutId = null;

function randomHexColor() {
	const value = Math.floor(Math.random() * 0xffffff);
	return `#${value.toString(16).padStart(6, '0').toUpperCase()}`;
}

function hexToHsl(hexColor) {
	const hex = hexColor.replace('#', '');
	const red = parseInt(hex.substring(0, 2), 16) / 255;
	const green = parseInt(hex.substring(2, 4), 16) / 255;
	const blue = parseInt(hex.substring(4, 6), 16) / 255;

	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const delta = max - min;

	let hue = 0;
	let saturation = 0;
	const lightness = (max + min) / 2;

	if (delta !== 0) {
		saturation = delta / (1 - Math.abs(2 * lightness - 1));

		switch (max) {
			case red:
				hue = ((green - blue) / delta) % 6;
				break;
			case green:
				hue = (blue - red) / delta + 2;
				break;
			default:
				hue = (red - green) / delta + 4;
				break;
		}
	}

	hue = Math.round(hue * 60);
	if (hue < 0) {
		hue += 360;
	}

	const satPercent = Math.round(saturation * 100);
	const lightPercent = Math.round(lightness * 100);

	return `hsl(${hue},\n${satPercent}%,\n${lightPercent}%)`;
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

		const preview = document.createElement('div');
		preview.className = 'color-preview';
		preview.style.backgroundColor = color;

		const colorMeta = document.createElement('div');
		colorMeta.className = 'color-meta';

		const hexLabel = document.createElement('p');
		hexLabel.className = 'color-format-label';
		hexLabel.textContent = 'HEX';

		const hexValue = document.createElement('p');
		hexValue.className = 'color-format-value';
		hexValue.textContent = color;

		const hslLabel = document.createElement('p');
		hslLabel.className = 'color-format-label';
		hslLabel.textContent = 'HSL';

		const hslValue = document.createElement('p');
		hslValue.className = 'color-format-value';
		hslValue.classList.add('color-format-value-hsl');
		hslValue.textContent = hexToHsl(color);

		const lockBtn = document.createElement('button');
		lockBtn.className = 'lock-btn';
		lockBtn.type = 'button';
        lockBtn.innerHTML = lockedColors.has(index) ? '<img src="./assets/images/candado-cerrado.svg" alt="Bloquear">' : '<img src="./assets/images/candado-abierto.svg" alt="Desbloquear">';
		lockBtn.setAttribute('aria-label', lockedColors.has(index) ? 'Desbloquear color' : 'Bloquear color');
		lockBtn.addEventListener('click', () => toggleLock(index));

		preview.appendChild(lockBtn);
		colorMeta.appendChild(hexLabel);
		colorMeta.appendChild(hexValue);
		colorMeta.appendChild(hslLabel);
		colorMeta.appendChild(hslValue);

		card.style.cursor = 'pointer';
		card.setAttribute('title', `Clic para copiar ${color}`);
		card.addEventListener('click', (event) => {
			if (event.target.closest('.lock-btn')) {
				return;
			}
			copyColorToClipboard(color);
		});

		card.appendChild(preview);
		card.appendChild(colorMeta);
		container.appendChild(card);
	});

	updateVisualExample();
}

function updateVisualExample() {
	if (!currentPalette.length) {
		return;
	}

	const previewBlocks = document.querySelectorAll('[data-preview-color]');
	if (!previewBlocks.length) {
		return;
	}

	previewBlocks.forEach((block) => {
		const index = Number(block.dataset.previewColor) || 0;
		const color = currentPalette[index];
		const hasColor = Boolean(color);

		block.classList.toggle('is-hidden-preview', !hasColor);

		if (hasColor) {
			block.style.backgroundColor = color;
		} else {
			block.style.backgroundColor = 'transparent';
		}
	});
}

function copyColorToClipboard(color) {
	navigator.clipboard.writeText(color).then(() => {
		showToast(`✅ ${color} copiado al portapapeles`);
	}).catch(() => {
		showToast('No se pudo copiar el color');
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
	const lines = currentPalette.map((color, index) => {
		const hsl = hexToHsl(color).replace(/\n/g, ' ');
		return `Color ${index + 1}\nHEX: ${color}\nHSL: ${hsl}\n`;
	});

	const header = `ColorFly Studio — Paleta generada el ${new Date().toLocaleDateString('es-ES')}\n${'─'.repeat(40)}\n\n`;
	const content = header + lines.join('\n');

	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = 'palette-colorfly.txt';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
	showToast('⬇️ Paleta descargada correctamente');
}

window.generate = generate;
window.updateQuantity = updateQuantity;
window.downloadPalette = downloadPalette;

document.addEventListener('DOMContentLoaded', () => {
	updateQuantity();
	generate();
});


