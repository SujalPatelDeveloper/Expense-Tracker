import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';

const CountUp = ({ end, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const { formatAmount } = useTransactions();

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const currentCount = percentage * end;
      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {formatAmount(count)}
      {suffix}
    </span>
  );
};

export default CountUp;
