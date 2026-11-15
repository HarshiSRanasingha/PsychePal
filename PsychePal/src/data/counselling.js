const languages = ['Sinhala', 'Tamil', 'English'];
const categories = [
  'General counselling',
  'Teen counselling',
  'Child counselling',
  'Educational counselling',
  'Women counselling',
  'Family counselling',
  'Relationship counselling',
  'Grief counselling',
  'Stress and anxiety counselling',
];

function findCounsellors(counsellors, language, category) {
  if (!language || !category) return [];
  return counsellors.filter(counsellor =>
    counsellor.verifiedOn && counsellor.sourceUrl &&
    counsellor.languages.includes(language) && counsellor.categories.includes(category));
}

function findLanguageUnconfirmed(counsellors, category) {
  if (!category) return [];
  return counsellors.filter(counsellor =>
    counsellor.verifiedOn && counsellor.sourceUrl &&
    counsellor.languages.length === 0 && counsellor.categories.includes(category));
}

module.exports = { languages, categories, findCounsellors, findLanguageUnconfirmed };
