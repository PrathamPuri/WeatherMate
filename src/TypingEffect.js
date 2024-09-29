// TypingEffect.js
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export const TypingEffect = () => { 
  const textElementRef = useRef(null);

  useEffect(() => {
    const typingEffect = new Typed(textElementRef.current, {
      strings: ["Enter Location To See Weather"],
      loop: true,
      typeSpeed: 30,
      backSpeed: 15,
      startDelay: 1500,
      backDelay: 2000
    });

    return () => {
      typingEffect.destroy(); 
    };
  }, []);

  return <span ref={textElementRef} id="text" />;
};
