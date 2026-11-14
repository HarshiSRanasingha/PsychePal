const test = require('node:test');
const assert = require('node:assert/strict');
const { languages, categories, findCounsellors } = require('../src/data/counselling');
const counsellors = require('../src/data/counsellors.json');

test('counsellor matching requires both the selected language and category', () => {
  const listings = [
    { languages: ['Sinhala', 'English'], categories: ['Child counselling', 'Family counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
    { languages: ['Tamil'], categories: ['Child counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
    { languages: ['English'], categories: ['Grief counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
    { languages: ['English'], categories: ['Child counselling'], verifiedOn: null, sourceUrl: 'https://example.com' },
    { languages: ['English'], categories: ['Child counselling'], verifiedOn: '2026-01-01', sourceUrl: null },
  ];
  assert.deepEqual(findCounsellors(listings, 'English', 'Child counselling'), [listings[0]]);
  assert.deepEqual(findCounsellors(listings, 'Tamil', 'Family counselling'), []);
  assert.deepEqual(findCounsellors(listings, null, 'Child counselling'), []);
  assert.deepEqual(findCounsellors(listings, 'English', null), []);
});

test('each language and category has at least five distinct demo profiles', () => {
  assert.deepEqual(languages, ['Sinhala', 'Tamil', 'English']);
  assert.ok(categories.length >= 7);
  for (const category of ['Child counselling', 'Educational counselling', 'Women counselling', 'Family counselling']) {
    assert.ok(categories.includes(category));
  }
  for (const language of languages) {
    for (const category of categories) {
      const matches = findCounsellors(counsellors, language, category);
      assert.ok(matches.length >= 5, `${language}: ${category} needs five profiles`);
      assert.ok(matches.every(item => item.demo === true && item.contacts.length > 0));
      assert.equal(new Set(matches.map(item => item.id)).size, matches.length);
    }
  }
});
