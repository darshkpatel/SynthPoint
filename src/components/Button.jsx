import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.css';

const Button = (props) => {
  const { children, color } = props;
  return (
    <>

      <div className={styles.container} style={{ backgroundColor: color || 'black' }}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Button;

Button.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};
