const test = require('node:test');
const assert = require('node:assert/strict');
const { languages, categories, findCounsellors, findLanguageUnconfirmed } = require('../src/data/counselling');
const counsellors = require('../src/data/counsellors.json');

test('counsellor matching requires both the selected language and category', () => {
  const listings = [
    { languages: ['Sinhala', 'English'], categories: ['Child counselling', 'Family counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
    { languages: ['Tamil'], categories: ['Child counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
    { languages: ['English'], categories: ['Grief counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
    { languages: ['English'], categories: ['Child counselling'], verifiedOn: null, sourceUrl: 'https://example.com' },
    { languages: ['English'], categories: ['Child counselling'], verifiedOn: '2026-01-01', sourceUrl: null },
    { languages: [], categories: ['Child counselling'], verifiedOn: '2026-01-01', sourceUrl: 'https://example.com' },
  ];
  assert.deepEqual(findCounsellors(listings, 'English', 'Child counselling'), [listings[0]]);
  assert.deepEqual(findCounsellors(listings, 'Tamil', 'Family counselling'), []);
  assert.deepEqual(findCounsellors(listings, null, 'Child counselling'), []);
  assert.deepEqual(findCounsellors(listings, 'English', null), []);
  assert.deepEqual(findLanguageUnconfirmed(listings, 'Child counselling'), [listings[5]]);
  assert.deepEqual(findLanguageUnconfirmed(listings, null), []);
});

test('counselling directory contains only sourced real services and does not invent languages', () => {
  assert.deepEqual(languages, ['Sinhala', 'Tamil', 'English']);
  assert.ok(categories.length >= 7);
  assert.equal(new Set(counsellors.map(item => item.id)).size, counsellors.length);
  assert.ok(counsellors.every(item => !item.demo && item.verifiedOn && new URL(item.sourceUrl).protocol === 'https:' && item.contacts.length > 0));
  for (const language of languages) {
    assert.ok(findCounsellors(counsellors, language, 'Relationship counselling').some(item => item.id === 'imh'));
    assert.ok(!findCounsellors(counsellors, language, 'Women counselling').some(item => item.id === 'women-in-need'));
    assert.ok(!findCounsellors(counsellors, language, 'General counselling').some(item => item.id === 'ncmh'));
  }
  assert.ok(findLanguageUnconfirmed(counsellors, 'General counselling').some(item => item.id === 'ncmh'));
  assert.ok(findLanguageUnconfirmed(counsellors, 'Women counselling').some(item => item.id === 'women-in-need'));
});
