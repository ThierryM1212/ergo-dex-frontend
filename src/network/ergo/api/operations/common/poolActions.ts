import { makeDefaultPoolActionsSelector } from '@ergolabs/ergo-dex-sdk';

import { UI_REWARD_ADDRESS } from '../../../../../common/constants/settings';
import { mainnetTxAssembler } from '../../../../../services/defaultTxAssembler';
import { proverMediator } from './proverMediator';

export const poolActions = makeDefaultPoolActionsSelector(
  proverMediator,
  mainnetTxAssembler,
  UI_REWARD_ADDRESS,
);
