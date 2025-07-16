import React from 'react';
import { filterOptions } from '../../../constants/filters';
import styles from './ActiveFilters.module.css';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const getActiveFilters = () => {
    const active = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sortBy') {
        let label = '';
        
        // Encontrar o label correspondente
        switch (key) {
          case 'type':
            label = filterOptions.types.find(option => option.value === value)?.label || value;
            break;
          case 'year':
            label = filterOptions.years.find(option => option.value === value)?.label || value;
            break;
          default:
            label = value;
        }
        
        active.push({ key, value, label });
      }
    });
    
    return active;
  };

  const activeFilters = getActiveFilters();
  const sortBy = filters.sortBy !== 'relevance' ? 
    filterOptions.sortOptions.find(option => option.value === filters.sortBy) : null;

  if (activeFilters.length === 0 && !sortBy) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          <i className="fas fa-filter"></i>
          Filtros Aplicados
        </h4>
        {(activeFilters.length > 0 || sortBy) && (
          <button 
            className={styles.clearAll}
            onClick={onClearAll}
            title="Limpar todos os filtros"
          >
            <i className="fas fa-times"></i>
            Limpar Tudo
          </button>
        )}
      </div>
      
      <div className={styles.filters}>
        {/* Filtros ativos */}
        {activeFilters.map(filter => (
          <div key={filter.key} className={styles.filterTag}>
            <span>{filter.label}</span>
            <button 
              onClick={() => onRemoveFilter(filter.key)}
              className={styles.removeBtn}
              title={`Remover filtro: ${filter.label}`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        
        {/* Ordenação */}
        {sortBy && (
          <div className={styles.sortTag}>
            <i className="fas fa-sort"></i>
            <span>{sortBy.label}</span>
            <button 
              onClick={() => onRemoveFilter('sortBy')}
              className={styles.removeBtn}
              title={`Remover ordenação: ${sortBy.label}`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
