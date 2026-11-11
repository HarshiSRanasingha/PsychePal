import { StyleSheet } from 'react-native';

const foregroundColors = {
  '#34433d': '#e5ece7',
  '#496a58': '#b9d5c2',
  '#6e927d': '#9fc8aa',
  '#7d8880': '#aebbb2',
  '#a94442': '#ef9992',
};

function luminance(red, green, blue) {
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

function darkenBackground(color) {
  if (typeof color !== 'string') return color;
  if (/^rgba?\(\s*255,\s*255,\s*255/i.test(color)) return '#36443c';
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) return color;

  const hex = match[1];
  const channels = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
  if (luminance(...channels) < 0.66) return color;
  const base = [24, 32, 27];
  return `#${channels.map((channel, index) => Math.round(channel * 0.18 + base[index] * 0.82).toString(16).padStart(2, '0')).join('')}`;
}

export function adaptStyle(style, darkMode) {
  if (!darkMode || style == null) return style;
  if (typeof style === 'function') {
    return (...args) => adaptStyle(style(...args), darkMode);
  }

  const flattened = StyleSheet.flatten(style);
  if (!flattened) return style;

  const adapted = { ...flattened };
  if (adapted.backgroundColor) {
    adapted.backgroundColor = darkenBackground(adapted.backgroundColor);
  }
  if (adapted.borderColor) {
    adapted.borderColor = darkenBackground(adapted.borderColor);
  }
  if (typeof adapted.color === 'string') {
    adapted.color = foregroundColors[adapted.color.toLowerCase()] || adapted.color;
  }
  return adapted;
}
