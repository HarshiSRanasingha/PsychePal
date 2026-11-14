import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import SectionCard from '../components/SectionCard';
import { CozyText as Text } from '../components/CozyText';
import { Theme } from '../styles/theme';

const languages = ['Sinhala', 'Tamil', 'English', 'Hindi', 'Korean'];

const musicTypes = ['Nature', 'Relaxing', 'Calm songs'];
const movieGenres = ['Funny', 'Sad', 'Crime', 'Action', 'Fantasy', 'Mystery', 'Sci-Fi'];
const bookCategories = ['Science', 'Fiction', 'Self-help', 'Fantasy', 'Novels', 'Poem books'];

const bookLists = {
  Science: {
    Sinhala: ['විද්යා විචාරය - කාර්ලෝ පොන්සේකා', 'විඥාන ලෝකය - ඩබ්ලිව්.ඒ. ද සිල්වා', 'බුදු දහම හා විද්යාව - කේ. ශ්‍රී ධම්මානන්ද', 'අතුරු මිතුරු විද්යාව - රොහාන් වීරසිංහ', 'ප්‍රකෘති හා විද්යාව - නන්ද වික්‍රමසිංහ'],
    Tamil: ['அறிவியல் உலகம் - டாக்டர் கே. சிவராமன்', 'விஞ்ஞானச் சிந்தனைகள் - சு. ராமகிருஷ்ணன்', 'பூமியின் கதை - டி. ஜெயகாந்தன்', 'வானவில் அறிவியல் - நா. வானமாமலை', 'இயற்கை மருத்துவம் - முனைவர் சு. நடராஜன்'],
    English: ['The Martian - Andy Weir', 'Project Hail Mary', 'Contact - Carl Sagan', 'Jurassic Park', 'The Andromeda Strain'],
  },
  Fiction: {
    Sinhala: ['ගම්පෙරළිය - මාටින් වික්‍රමසිංහ', 'මධුරාවනිය - ලයනල් විජේතුංග', 'සාගරය - කේ. ජයතිලක', 'අපේ ගම - ගුණදාස අමරසේකර', 'බටහිර - සිරි ගුණසිංහ'],
    Tamil: ['பொன்னியின் செல்வன் - கல்கி', 'சிலம்பதிகாரம் - இளங்கோவடிகள்', 'ஏழாம் உலகம் - ஜெயமோகன்', 'அலை ஒசை - சாண்டில்யன்', 'நெஞ்சுக்கு நீதி - சுஜாதா'],
    English: ['To Kill a Mockingbird', '1984', 'Pride and Prejudice', 'The Great Gatsby', 'Moby Dick'],
  },
  'Self-help': {
    Sinhala: ['ජීවිතය වෙනස් කරගැනීමට දින 7 - රෝහණ ප්‍රියදර්ශන', 'සිත සුවපත් කරගැනීම - මහාචාර්ය කාර්ලෝ පොන්සේකා', 'පුරුදු වල බලය - චන්දිමාල් කුරුප්පු', 'සතුට සඳහා මාර්ගය - ඩී. සී. රණතුංග', 'මානසික ශක්තිය - සමන්ත කුරේ'],
    Tamil: ['அணு பழக்கங்கள் - ஜேம்ஸ் கிளியர்', 'வெற்றியின் 7 பழக்கங்கள் - ஸ்டீபன் கோவி', 'நினைத்தால் நடக்கும் - நெப்போலியன் ஹில்', 'சிந்தனையை மாற்று சித்தியை அடை - அருண் குமார்', 'மனதின் மகத்துவம் - ஸ்வாமி விவேகானந்தர்'],
    English: ['Atomic Habits - James Clear', 'The Power of Now - Eckhart Tolle', 'Daring Greatly - Brené Brown', 'Mindset - Carol Dweck', 'The 7 Habits - Stephen Covey'],
  },
  Fantasy: {
    Sinhala: ['හොබිට් - ටෝල්කීන්', 'සීතල හදවත - උපුල් ශාන්ත සන්නස්ගල', 'මැජික් ලෝකය - ප්‍රියන්ත සෙනෙවිරත්න', 'රාත්‍රී රාජ්‍යය - රොෂාන් රණවීර', 'අඳුරු දූතයා - අසංක ගුණරත්න'],
    Tamil: ['ஹாரி பாட்டர் - ஜே.கே. ரௌலிங்', 'தி லார்ட் ஆப் தி ரிங்ஸ் - டோல்கீன்', 'குரூப்ஸ் - பௌலோ கோயல்ஹோ', 'அலெஃப் - பௌலோ கோயல்ஹோ', 'தி விட்சர் - ஆன்ட்ஜெஜ் சப்கோவ்ஸ்கி'],
    English: ['The Hobbit', "Harry Potter (Sorcerer's Stone)", 'The Name of the Wind', 'Mistborn', 'The Fifth Season'],
  },
  Novels: {
    Sinhala: ['අයිතිය - පියුමාරා පියුමිකා', 'මායා - ගුණදාස අමරසේකර', 'සීතල පිපී - කුමාර සේනානායක', 'අවමෝරුව - වික්ටර් රූබස්', 'තාත්තා - රොහාන් එදිරිසිංහ'],
    Tamil: ['சிலை - சுஜாதா', 'காற்றின் குரல் - ஜெயகாந்தன்', 'ஒரு மனிதன் - சி.எஸ். செல்லப்பா', 'கடலோரம் - அகிலன்', 'புலி - கல்கி'],
    English: ['The Alchemist - Paulo Coelho', 'The Kite Runner', 'Life of Pi', 'The Night Circus', 'Circe'],
  },
  'Poem books': {
    Sinhala: ['මා ඔබට කියමි - ගුණදාස අමරසේකර', 'නිල් අහසේ සිහින - මහාගම සේකර', 'කිරි ගංගා - රත්න ශ්‍රී විජේසිංහ', 'පුෂ්ප යාම - අනුර ප්‍රේමරත්න', 'සුදු පියාපත් - සිසිර විජේසුන්දර'],
    Tamil: ['புதிய காற்று - சு. ராமகிருஷ்ணன்', 'நெருப்பின் சிறகுகள் - பாரதி', 'விடியல் - கண்ணதாசன்', 'கனவின் வாசல் - வைரமுத்து', 'தேனீ - மீரா'],
    English: ['Milk and Honey - Rupi Kaur', 'The Sun and Her Flowers', 'Leaves of Grass - Whitman', 'Emily Dickinson Poems', 'Where the Sidewalk Ends'],
  },
};

const media = [
  ['Music', 'Nature, relaxing music and calm songs', musicTypes],
  ['Movies', 'Genres with language and trailer filters', movieGenres],
  ['Books', 'Books by category and language', bookCategories],
];

const mediaArtwork = {
  Music: { color: '#EDF2FB', accent: '#D5E4F8', symbol: '♫' },
  Movies: { color: '#FDF0ED', accent: '#F9DED8', symbol: '▶' },
  Books: { color: '#F1ECF9', accent: '#E4DAF6', symbol: '▤' },
};

export default function RecommendationsScreen() {
  const [selectedType, setSelectedType] = useState('Music');
  const [selection, setSelection] = useState(null);
  const [language, setLanguage] = useState(null);

  const options = media.find(([type]) => type === selectedType)?.[2] || [];
  const availableLanguages = selectedType === 'Books'
    ? ['Sinhala', 'Tamil', 'English']
    : languages;

  function chooseType(type) {
    setSelectedType(type);
    setSelection(null);
    setLanguage(null);
  }

  function chooseSelection(value) {
    setSelection(value);
    setLanguage(null);
  }

  function openLink(url) {
    Linking.openURL(url).catch(error => {
      Alert.alert('Could not open recommendation', error.message || 'Please try again.');
    });
  }

  function showResults() {
    if (selectedType === 'Books') {
      const books = bookLists[selection]?.[language] || [];
      return books.map(title => (
        <SectionCard key={title} title={title} description={`${selection} • ${language} · Tap to search`} onPress={() => openLink(`https://www.google.com/search?q=${encodeURIComponent(`${title} ${language} book`)}`)} />
      ));
    }
    const search = selectedType === 'Music'
      ? `${selection} ${language} relaxing songs`
      : `${selection} ${language} movie trailer`;
    return Array.from({ length: 10 }, (_, index) => {
      const url = selectedType === 'Music'
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${search} ${index + 1}`)}`
        : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${search} official trailer ${index + 1}`)}`;
      return (
        <SectionCard
          key={`${search}-${index}`}
          title={`${selection} ${language} #${index + 1}`}
          description={selectedType === 'Music' ? 'Open YouTube search results' : 'Open movie trailer search results'}
          onPress={() => openLink(url)}
        />
      );
    });
  }

  return (
    <Screen>
      <View style={styles.page}>
        <View pointerEvents="none" aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
          <View style={[styles.backgroundOrb, styles.backgroundOrbTop]} />
          <View style={[styles.backgroundOrb, styles.backgroundOrbMiddle]} />
          <View style={[styles.backgroundOrb, styles.backgroundOrbBottom]} />
          <Text style={[styles.backgroundSymbol, styles.musicSymbol]}>♫</Text>
          <Text style={[styles.backgroundSymbol, styles.sparkleSymbol]}>✦</Text>
          <Text style={[styles.backgroundSymbol, styles.bookSymbol]}>✧</Text>
        </View>
        <CozyHero
          eyebrow="A LITTLE INSPIRATION"
          title="Find something you love"
          description="A calming song, a story, or something new to explore."
          art="🦋"
          colors={['#FCECE5', '#ECE8F7']}
        />
        <View style={styles.types}>
          {media.map(([type, description]) => (
            <Pressable
              key={type}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedType === type }}
              style={[styles.typeCard, { backgroundColor: mediaArtwork[type].color }, selectedType === type && styles.activeType]}
              onPress={() => chooseType(type)}
            >
              <View pointerEvents="none" aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.typeOrb, { backgroundColor: mediaArtwork[type].accent }, selectedType === type && styles.activeTypeOrb]} />
              <Text pointerEvents="none" aria-hidden accessibilityElementsHidden style={[styles.typeSymbol, selectedType === type && styles.activeTypeSymbol]}>{mediaArtwork[type].symbol}</Text>
              <Text style={[styles.typeTitle, selectedType === type && styles.activeTypeText]}>{type}</Text>
              <Text style={[styles.typeDescription, selectedType === type && styles.activeTypeText]}>{description}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>{selectedType === 'Music' ? 'Music type' : selectedType === 'Movies' ? 'Genre' : 'Book category'}</Text>
        <View style={styles.categories}>
          {options.map(option => (
            <Pressable key={option} style={[styles.category, selection === option && styles.activeCategory]} onPress={() => chooseSelection(option)}>
              <Text style={[styles.categoryText, selection === option && styles.activeCategoryText]}>{option}</Text>
            </Pressable>
          ))}
        </View>
        {selection ? (
          <>
            <Text style={styles.label}>Language</Text>
            <View style={styles.categories}>
              {availableLanguages.map(option => (
                <Pressable key={option} style={[styles.category, language === option && styles.activeCategory]} onPress={() => setLanguage(option)}>
                  <Text style={[styles.categoryText, language === option && styles.activeCategoryText]}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
        {language ? (
          <>
            <Text style={styles.sectionHeading}>{selection} · {language}</Text>
            {showResults()}
          </>
        ) : (
          <Text style={styles.empty}>Choose {selection ? 'a language' : selectedType === 'Music' ? 'a music type' : selectedType === 'Movies' ? 'a genre' : 'a book category'} to see recommendations.</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { width: '100%', maxWidth: 1100, alignSelf: 'center', overflow: 'hidden' },
  backgroundOrb: { position: 'absolute', borderRadius: 999, opacity: 0.45 },
  backgroundOrbTop: { width: 250, height: 250, right: -100, top: 110, backgroundColor: '#F4DDEA' },
  backgroundOrbMiddle: { width: 220, height: 220, left: -125, top: 360, backgroundColor: '#E0EAF7' },
  backgroundOrbBottom: { width: 200, height: 200, right: -110, bottom: 10, backgroundColor: '#F8E5D8' },
  backgroundSymbol: { position: 'absolute', color: '#BFA6CB', opacity: 0.3, fontWeight: '700' },
  musicSymbol: { right: 24, top: 280, fontSize: 44, transform: [{ rotate: '12deg' }] },
  sparkleSymbol: { left: 18, top: 315, fontSize: 26 },
  bookSymbol: { right: 38, bottom: 70, fontSize: 38 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  typeCard: { width: '48%', minHeight: 110, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 16, overflow: 'hidden' },
  typeOrb: { position: 'absolute', width: 100, height: 100, right: -30, bottom: -40, borderRadius: 50, opacity: 0.8 },
  activeTypeOrb: { backgroundColor: '#BFD9C4' },
  typeSymbol: { position: 'absolute', right: 18, top: 12, color: '#91A6B4', opacity: 0.42, fontSize: 30, fontWeight: '800' },
  activeTypeSymbol: { color: '#FFFFFF', opacity: 0.35 },
  activeType: { backgroundColor: Theme.primaryDark, borderColor: Theme.primaryDark },
  typeTitle: { color: Theme.primaryDark, fontSize: 17, fontWeight: '800', marginBottom: 5 },
  typeDescription: { color: '#53665D', fontSize: 12, lineHeight: 17, maxWidth: '80%' },
  activeTypeText: { color: '#FFFFFF' },
  label: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  category: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, marginRight: 6, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.76)' },
  activeCategory: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  categoryText: { color: Theme.text, fontSize: 12 },
  activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },
  sectionHeading: { color: Theme.text, fontSize: 18, fontWeight: '800', marginVertical: 10 },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 18 },
});