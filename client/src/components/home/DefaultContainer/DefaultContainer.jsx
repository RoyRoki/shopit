import React, { useState, useEffect, useRef } from 'react';
import BannerSlider from '../slider/BannerSlider';
import BestProductsByCategory from '../best_section/BestProductsByCategory';
import ProductHeroGroup from '../hero_group/ProductHeroGroup';

import styles from './DefaultContainer.module.css';

const DefaultContainer = ({ withBanner }) => {
  const [sections, setSections] = useState([
    { type: 'banner' },
    { type: 'category', category_id: 1, header: 'Best For Electronic' },
    { type: 'category', category_id: 3, header: 'Beauty, Food, Toys & more' },
    { type: 'hero' },
    { type: 'category', category_id: 2, header: 'Best For Style', max: 8 },
    { type: 'hero' },
    { type: 'category', category_id: 3, header: 'Beauty, Food, Toys & more' },
  ]);

  const observerRef = useRef(null);
  const lastSectionRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSections();
        }
      },
      { threshold: 1.0 }
    );

    if (lastSectionRef.current) {
      observerRef.current.observe(lastSectionRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  const loadMoreSections = () => {
    setSections((prev) => [
      ...prev,
      { type: 'category', category_id: Math.floor(Math.random() * 3) + 1, header: 'Best For You' },
      { type: 'hero' },
    ]);
  };

  return (
    <div className={styles.main_content}>
      {sections.map((section, index) => {
        if (section.type === 'banner' && withBanner ) return <div key={index} className={styles.main_banner}><BannerSlider /></div>;
        if (section.type === 'category') return <div key={index} className={styles.best_section}><BestProductsByCategory category_id={section.category_id} header={section.header} max={section.max} /></div>;
        if (section.type === 'hero') return <div key={index} className={styles.img_hero_group}><ProductHeroGroup /></div>;
        return null;
      })}
      <div ref={lastSectionRef} style={{ height: '10px' }}></div>
    </div>
  );
};

export default DefaultContainer;

