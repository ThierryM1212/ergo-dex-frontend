import { AssetInfo } from '@ergolabs/ergo-sdk';
import { t, Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import {
  Animation,
  Box,
  Button,
  Flex,
  Form,
  Typography,
  useFormContext,
} from '../../../ergodex-cdk';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { Truncate } from '../../Truncate/Truncate';
import {
  TokenAmountInput,
  TokenAmountInputValue,
} from './TokenAmountInput/TokenAmountInput';
import { TokenSelect } from './TokenSelect/TokenSelect';

export interface TokenControlValue {
  amount?: TokenAmountInputValue;
  asset?: AssetInfo;
}

export interface TokenControlProps {
  readonly label?: ReactNode;
  readonly value?: TokenControlValue;
  readonly onChange?: (value: TokenControlValue) => void;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export interface TokenControlFormItemProps {
  readonly name: string;
  readonly label?: ReactNode;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export interface NewTokenControlProps {
  readonly amountName?: string;
  readonly tokenName?: string;
  readonly label?: ReactNode;
  readonly maxButton?: boolean;
  readonly handleMaxButtonClick?: (balance: Currency) => Currency;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly assets$?: Observable<AssetInfo[]>;
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export const TokenControlFormItem: FC<NewTokenControlProps> = ({
  amountName,
  tokenName,
  label,
  maxButton,
  assets,
  assets$,
  disabled,
  readonly,
  noBottomInfo,
  handleMaxButtonClick,
}) => {
  const { form } = useFormContext();
  const [balance, balanceLoading] = useAssetsBalance();
  const [selectedAsset] = useObservable(
    tokenName
      ? form.controls[tokenName].valueChangesWithSilent$
      : of(undefined),
  );
  const _handleMaxButtonClick = (maxBalance: Currency) => {
    if (amountName) {
      const newAmount = handleMaxButtonClick
        ? handleMaxButtonClick(maxBalance)
        : maxBalance;

      form.controls[amountName].patchValue(
        newAmount.isPositive() ? newAmount : maxBalance,
      );
    }
  };

  const isAmountReadOnly = () => {
    if (typeof readonly === 'boolean') {
      return readonly;
    }

    return readonly === 'amount';
  };

  const isAssetReadOnly = () => {
    if (typeof readonly === 'boolean') {
      return readonly;
    }

    return readonly === 'asset';
  };

  return (
    <Box padding={4} contrast borderRadius="m">
      <Flex col>
        <Flex.Item marginBottom={2}>
          <Typography.Body type="secondary">{label}</Typography.Body>
        </Flex.Item>
        <Flex.Item display="flex" row marginBottom={noBottomInfo ? 0 : 2}>
          <Flex.Item marginRight={2} flex={1}>
            {amountName && (
              <Form.Item name={amountName}>
                {({ value, onChange }) => (
                  <TokenAmountInput
                    readonly={isAmountReadOnly()}
                    value={value}
                    asset={selectedAsset}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            )}
          </Flex.Item>
          <Flex.Item>
            {tokenName && (
              <Form.Item name={tokenName}>
                {({ value, onChange }) => (
                  <TokenSelect
                    assets$={assets$}
                    assets={assets}
                    readonly={isAssetReadOnly()}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            )}
          </Flex.Item>
        </Flex.Item>
        {!noBottomInfo && (
          <Flex.Item marginBottom={1} marginTop={1}>
            <Flex
              direction="row"
              align="center"
              className="token-control-bottom-panel"
            >
              <Animation.Expand
                expanded={selectedAsset !== undefined && !balanceLoading}
              >
                {() => (
                  <>
                    <Flex.Item marginRight={2}>
                      <Typography.Body>
                        {t`Balance: ${balance.get(selectedAsset).toString()}`}{' '}
                        <Truncate limit={10}>
                          {balance.get(selectedAsset).asset.name}
                        </Truncate>
                      </Typography.Body>
                    </Flex.Item>
                    {!!balance.get(selectedAsset) && maxButton && (
                      <Button
                        ghost
                        type="primary"
                        size="small"
                        onClick={() =>
                          _handleMaxButtonClick(balance.get(selectedAsset))
                        }
                      >
                        <Trans>Max</Trans>
                      </Button>
                    )}
                  </>
                )}
              </Animation.Expand>
            </Flex>
          </Flex.Item>
        )}
      </Flex>
    </Box>
  );
};
