function recommendationLinks(type, title) {
  const search = encodeURIComponent(title.replace(/ — /g, ' '));

  switch (type) {
    case 'Books':
      return [
        { label: 'Search Google Books', url: `https://books.google.com/books?q=${search}` },
        { label: 'Search Amazon Books and prices', url: `https://www.amazon.com/s?i=stripbooks&k=${search}` },
      ];
    case 'Music':
      return [
        { label: 'Search Spotify', url: `https://open.spotify.com/search/${search}` },
        { label: 'Search YouTube', url: `https://www.youtube.com/results?search_query=${search}` },
      ];
    case 'Films':
      return [
        { label: 'Search YouTube trailers', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} official trailer`)}` },
        { label: 'Search Netflix', url: `https://www.netflix.com/search?q=${search}` },
        { label: 'Search JustWatch (US)', url: `https://www.justwatch.com/us/search?q=${search}` },
      ];
    default:
      return [];
  }
}

module.exports = { recommendationLinks };
