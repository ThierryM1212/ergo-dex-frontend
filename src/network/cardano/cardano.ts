import { Observable, of } from 'rxjs';

import { TxId } from '../../common/types';
import { Network } from '../common/Network';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './api/addresses/addresses';
import { ammPools$ } from './api/ammPools/ammPools';
import { assetBalance$ } from './api/balance/assetBalance';
import { lpBalance$ } from './api/balance/lpBalance';
import { networkAssetBalance$ } from './api/balance/networkAssetBalance';
import { networkAsset } from './api/networkAsset/networkAsset';
import { networkContext$ } from './api/networkContext/networkContext';
import { deposit } from './api/operations/deposit';
import { redeem } from './api/operations/redeem';
import { swap } from './api/operations/swap';
import { positions$ } from './api/positions/positions';
import { CardanoWalletContract } from './api/wallet/common/CardanoWalletContract';
import {
  availableWallets,
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  supportedWalletFeatures$,
  walletState$,
} from './api/wallet/wallet';
import { initialize, initialized$ } from './initialized';
import {
  CardanoSettings,
  setSettings,
  settings,
  settings$,
} from './settings/settings';
import {
  useDepositValidationFee,
  useRedeemValidationFee,
  useSwapValidationFee,
} from './settings/totalFee';
import { exploreAddress, exploreLastBlock, exploreTx } from './utils/utils';
import { DepositFees } from './widgets/DepositFees/DepositFees';
import { RedeemFees } from './widgets/RedeemFees/RedeemFees';
import { SwapFees } from './widgets/SwapFees/SwapFees';
import { SwapInfoContent } from './widgets/SwapInfoContent/SwapInfoContent';

export const cardanoNetwork: Network<CardanoWalletContract, CardanoSettings> = {
  name: 'cardano',
  label: 'cardano (Testnet)',
  networkAsset,
  initialized$,
  initialize,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$: of([]),
  positions$,
  ammPools$,
  getAddresses: getAddresses,
  getUsedAddresses: getUsedAddresses,
  getUnusedAddresses: getUnusedAddresses,
  txHistoryManager: {} as any,
  connectWallet: connectWallet,
  disconnectWallet: disconnectWallet,
  availableWallets: availableWallets,
  walletState$: walletState$,
  selectedWallet$: selectedWallet$,
  supportedFeatures$: supportedWalletFeatures$,
  networkContext$,

  settings,
  settings$,
  setSettings,

  SwapInfoContent,
  SwapFees,
  DepositFees,
  RedeemFees,

  exploreTx,
  exploreAddress,
  exploreLastBlock,

  swap,
  deposit,
  redeem,
  refund(address: string, txId: string): Observable<TxId> {
    return of('');
  },

  useSwapValidationFee,
  useDepositValidationFee,
  useRedeemValidationFee,
};
