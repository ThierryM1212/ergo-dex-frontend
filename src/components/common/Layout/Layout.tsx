import './Layout.less';

import React, { useEffect } from 'react';
import { isBrowser } from 'react-device-detect';

import { useAppLoadingState, useSettings } from '../../../context';
import { Modal } from '../../../ergodex-cdk';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';
import { NetworkHeight } from '../../NetworkHeight/NetworkHeight';
import { SocialLinks } from '../../SocialLinks/SocialLinks';
import { KyaModal } from '../KyaModal/KyaModal';
import { CardanoMaintenance } from './CardanoMaintenance/CardanoMaintenance';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  const [{ theme }] = useSettings();
  const [network] = useSelectedNetwork();

  useBodyClass([theme, network.name.toLowerCase()]);

  const [{ isKYAAccepted }] = useAppLoadingState();

  useEffect(() => {
    if (!isKYAAccepted && isBrowser) {
      Modal.open(({ close }) => <KyaModal onClose={close} />);
    }
  }, [isKYAAccepted]);

  return (
    <div className="layout">
      <div className="glow" />
      <CardanoMaintenance />
      <Header />
      <main>{children}</main>
      <footer>
        <SocialLinks />
        <NetworkHeight />
      </footer>
    </div>
  );
};

export default Layout;
