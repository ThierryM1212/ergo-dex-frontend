import React from 'react';

import { Flex, List } from '../../../ergodex-cdk';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { TokenListItem } from './TokenListItem/TokenListItem';

export const TokensTab: React.FC = () => {
  const [balance] = useAssetsBalance();

  return (
    <Flex col>
      <List
        rowKey="id"
        dataSource={balance.values().filter((b) => b.isPositive())}
        height={250}
        gap={2}
      >
        {(item) => <TokenListItem currency={item} />}
      </List>
    </Flex>
  );
};
