const languagesByTitle = {
  'The Midnight Library — Matt Haig': 'English',
  'Anne of Green Gables — L. M. Montgomery': 'English',
  'The Secret Garden — Frances Hodgson Burnett': 'English',
  'Atomic Habits — James Clear': 'English',
  'The Pursuit of Happyness': 'English',
  'Good Will Hunting': 'English',
  'The Shawshank Redemption': 'English',
  'Little Women (2019)': 'English',
  "The King's Speech": 'English',
  'Blackbird — The Beatles': 'English',
  'Fast Car — Tracy Chapman': 'English',
  'Banana Pancakes — Jack Johnson': 'English',
  'Here Comes the Sun — The Beatles': 'English',
  'Count on Me — Bruno Mars': 'English',
  'Madol Doova — Martin Wickramasinghe': 'Sinhala',
  'Gamperaliya — Martin Wickramasinghe': 'Sinhala',
  'Ponniyin Selvan — Kalki Krishnamurthy': 'Tamil',
  'Sivagamiyin Sapatham — Kalki Krishnamurthy': 'Tamil',
  'Galana Gangaki Jeevithe — Nanda Malini and Narada Disasekera': 'Sinhala',
  'Dedunu Paaya — Nanda Malini': 'Sinhala',
  'Chinna Chinna Aasai — Minmini': 'Tamil',
  'Vennilave Vennilave — Hariharan and Sadhana Sargam': 'Tamil',
  'Ho Gaana Pokuna': 'Sinhala',
  'Machan (2008)': 'Sinhala',
  'Komaali Kings': 'Tamil',
  "'96 (2018)": 'Tamil',
};

function languageForRecommendation(title) {
  return languagesByTitle[title] || 'Not specified';
}

module.exports = { languageForRecommendation };
