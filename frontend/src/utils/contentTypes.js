/**
 * Utilitários para normalização de tipos de conteúdo
 */

/**
 * Tipos de conteúdo aceitos
 */
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
  SERIES: 'series' // Para compatibilidade retroativa
};

/**
 * Normaliza o tipo de conteúdo para um formato padrão
 * @param {string} type - Tipo original
 * @returns {string} Tipo normalizado
 */
export const normalizeContentType = (type) => {
  if (!type) return null;
  
  const normalizedType = type.toLowerCase().trim();
  
  // Mapear tipos alternativos para o padrão
  const typeMap = {
    'tv': CONTENT_TYPES.TV,
    'series': CONTENT_TYPES.TV,
    'serie': CONTENT_TYPES.TV,
    'television': CONTENT_TYPES.TV,
    'movie': CONTENT_TYPES.MOVIE,
    'filme': CONTENT_TYPES.MOVIE,
    'film': CONTENT_TYPES.MOVIE
  };
  
  return typeMap[normalizedType] || type;
};

/**
 * Verifica se um tipo representa uma série/TV
 * @param {string} type - Tipo a verificar
 * @returns {boolean} True se for série/TV
 */
export const isTVType = (type) => {
  if (!type) return false;
  const normalized = normalizeContentType(type);
  return normalized === CONTENT_TYPES.TV;
};

/**
 * Verifica se um tipo representa um filme
 * @param {string} type - Tipo a verificar
 * @returns {boolean} True se for filme
 */
export const isMovieType = (type) => {
  if (!type) return false;
  const normalized = normalizeContentType(type);
  return normalized === CONTENT_TYPES.MOVIE;
};

/**
 * Obtém o texto de exibição para um tipo
 * @param {string} type - Tipo do conteúdo
 * @returns {string} Texto para exibição
 */
export const getContentTypeLabel = (type) => {
  const normalized = normalizeContentType(type);
  
  const labels = {
    [CONTENT_TYPES.MOVIE]: 'Filme',
    [CONTENT_TYPES.TV]: 'Série'
  };
  
  return labels[normalized] || 'Conteúdo';
};

/**
 * Obtém o ícone apropriado para um tipo
 * @param {string} type - Tipo do conteúdo
 * @returns {string} Classe do ícone FontAwesome
 */
export const getContentTypeIcon = (type) => {
  const normalized = normalizeContentType(type);
  
  const icons = {
    [CONTENT_TYPES.MOVIE]: 'fas fa-film',
    [CONTENT_TYPES.TV]: 'fas fa-tv'
  };
  
  return icons[normalized] || 'fas fa-play-circle';
};
