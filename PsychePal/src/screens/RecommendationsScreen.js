import React from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import music from '../data/music.json';
import books from '../data/books.json';
import movies from '../data/movies.json';

export default function RecommendationsScreen() {
  return (
    <Screen>
      <Text style={{ fontSize: 23, fontWeight: '800', marginBottom: 14, color: '#29243A' }}>Recommendations</Text>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Music</Text>
      {music.map(x => <SectionCard key={x.id} title={x.title} description={`${x.language} • ${x.category}`} />)}
      <Text style={{ fontWeight: '700', marginVertical: 8 }}>Books</Text>
      {books.map(x => <SectionCard key={x.id} title={x.title} description={`${x.language} • ${x.category}`} />)}
      <Text style={{ fontWeight: '700', marginVertical: 8 }}>Movies</Text>
      {movies.map(x => <SectionCard key={x.id} title={x.title} description={`${x.language} • ${x.category}`} />)}
    </Screen>
  );
}