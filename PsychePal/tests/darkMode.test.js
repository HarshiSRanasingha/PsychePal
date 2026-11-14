const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const babel = require('@babel/core');

function loadModule(filename, requireModule) {
  const source = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
  const code = babel.transformSync(source, {
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  }).code;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: requireModule });
  return module.exports;
}

const { DarkPalette } = loadModule('src/styles/theme.js', require);
const { adaptStyle } = loadModule('src/styles/darkMode.js', name => {
  if (name === './theme') return { DarkPalette };
  if (name === 'react-native') {
    return {
      StyleSheet: {
        flatten(style) {
          if (!Array.isArray(style)) return style;
          return Object.assign({}, ...style.filter(Boolean));
        },
      },
    };
  }
  return require(name);
});

function contrast(foreground, background) {
  const luminance = hex => {
    const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
    const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('dark mode coordinates backgrounds and legible text without changing light styles', () => {
  const style = { backgroundColor: '#F6E8D9', color: '#4C5145', borderColor: 'rgba(255,255,255,0.8)' };
  assert.equal(adaptStyle(style, false), style);
  const dark = adaptStyle(style, true);
  assert.notEqual(dark.backgroundColor, style.backgroundColor);
  assert.notEqual(dark.borderColor, style.borderColor);
  assert.ok(contrast(dark.color, dark.backgroundColor) >= 4.5);
  assert.ok(contrast(DarkPalette.text, DarkPalette.surface) >= 4.5);
  assert.ok(contrast('#FFFFFF', DarkPalette.button) >= 4.5);
});

test('dark styles remain stable when adapted twice and handle pressed styles', () => {
  const style = { backgroundColor: '#6E927D', color: '#FFFFFF' };
  const dark = adaptStyle(style, true);
  assert.equal(dark.backgroundColor, DarkPalette.button);
  assert.equal(adaptStyle({ backgroundColor: '#496A58' }, true).backgroundColor, DarkPalette.button);
  assert.deepEqual({ ...adaptStyle(dark, true) }, { ...dark });
  const pressed = adaptStyle(({ pressed }) => [style, pressed && { opacity: 0.8 }], true);
  assert.equal(pressed({ pressed: true }).backgroundColor, DarkPalette.button);
  assert.equal(pressed({ pressed: true }).opacity, 0.8);
});
