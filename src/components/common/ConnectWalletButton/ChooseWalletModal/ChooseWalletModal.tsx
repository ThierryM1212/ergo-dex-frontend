import { Trans } from '@lingui/macro';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../common/hooks/useObservable';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  DialogRef,
  Flex,
  LogoutOutlined,
  Modal,
  Tag,
  Typography,
} from '../../../../ergodex-cdk';
import {
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../gateway/api/wallets';
import { Wallet } from '../../../../network/common/Wallet';

const { Body } = Typography;

interface WalletItemProps {
  wallet: Wallet;
  close: (result?: boolean) => void;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  height: 4rem;
  width: 100%;

  &:disabled,
  &:disabled:hover {
    border-color: var(--ergo-default-border-color) !important;
    filter: grayscale(1);

    span {
      color: var(--ergo-default-border-color) !important;
    }
  }
`;

const ExperimentalWalletBox = styled(Box)`
  background: var(--ergo-box-bg-tag);
  border: 1px solid var(--ergo-default-border-color);

  .dark & {
    background: var(--ergo-box-bg-contrast);
  }
`;

const WalletView: React.FC<WalletItemProps> = ({ wallet, close }) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<ReactNode | undefined>(undefined);

  const handleClick = () => {
    setLoading(true);
    connectWallet(wallet).subscribe(
      (isConnected) => {
        setLoading(false);
        if (typeof isConnected === 'boolean' && isConnected) {
          close(true);
        } else if (isConnected) {
          setWarning(isConnected);
        }
      },
      () => {
        setLoading(false);
        window.open(wallet.extensionLink);
      },
    );
  };

  const handleCheck = () => setChecked((prev) => !prev);

  switch (wallet.definition) {
    case 'experimental':
      return (
        <ExperimentalWalletBox padding={2}>
          <Flex col>
            <Flex.Item marginBottom={2} alignSelf="flex-end">
              <Tag color="gold">
                <Trans>Experimental</Trans>
              </Tag>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <Checkbox checked={checked} onChange={handleCheck}>
                <Trans>
                  This wallet may not always work as expected. I understand what
                  I do and will use it at my own risk.
                </Trans>
              </Checkbox>
            </Flex.Item>
            {warning && (
              <Flex.Item marginBottom={2}>
                <Alert
                  type="warning"
                  description={warning}
                  style={{ width: '100%' }}
                />
              </Flex.Item>
            )}
            <WalletButton
              size="large"
              disabled={!checked}
              onClick={handleClick}
              loading={loading}
            >
              <Flex.Item flex={1} display="flex" align="center">
                <Body>{wallet.name}</Body>
              </Flex.Item>
              {wallet.icon}
            </WalletButton>
          </Flex>
        </ExperimentalWalletBox>
      );
    case 'recommended':
      return (
        <Flex col>
          <Flex.Item marginBottom={2} alignSelf="flex-end">
            <Tag color="success">
              <Trans>Recommended</Trans>
            </Tag>
          </Flex.Item>
          {warning && (
            <Flex.Item marginBottom={2}>
              <Alert
                type="warning"
                description={warning}
                style={{ width: '100%' }}
              />
            </Flex.Item>
          )}
          <WalletButton size="large" onClick={handleClick} loading={loading}>
            <Flex.Item flex={1} display="flex" align="center">
              <Body>{wallet.name}</Body>
            </Flex.Item>
            {wallet.icon}
          </WalletButton>
        </Flex>
      );
    default:
      return (
        <>
          <WalletButton size="large" onClick={handleClick} loading={loading}>
            <Flex.Item flex={1} display="flex" align="center">
              {wallet.name}
            </Flex.Item>
            {wallet.icon}
          </WalletButton>
          {warning && (
            <Flex.Item marginBottom={2}>
              <Alert
                type="warning"
                description={warning}
                style={{ width: '100%' }}
              />
            </Flex.Item>
          )}
        </>
      );
  }
};

type ChooseWalletModalProps = DialogRef<boolean>;

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
}): JSX.Element => {
  const [wallets] = useObservable(wallets$, [], []);
  const [selectedWallet] = useObservable(selectedWallet$);

  const handleDisconnectWalletClick = () => {
    disconnectWallet();
  };

  return (
    <>
      <Modal.Title>
        <Trans>Select a wallet</Trans>
      </Modal.Title>
      <Modal.Content width={400}>
        <Flex col>
          {wallets.map((wallet, index) => (
            <Flex.Item
              marginBottom={
                index === wallets.length - 1 && !selectedWallet ? 0 : 4
              }
              key={index}
            >
              <WalletView close={close} wallet={wallet} />
            </Flex.Item>
          ))}
          {selectedWallet && (
            <Button
              type="link"
              icon={<LogoutOutlined />}
              onClick={handleDisconnectWalletClick}
            >
              {' '}
              <Trans>Disconnect wallet</Trans>
            </Button>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
