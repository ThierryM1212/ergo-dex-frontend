import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

const calculateHeight = (elt: HTMLDivElement) =>
  parseFloat(window.getComputedStyle(elt).height);

export interface ExpandProps {
  children?:
    | ReactNode
    | ReactNode[]
    | string
    | (() => ReactNode | ReactNode[] | string);
  duration?: number;
  opacityDelay?: boolean;
  expanded?: boolean;
}

export const Expand: FC<ExpandProps> = ({
  duration,
  children,
  expanded,
  opacityDelay,
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(calculateHeight(containerRef.current));
    } else {
      setHeight(0);
    }
  }, [expanded, children]);

  return (
    <div
      style={{
        height,
        opacity: expanded ? '1' : '0',
        transition: `height ${duration || 300}ms, opacity ${
          duration || 300
        }ms ${opacityDelay ? `${duration || 300}ms` : ''}`,
        overflow: expanded ? 'initial' : 'hidden',
      }}
    >
      {expanded && (
        <div ref={containerRef as any}>
          {children instanceof Function ? children() : children}
        </div>
      )}
    </div>
  );
};
