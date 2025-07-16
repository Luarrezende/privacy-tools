import { normalizeContentType, isTVType, isMovieType } from '../utils/contentTypes';

export const filterOptions = {
  types: [
    { value: '', label: 'Todos os Tipos' },
    { value: 'filme', label: 'Filmes' },
    { value: 'serie', label: 'Séries' }
  ],

  years: [
    { value: '', label: 'Todos os Anos' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2010-2014', label: '2010-2014' },
    { value: '2000-2009', label: '2000-2009' },
    { value: '1990-1999', label: '1990-1999' },
    { value: '1980-1989', label: '1980-1989' },
    { value: 'older', label: 'Mais Antigos' }
  ],

  sortOptions: [
    { value: 'relevance', label: 'Relevância' },
    { value: 'year-desc', label: 'Mais Recente' },
    { value: 'year-asc', label: 'Mais Antigo' },
    { value: 'title-asc', label: 'Título A-Z' },
    { value: 'title-desc', label: 'Título Z-A' }
  ]
};

export const applyFilters = (items, filters) => {
  let filteredItems = [...items];

  if (filters.type) {
    filteredItems = filteredItems.filter(item => {
      const itemType = item.type || item.Type;
      
      if (filters.type === 'filme') {
        return isMovieType(itemType);
      } else if (filters.type === 'serie') {
        return isTVType(itemType);
      }
      
      return true;
    });
  }

  if (filters.year) {
    filteredItems = filteredItems.filter(item => {
      const itemYear = parseInt(item.year || item.Year);
      
      if (filters.year === '2010-2014') {
        return itemYear >= 2010 && itemYear <= 2014;
      } else if (filters.year === '2000-2009') {
        return itemYear >= 2000 && itemYear <= 2009;
      } else if (filters.year === '1990-1999') {
        return itemYear >= 1990 && itemYear <= 1999;
      } else if (filters.year === '1980-1989') {
        return itemYear >= 1980 && itemYear <= 1989;
      } else if (filters.year === 'older') {
        return itemYear < 1980;
      } else {
        return itemYear === parseInt(filters.year);
      }
    });
  }

  if (filters.sortBy) {
    filteredItems.sort((a, b) => {
      switch (filters.sortBy) {
        case 'year-desc':
          return parseInt(b.year || b.Year) - parseInt(a.year || a.Year);
        case 'year-asc':
          return parseInt(a.year || a.Year) - parseInt(b.year || b.Year);
        case 'title-asc':
          return (a.title || a.Title).localeCompare(b.title || b.Title);
        case 'title-desc':
          return (b.title || b.Title).localeCompare(a.title || a.Title);
        default:
          return 0;
      }
    });
  }

  return filteredItems;
};
