// Copyright 2017 ZeroEx Inc.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {TxData, TxDataPayable} from '@0xproject/types';
import * as _ from 'lodash';
import * as Web3 from 'web3';
import applyDefaultsToTxDataAsync from '../../utils/applyDefaultsToTxDataAsync';

export class BaseContract {
    protected _web3ContractInstance: Web3.ContractInstance;
    protected _defaults: Partial<TxData>;
    protected async _applyDefaultsToTxDataAsync<T extends TxData|TxDataPayable>(
        txData: T,
        estimateGasAsync?: (txData: T) => Promise<number>,
    ): Promise<TxData> {
        return await applyDefaultsToTxDataAsync(
            txData,
            this._defaults,
            estimateGasAsync
        );
    }

    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
        this._web3ContractInstance = web3ContractInstance;
        this._defaults = defaults;
    }
}
