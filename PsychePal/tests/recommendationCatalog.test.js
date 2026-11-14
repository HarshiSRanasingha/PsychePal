const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../src/data/recommendationCatalog.json');
const socialLinks = require('../src/data/socialLinks.json');

test('each recommendation type has enough distinct resources in every category', () => {
  for (const [type, minimum] of Object.entries({ Books: 10, Music: 10, Films: 4, 'Web Games': 5 })) {
    const categories = Object.entries(catalog[type]);
    assert.ok(categories.length >= minimum, `${type} needs at least ${minimum} categories`);
    for (const [category, entries] of categories) {
      const titles = entries.map(entry => Array.isArray(entry) ? entry[0] : entry);
      assert.ok(titles.length >= 5, `${type}: ${category} needs at least five resources`);
      assert.equal(new Set(titles).size, titles.length, `${type}: ${category} has duplicate titles`);
      assert.ok(titles.every(title => typeof title === 'string' && title.trim()));
      if (type === 'Web Games') {
        assert.ok(entries.every(entry => Array.isArray(entry) && new URL(entry[1]).protocol === 'https:'));
      }
    }
  }
});

test('social buttons link to the requested platforms', () => {
  assert.deepEqual(socialLinks.map(link => link.title), [
    'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Netflix', 'Twitter / X',
  ]);
  assert.ok(socialLinks.every(link => new URL(link.url).protocol === 'https:'));
});
