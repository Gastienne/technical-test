/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, memo } from 'react';
import './styles.css';

/**
 *
 * @todo:
 * - The button should always be at the right bottom of the page
 * - The button should be hidden and should only appear when we scroll for a certain height eg: ~200px
 * - On clicking it, we should be smoothly taken to the top of the page
 *
 *
 */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  const toggleButtonVisibility = (e: Event) => {
    const target = e.target as HTMLElement;
    const scrolled = target.scrollTop;
    setVisible(scrolled >= 200);
  };

  const scrollToTop = () =>{
    document.body.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    document.body.addEventListener('scroll', toggleButtonVisibility);

    return () => document.body.removeEventListener('scroll', toggleButtonVisibility);
  });

  return (
    <div>
      <button 
        className="btn right-bottom-btn"
        style={{display: visible ? 'inline' : 'none'}}
        onClick={scrollToTop}
      >
        Go to Top
      </button>
    </div>
  );
}

export default memo(ScrollToTopButton);
