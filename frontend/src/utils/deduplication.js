/**
 * Utilitários para deduplicação de resultados
 */

/**
 * Remove duplicatas baseado em múltiplos critérios
 * @param {Array} items - Array de itens para deduplica
 * @param {Object} options - Opções de deduplicação
 * @returns {Array} Array sem duplicatas
 */
export const deduplicateResults = (items, options = {}) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const {
    // Critérios primários de deduplicação
    primaryKeys = ['id', 'type'],
    // Critérios secundários (fallback se não houver id)
    secondaryKeys = ['title', 'year', 'type'],
    // Se deve normalizar strings para comparação
    normalizeStrings = true,
    // Se deve manter logs de debug
    debug = false
  } = options;

  const seen = new Set();
  const deduplicated = [];
  const duplicatesFound = [];

  items.forEach((item, index) => {
    // Tentar usar critérios primários primeiro
    let uniqueKey = primaryKeys
      .map(key => {
        let value = item[key];
        if (normalizeStrings && typeof value === 'string') {
          value = value.toLowerCase().trim();
        }
        return value;
      })
      .join('|');

    // Se não tiver ID válido, usar critérios secundários
    if (!item.id || item.id === undefined || item.id === null) {
      uniqueKey = secondaryKeys
        .map(key => {
          let value = item[key];
          if (normalizeStrings && typeof value === 'string') {
            value = value.toLowerCase().trim();
          }
          return value;
        })
        .join('|');
    }

    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      deduplicated.push(item);
    } else if (debug) {
      duplicatesFound.push({ item, index, key: uniqueKey });
    }
  });

  if (debug && duplicatesFound.length > 0) {
    console.log('Duplicatas encontradas e removidas:', duplicatesFound);
    console.log(`Total de itens: ${items.length}, Após deduplicação: ${deduplicated.length}`);
  }

  return deduplicated;
};

/**
 * Função específica para deduplica resultados de filmes e séries
 * @param {Array} movies - Array de filmes
 * @param {Array} series - Array de séries
 * @param {Object} options - Opções específicas
 * @returns {Array} Array combinado e deduplicado
 */
export const deduplicateMoviesAndSeries = (movies = [], series = [], options = {}) => {
  const {
    addTypeField = true,
    movieType = 'movie',
    seriesType = 'tv',
    debug = false
  } = options;

  // Adicionar campo type se solicitado
  const moviesWithType = addTypeField 
    ? movies.map(movie => ({ ...movie, type: movieType }))
    : movies;
    
  const seriesWithType = addTypeField 
    ? series.map(serie => ({ ...serie, type: seriesType }))
    : series;

  // Combinar arrays
  const combined = [...moviesWithType, ...seriesWithType];

  // Deduplica
  return deduplicateResults(combined, {
    primaryKeys: ['id', 'type'],
    secondaryKeys: ['title', 'year', 'type'],
    normalizeStrings: true,
    debug
  });
};

/**
 * Função para verificar integridade dos dados
 * @param {Array} items - Array de itens para verificar
 * @returns {Object} Relatório de integridade
 */
export const checkDataIntegrity = (items) => {
  if (!Array.isArray(items)) {
    return {
      isValid: false,
      error: 'Input não é um array',
      report: null
    };
  }

  const report = {
    totalItems: items.length,
    itemsWithId: 0,
    itemsWithoutId: 0,
    itemsWithTitle: 0,
    itemsWithoutTitle: 0,
    typeDistribution: {},
    duplicateIds: [],
    missingFields: {
      id: [],
      title: [],
      type: []
    }
  };

  const seenIds = new Map();

  items.forEach((item, index) => {
    // Verificar ID
    if (item.id !== undefined && item.id !== null && item.id !== '') {
      report.itemsWithId++;
      
      // Verificar duplicata de ID
      if (seenIds.has(item.id)) {
        const existing = seenIds.get(item.id);
        report.duplicateIds.push({
          id: item.id,
          indices: [existing.index, index],
          items: [existing.item, item]
        });
      } else {
        seenIds.set(item.id, { item, index });
      }
    } else {
      report.itemsWithoutId++;
      report.missingFields.id.push(index);
    }

    // Verificar título
    if (item.title) {
      report.itemsWithTitle++;
    } else {
      report.itemsWithoutTitle++;
      report.missingFields.title.push(index);
    }

    // Verificar tipo
    if (item.type) {
      report.typeDistribution[item.type] = (report.typeDistribution[item.type] || 0) + 1;
    } else {
      report.missingFields.type.push(index);
    }
  });

  return {
    isValid: true,
    error: null,
    report
  };
};
