const lockedColors = new Set();
let currentPalette = [];
let paletteSize = 6;
let paletteFormat = 'hex';
let toastTimeoutId = null;

function randomHexColor() {
	const value = Math.floor(Math.random() * 0xffffff);
	return `#${value.toString(16).padStart(6, '0').toUpperCase()}`;
}

function hslToHex(hue, saturation, lightness) {
	const normalizedSaturation = saturation / 100;
	const normalizedLightness = lightness / 100;

	const chroma = (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
	const scaledHue = hue / 60;
	const intermediate = chroma * (1 - Math.abs((scaledHue % 2) - 1));

	let red = 0;
	let green = 0;
	let blue = 0;

	if (scaledHue >= 0 && scaledHue < 1) {
		red = chroma;
		green = intermediate;
	} else if (scaledHue >= 1 && scaledHue < 2) {
		red = intermediate;
		green = chroma;
	} else if (scaledHue >= 2 && scaledHue < 3) {
		green = chroma;
		blue = intermediate;
	} else if (scaledHue >= 3 && scaledHue < 4) {
		green = intermediate;
		blue = chroma;
	} else if (scaledHue >= 4 && scaledHue < 5) {
		red = intermediate;
		blue = chroma;
	} else {
		red = chroma;
		blue = intermediate;
	}

	const match = normalizedLightness - chroma / 2;
	const toHex = (value) => Math.round((value + match) * 255).toString(16).padStart(2, '0').toUpperCase();

	return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function randomHslBasedColor() {
	const hue = Math.floor(Math.random() * 360);
	const saturation = 55 + Math.floor(Math.random() * 35);
	const lightness = 35 + Math.floor(Math.random() * 35);
	return hslToHex(hue, saturation, lightness);
}

function randomColorByFormat() {
	if (paletteFormat === 'hsl') {
		return randomHslBasedColor();
	}

	return randomHexColor();
}

function getDisplayColor(hexColor) {
	if (paletteFormat === 'hsl') {
		return hexToHsl(hexColor).replace(/\n/g, ' ');
	}

	return hexColor;
}

function syncControlGroup(controlName, value) {
	const group = document.querySelector(`.control-group[data-control="${controlName}"]`);
	if (!group) {
		return;
	}

	group.querySelectorAll('.control-option').forEach((button) => {
		const isActive = button.dataset.value === String(value);
		button.classList.toggle('is-active', isActive);
		button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
	});
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
			resizedPalette.push(existingColor || randomColorByFormat());
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
		return randomColorByFormat();
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

	if (!currentPalette.length) {
		container.innerHTML = '';
		const emptyState = document.createElement('div');
		emptyState.className = 'palette-empty';
		emptyState.textContent = 'Selecciona el formato, el tamaño y da clic en "Generar Paleta".';
		container.appendChild(emptyState);
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
		hexLabel.classList.toggle('color-format-label-active', paletteFormat === 'hex');

		const hexValue = document.createElement('p');
		hexValue.className = 'color-format-value';
		hexValue.textContent = color;

		const hslLabel = document.createElement('p');
		hslLabel.className = 'color-format-label';
		hslLabel.textContent = 'HSL';
		hslLabel.classList.toggle('color-format-label-active', paletteFormat === 'hsl');

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
		const displayColor = getDisplayColor(color);
		card.setAttribute('title', `Clic para copiar ${displayColor}`);
		card.addEventListener('click', (event) => {
			if (event.target.closest('.lock-btn')) {
				return;
			}
			copyColorToClipboard(displayColor);
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

function setQuantity(value, silent = false) {
	paletteSize = Number(value) || 6;
	syncControlGroup('quantity', paletteSize);

	if (!silent) {
		showToast(`Cantidad actualizada a ${paletteSize} colores`);
	}
}

function setFormat(value, silent = false) {
	paletteFormat = value === 'hsl' ? 'hsl' : 'hex';
	syncControlGroup('format', paletteFormat);

	if (!silent) {
		showToast(`Formato actual: ${paletteFormat.toUpperCase()}`);
	}
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
window.setQuantity = setQuantity;
window.setFormat = setFormat;
window.downloadPalette = downloadPalette;

document.addEventListener('DOMContentLoaded', () => {
	setFormat(paletteFormat, true);
	setQuantity(paletteSize, true);
	renderPalette();
});


