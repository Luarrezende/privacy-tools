import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalResults, 
  onPageChange, 
  hasNextPage, 
  hasPreviousPage 
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Primeira página
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={styles.pageButton}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className={styles.ellipsis}>...</span>);
      }
    }

    // Páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    // Última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className={styles.ellipsis}>...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={styles.pageButton}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        <span>Total: {totalResults} resultados</span>
      </div>
      
      <div className={styles.controls}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className={`${styles.navButton} ${!hasPreviousPage ? styles.disabled : ''}`}
        >
          <i className="fas fa-chevron-left"></i>
          Anterior
        </button>

        <div className={styles.pageNumbers}>
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`${styles.navButton} ${!hasNextPage ? styles.disabled : ''}`}
        >
          Próximo
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
