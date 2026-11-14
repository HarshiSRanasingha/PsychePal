const test = require('node:test');
const assert = require('node:assert/strict');
const { languages, categories, findCounsellors } = require('../src/data/counselling');
const support = require('../src/data/supportContacts.json');

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

test('requested filter options and fallback support contacts are available', () => {
  assert.deepEqual(languages, ['Sinhala', 'Tamil', 'English']);
  assert.ok(categories.length >= 7);
  for (const category of ['Child counselling', 'Educational counselling', 'Women counselling', 'Family counselling']) {
    assert.ok(categories.includes(category));
  }
  for (const id of ['nimh-helpline', 'nimh-hospital', 'sumithrayo-colombo']) {
    assert.ok(support.some(service => service.id === id && service.contacts.length));
  }
});
