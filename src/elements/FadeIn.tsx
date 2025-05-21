import React from 'react';
import { useInView } from 'react-intersection-observer';

interface FadeInProps {
  children: React.ReactNode;
  animation?: string;     // any Animate.css class, e.g. "animate__backInLeft"
  delayClass?: string;    // e.g. "animate__delay-2s"
}

const FadeIn: React.FC<FadeInProps> = ({ children, animation = 'animate__fadeInUp', delayClass = '' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const base = 'animate__animated';
  const classes = inView ? `${base} ${animation} ${delayClass}` : '';

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
};

export default FadeIn;
