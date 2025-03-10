import React, { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import {
  ArrowRightOutlined,
  Box,
  Flex,
  Typography,
} from '../../../../../ergodex-cdk';
import { TokenIconPair } from '../../../../AssetIconPair/TokenIconPair';
import { Operation } from '../../../../common/TxHistory/types';
import { TokenTitle } from '../../../../TokenTitle';

const SwapAssetsView: FC<{ from: Currency; to: Currency }> = ({ from, to }) => (
  <Flex stretch align="center">
    <Flex.Item display="flex" marginRight={2}>
      <TokenTitle asset={from.asset} size="small" />
    </Flex.Item>
    <Flex.Item display="flex" marginRight={2}>
      <ArrowRightOutlined />
    </Flex.Item>
    <Flex.Item display="flex">
      <TokenTitle asset={to.asset} size="small" />
    </Flex.Item>
  </Flex>
);

const DepositAndRedeemAssetsView: FC<{ x: Currency; y: Currency }> = ({
  x,
  y,
}) => (
  <Flex stretch align="center">
    <Flex.Item marginRight={2}>
      <TokenIconPair size="small" assetX={x.asset} assetY={y.asset} />
    </Flex.Item>
    <Flex.Item col display="flex" marginRight={2}>
      <Typography.Body strong>{x.asset.name}</Typography.Body>
      <Typography.Body strong>{x.isPositive() && x.toString()}</Typography.Body>
    </Flex.Item>
    <Flex.Item col display="flex">
      <Typography.Body secondary>{y.asset.name}</Typography.Body>
      <Typography.Body secondary>
        {y.isPositive() && y.toString()}
      </Typography.Body>
    </Flex.Item>
  </Flex>
);

export interface AssetsColumnProps {
  readonly operation: Operation;
}

export const AssetsColumn: FC<AssetsColumnProps> = ({ operation }) => (
  <Box bordered={false} height="100%" padding={[0, 4]}>
    {operation.type === 'swap' ? (
      <SwapAssetsView from={operation.assetX} to={operation.assetY} />
    ) : (
      <DepositAndRedeemAssetsView x={operation.assetX} y={operation.assetY} />
    )}
  </Box>
);
