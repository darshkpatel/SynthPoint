import React, { useState } from 'react';
import styles from './button.module.css';

const Button = (props) => {
  const { children } = props;
  const [focused, setFocused] = useState(false);
  return (
    <>

      <div style={{
        textAlign: 'center', background: focused ? 'rgb(75, 159, 255)' : props.color,
      }}
        onTouchStart={() => setFocused(true)}
        onTouchEnd={() => setFocused(false)}>
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
