const colorPicker = document.getElementById('color-picker');
const colorDisplay = document.getElementById('color-display');
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const hslValue = document.getElementById('hsl-value');
const rInput = document.getElementById('r-value');
const gInput = document.getElementById('g-value');
const bInput = document.getElementById('b-value');
const saveColorBtn = document.getElementById('save-color');
const savedColorsContainer = document.getElementById('saved-colors');
const copyButtons = document.querySelectorAll('.copy-btn');
let currentColor = '#3498db';
colorDisplay.style.backgroundColor = currentColor;
colorPicker.addEventListener('input', handleColorPickerChange);
rInput.addEventListener('input', handleRgbInputChange);
gInput.addEventListener('input', handleRgbInputChange);
bInput.addEventListener('input', handleRgbInputChange);
saveColorBtn.addEventListener('click', saveColor);
copyButtons.forEach(btn => {
    btn.addEventListener('click', handleCopyButtonClick);
});
setupSavedColorListeners();
function setupSavedColorListeners() {
    const savedColors = document.querySelectorAll('.saved-color');
    savedColors.forEach(color => {
        color.addEventListener('click', () => {
            const bgColor = getComputedStyle(color).backgroundColor;
            const hexColor = rgbToHex(bgColor);
            updateColor(hexColor);
            colorPicker.value = hexColor;
        });
    });
}

function handleColorPickerChange(e) {
    const newColor = e.target.value;
    updateColor(newColor);
}

function handleRgbInputChange() {
    const r = parseInt(rInput.value) || 0;
    const g = parseInt(gInput.value) || 0;
    const b = parseInt(bInput.value) || 0;
    const clampedR = Math.max(0, Math.min(255, r));
    const clampedG = Math.max(0, Math.min(255, g));
    const clampedB = Math.max(0, Math.min(255, b));
    if (r !== clampedR) rInput.value = clampedR;
    if (g !== clampedG) gInput.value = clampedG;
    if (b !== clampedB) bInput.value = clampedB;
    const hexColor = rgbToHex(`rgb(${clampedR}, ${clampedG}, ${clampedB})`);
    updateColor(hexColor);
    colorPicker.value = hexColor;
}

function updateColor(hexColor) {
    currentColor = hexColor;
    colorDisplay.style.backgroundColor = hexColor;
    hexValue.textContent = hexColor;
    const rgbColor = hexToRgb(hexColor);
    rgbValue.textContent = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
    rInput.value = rgbColor.r;
    gInput.value = rgbColor.g;
    bInput.value = rgbColor.b;
    const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
    hslValue.textContent = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(rgb) {
    if (rgb.startsWith('#')) {
        return rgb;
    }
    const matches = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (!matches) return '#000000';
    const r = parseInt(matches[1]);
    const g = parseInt(matches[2]);
    const b = parseInt(matches[3]);
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function saveColor() {
    const savedColors = document.querySelectorAll('.saved-color');
    for (const color of savedColors) {
        if (rgbToHex(color.style.backgroundColor) === currentColor) {
            return;
        }
    }
    if (savedColors.length >= 5) {
        savedColorsContainer.removeChild(savedColorsContainer.lastChild);
    }
    const newColor = document.createElement('div');
    newColor.className = 'saved-color';
    newColor.style.backgroundColor = currentColor;
    savedColorsContainer.insertBefore(newColor, savedColorsContainer.firstChild);
    newColor.addEventListener('click', () => {
        const bgColor = newColor.style.backgroundColor;
        const hexColor = rgbToHex(bgColor);
        updateColor(hexColor);
        colorPicker.value = hexColor;
    });
}

function handleCopyButtonClick(e) {
    const type = e.target.dataset.value;
    let textToCopy;
    
    switch (type) {
        case 'hex':
            textToCopy = hexValue.textContent;
            break;
        case 'rgb':
            textToCopy = rgbValue.textContent;
            break;
        case 'hsl':
            textToCopy = hslValue.textContent;
            break;
        default:
            return;
    }
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            const originalText = e.target.textContent;
            e.target.textContent = 'Copied!';
            setTimeout(() => {
                e.target.textContent = originalText;
            }, 1500);
        })
        .catch(err => {
            console.error('Unable to copy text: ', err);
            alert('Unable to copy text. Please try again');
        });
}