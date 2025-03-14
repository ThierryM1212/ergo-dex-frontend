import React, { Suspense, useEffect } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { applicationConfig } from './applicationConfig';
import { useObservable } from './common/hooks/useObservable';
import { initializeApp } from './common/streams/appTick';
import Layout from './components/common/Layout/Layout';
import { MobilePlug } from './components/MobilePlug/MobilePlug';
import { AppLoadingProvider, SettingsProvider } from './context';
import { globalHistory } from './createBrowserHistory';
import { ContextModalProvider, notification } from './ergodex-cdk';
import {
  initializeNetworks,
  networksInitialized$,
  useSelectedNetwork,
} from './gateway/common/network';
import { LanguageProvider } from './i18n/i18n';
import { AddLiquidityOrCreatePool } from './pages/AddLiquidityOrCreatePool/AddLiquidityOrCreatePool';
import { Liquidity } from './pages/Pool/Liquidity';
import { LockLiquidity } from './pages/Pool/LockLiquidity/LockLiquidity';
import { RelockLiquidity } from './pages/Pool/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/Pool/RemoveLiquidity/RemoveLiquidity';
import { WithdrawalLiquidity } from './pages/Pool/WithdrawalLiquidity/WithdrawalLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { Swap } from './pages/Swap/Swap';
import {
  NOTIFICATION_KEY,
  openCardanoFaucetNotification,
} from './services/notifications/СardanoFaucet/СardanoFaucet';

const NotFound = () => <Redirect to="/swap" />;

const Application = () => {
  return (
    <Router history={globalHistory}>
      <AppLoadingProvider>
        <SettingsProvider>
          <GoogleReCaptchaProvider
            reCaptchaKey={applicationConfig.reCaptchaKey}
          >
            <LanguageProvider>
              <ContextModalProvider>
                <Layout>
                  <BrowserView>
                    <Switch>
                      <Route path="/" exact>
                        <Redirect to="/swap" />
                      </Route>
                      <Route path="/swap" exact component={Swap} />
                      <Route path="/pool" exact component={Liquidity} />
                      <Route
                        path="/pool/add"
                        exact
                        component={AddLiquidityOrCreatePool}
                      />
                      <Route
                        path="/pool/create"
                        exact
                        component={AddLiquidityOrCreatePool}
                      />
                      <Route
                        path="/pool/:poolId/remove"
                        exact
                        component={RemoveLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/lock"
                        exact
                        component={LockLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/relock"
                        exact
                        component={RelockLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/withdrawal"
                        exact
                        component={WithdrawalLiquidity}
                      />
                      <Route
                        path="/pool/:poolId/add"
                        exact
                        component={AddLiquidityOrCreatePool}
                      />
                      <Route
                        path="/pool/:poolId"
                        exact
                        component={PoolOverview}
                      />
                      <Route component={NotFound} />
                    </Switch>
                  </BrowserView>
                  <MobileView>
                    <MobilePlug />
                  </MobileView>
                </Layout>
              </ContextModalProvider>
            </LanguageProvider>
          </GoogleReCaptchaProvider>
        </SettingsProvider>
      </AppLoadingProvider>
    </Router>
  );
};

export const ApplicationInitializer: React.FC = () => {
  const [networksInitialized] = useObservable(networksInitialized$);
  const [selectedNetwork] = useSelectedNetwork();

  useEffect(() => {
    initializeNetworks();
    if (selectedNetwork.name === 'cardano') {
      openCardanoFaucetNotification();
    } else {
      notification.close(NOTIFICATION_KEY);
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (networksInitialized) {
      initializeApp();
    }
  }, [networksInitialized]);

  if (!networksInitialized) {
    return null;
  }

  return (
    <Suspense fallback={''}>
      <Application />
    </Suspense>
  );
};
