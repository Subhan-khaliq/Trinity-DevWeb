import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`${styles.card} ${className}`} {...props}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Card;
