'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ILink } from './base';
import { Subscription, fromEvent } from 'rxjs';

const SpotlightLink = ({ label }: Pick<ILink, 'label'>) => {
  const linkRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState([0, 0]);
  const [bounding, setBounding] = useState([0, 0]);

  function setLinksPositions() {
    if (linkRef.current) {
      const a = linkRef.current;
      const bounding = a.getBoundingClientRect();
      setBounding([bounding.x, bounding.y]);
    }
  }

  useEffect(() => {
    let subscription: Subscription | null = null;
    if (linkRef.current) {
      const mouseMove$ = fromEvent<MouseEvent>(linkRef.current, 'mousemove');

      subscription = mouseMove$.subscribe(event => {
        setPosition([event.clientX, event.clientY]);
      });
    }
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [linkRef]);

  useEffect(() => {
    setLinksPositions();
  }, []);

  useEffect(() => {
    const resize$ = fromEvent(window, 'resize');

    const subscription = resize$.subscribe(() => {
      setLinksPositions();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const LIGHT_SIZE = '300px';
  const LIGHT_COLOR = '#9333ea';
  const HIGHLIGHT_COLOR = '#d8b4fe';

  const CustomStyle = useMemo(() => {
    return {
      textDecoration: 'none',
      color: 'transparent',
      display: 'inline-block',
      backgroundImage: `radial-gradient(${HIGHLIGHT_COLOR}, ${LIGHT_COLOR}, ${LIGHT_COLOR})`,
      backgroundSize: `${LIGHT_SIZE} ${LIGHT_SIZE}`,
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: `calc(${position[0]}px - ${bounding[0]}px - calc(${LIGHT_SIZE} / 2))`,
      backgroundPositionY: `calc(${position[1]}px - ${bounding[0]}px - calc(${LIGHT_SIZE} / 2))`,
      backgroundColor: `${LIGHT_COLOR}`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
    };
  }, [position, bounding]);

  return (
    <div ref={linkRef} style={CustomStyle}>
      {label}
    </div>
  );
};

export { SpotlightLink };
