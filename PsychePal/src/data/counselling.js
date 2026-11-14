const languages = ['Sinhala', 'Tamil', 'English'];
const categories = [
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
    (counsellor.demo === true || (counsellor.verifiedOn && counsellor.sourceUrl)) &&
    counsellor.languages.includes(language) && counsellor.categories.includes(category));
}

module.exports = { languages, categories, findCounsellors };
