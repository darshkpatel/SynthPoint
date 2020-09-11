import React from 'react';
import styles from './button.module.css';

const Button = (props) => {
  const { children } = props;
  return (
    <>

      <div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Button;

Button.propTypes = {

};
