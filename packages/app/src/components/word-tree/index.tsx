'use client';

import React from 'react';
import styles from './styles.module.css';
import { topics } from './topics';
import { useMounted } from '@/hooks/use-mounted';

interface Items {
  title: string;
  items: Items[];
}

export const TitleComponent: React.FC<{
  level: number;
  text: string;
}> = ({ level, text }) => {
  const TagName = `h${level}` as keyof JSX.IntrinsicElements;

  return <TagName>{text}</TagName>;
};

const getTopicTemplate = ({
  level,
  prevRotation,
}: {
  level: number;
  prevRotation: number;
}) => {
  return (
    { title, items }: Items,
    i = 0,
    a: Items[] = [{} as Items]
  ): React.ReactNode => {
    const range = 180 - 5 * level;
    const step = range / a.length;
    const rotation = step * (a.length / 2) * -1 + step * (i + 0.5);
    const totalRotation = prevRotation + rotation;
    const nextLevel = Math.min(6, level + 1);
    const fixedRotation = totalRotation < -90 || totalRotation > 90 ? -180 : 0;
    const topicTemplate = getTopicTemplate({
      level: nextLevel,
      prevRotation: totalRotation,
    });

    return (
      <details
        key={`${title}-${JSON.stringify(items)}`}
        open
        className={styles.details}
        style={
          {
            '--rotation': `${rotation}deg`,
            '--level': `${level}`,
            '--i': `${i}`,
          } as React.CSSProperties
        }
      >
        <summary
          className={styles.summary}
          style={
            {
              '--fixed-rotation': `${fixedRotation}deg`,
            } as React.CSSProperties
          }
        >
          <TitleComponent level={level} text={title} />
        </summary>
        <div className={styles.items}>
          {items.map((item, index, array) => topicTemplate(item, index, array))}
        </div>
      </details>
    );
  };
};

const WordTree = () => {
  const nodes = getTopicTemplate({ level: 1, prevRotation: 0 });
  return nodes(topics);
};

const Wrapper = () => {
  const mounted = useMounted();
  return <div className={styles.container}>{mounted && <WordTree />}</div>;
};

export default Wrapper;
