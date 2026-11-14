const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../src/data/recommendationCatalog.json');
const socialLinks = require('../src/data/socialLinks.json');
const { recommendationLinks } = require('../src/data/recommendationLinks');

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

test('book, music, and film links search for the selected recommendation', () => {
  const title = "A Story & Song — O'Neil";
  const expectedSearch = "A Story & Song O'Neil";
  const expectations = {
    Books: [['books.google.com', 'q'], ['www.amazon.com', 'k']],
    Music: [['open.spotify.com', null], ['www.youtube.com', 'search_query']],
    Films: [['www.youtube.com', 'search_query'], ['www.netflix.com', 'q'], ['www.justwatch.com', 'q']],
  };

  for (const [type, destinations] of Object.entries(expectations)) {
    const links = recommendationLinks(type, title);
    assert.equal(links.length, destinations.length);
    links.forEach((link, index) => {
      const url = new URL(link.url);
      const [host, parameter] = destinations[index];
      assert.equal(url.protocol, 'https:');
      assert.equal(url.hostname, host);
      const query = parameter ? url.searchParams.get(parameter) : decodeURIComponent(url.pathname.slice('/search/'.length));
      assert.equal(query, type === 'Films' && host === 'www.youtube.com' ? `${title} official trailer` : expectedSearch);
    });
  }
  assert.deepEqual(recommendationLinks('Web Games', title), []);
});
