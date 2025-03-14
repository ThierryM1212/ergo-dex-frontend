import './TokenListItem.less';

import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

import { Box, Flex, Typography } from '../../../../../ergodex-cdk';
import { useAssetsBalance } from '../../../../../gateway/api/assetBalance';
import { AssetIcon } from '../../../../AssetIcon/AssetIcon';
import { Truncate } from '../../../../Truncate/Truncate';

interface TokenListItemProps {
  asset: AssetInfo;
  iconName?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const TokenListItem: React.FC<TokenListItemProps> = ({ asset, onClick }) => {
  const [balance] = useAssetsBalance();

  return (
    <Box
      className="token-item"
      onClick={onClick}
      borderRadius="m"
      padding={[3, 4]}
      bordered={false}
    >
      <Flex align="center" style={{ width: '100%' }}>
        <AssetIcon size="large" asset={asset} />
        <Box className="token-item__box" padding={0} bordered={false}>
          <Box className="token-item__box-left" padding={0} bordered={false}>
            <Typography.Text className="token-item__box-left-symbol">
              <Truncate>{asset.name}</Truncate>
            </Typography.Text>
          </Box>
        </Box>
        <Flex.Item flex={1} justify="flex-end">
          <Typography.Body>{balance.get(asset).toString()}</Typography.Body>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export { TokenListItem };
