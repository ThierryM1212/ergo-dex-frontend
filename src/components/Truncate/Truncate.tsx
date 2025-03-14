import React from 'react';

import { Tooltip } from '../../ergodex-cdk';

interface TruncateProps {
  children?: string;
  limit?: number;
}

const MAX_SYMBOLS = 7;

const Truncate: React.FC<TruncateProps> = ({ children, limit }) => {
  if (!children) {
    return <></>;
  }

  const symbols = limit ? limit : MAX_SYMBOLS;

  return (
    <>
      {children.length > symbols ? (
        <Tooltip title={children}>{children.slice(0, symbols) + '...'}</Tooltip>
      ) : (
        children
      )}
    </>
  );
};

export { Truncate };
