import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className={styles.container}>
            <button
                className={styles.button}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &larr; Previous
            </button>

            <div className={styles.pages}>
                {pages.map(page => (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className={styles.button}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next &rarr;
            </button>
        </div>
    );
};

export default Pagination;
