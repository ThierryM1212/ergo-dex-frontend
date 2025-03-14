import React, { FC, ReactNode } from 'react';

import { Flex, Typography } from '../../../ergodex-cdk';

interface TableListItemViewColumnProps {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly width?: number | string;
  readonly marginRight?: number;
  readonly flex?: number;
}

export const Column: FC<TableListItemViewColumnProps> = ({
  title,
  children,
  width,
  marginRight,
  flex,
}) => (
  <Flex.Item marginRight={marginRight} flex={flex} style={{ height: '100%' }}>
    <Flex col stretch style={{ width }}>
      <Flex.Item marginBottom={1}>
        <Typography.Footnote>{title}</Typography.Footnote>
      </Flex.Item>
      <Flex col stretch justify="center">
        {children}
      </Flex>
    </Flex>
  </Flex.Item>
);
