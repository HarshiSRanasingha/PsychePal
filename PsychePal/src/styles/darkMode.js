import { StyleSheet } from 'react-native';
import { DarkPalette } from './theme';

const foregroundColors = {
  '#34433d': DarkPalette.text,
  '#496a58': DarkPalette.primaryDark,
  '#6e927d': DarkPalette.primary,
  '#7d8880': DarkPalette.muted,
  '#a94442': '#FFB6C7',
};

function parseColor(color) {
  if (typeof color !== 'string') return null;
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return [0, 2, 4].map(index => parseInt(hex[1].slice(index, index + 2), 16));
  }
  const rgb = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i);
  return rgb ? rgb.slice(1, 4).map(Number) : null;
}

function darkenBackground(color) {
  if (typeof color !== 'string') return color;
  const knownColors = {
    '#fbf8f3': DarkPalette.background,
    '#fffefa': DarkPalette.surface,
    '#6e927d': DarkPalette.button,
    '#729a87': DarkPalette.button,
    '#eae6de': DarkPalette.border,
  };
  const known = knownColors[color.toLowerCase()];
  if (known) return known;

  const channels = parseColor(color);
  if (!channels || Math.max(...channels) < 168) return color;
  const base = [29, 11, 25];
  return `#${channels.map((channel, index) => Math.round(channel * 0.12 + base[index]).toString(16).padStart(2, '0')).join('')}`;
}

function lightenForeground(color) {
  if (typeof color !== 'string') return color;
  const known = foregroundColors[color.toLowerCase()];
  if (known) return known;
  const channels = parseColor(color);
  if (!channels) return color;
  const brightness = (0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]) / 255;
  return brightness < 0.65 ? DarkPalette.muted : color;
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
  if (adapted.color) {
    adapted.color = lightenForeground(adapted.color);
  }
  return adapted;
}
