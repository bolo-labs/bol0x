import * as Web3 from 'web3';
import assert from './utils/assert';
import ContentWrapper from './contract_wrappers/ContentWrapper';
import IterativeContentWrapper from './contract_wrappers/IterativeContentWrapper';
import UpdatableContentWrapper from './contract_wrappers/UpdatableContentWrapper';
import { BoloExConfig, Web3Provider, ArtifactContentContractName } from './types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export type ContentWrapperTypes =
      ContentWrapper
    | UpdatableContentWrapper
    | IterativeContentWrapper;

export class BoloEx {

    private _web3Wrapper : Web3Wrapper;

    private _config: BoloExConfig;

    constructor(provider: Web3Provider, config: BoloExConfig) {
        assert.isWeb3Provider('provider', provider);

        this._config = config;
        this._web3Wrapper = new Web3Wrapper(provider, {
            gasPrice: config.gasPrice
        });
    }

    public getContentWrapper(
        contractType: 'Content',
        contractAddress: string
    ): ContentWrapper;
    public getContentWrapper(
        contractType: 'UpdatableContent',
        contractAddress: string
    ): UpdatableContentWrapper;
    public getContentWrapper(
        contractType: 'IterativeContent',
        contractAddress: string
    ): IterativeContentWrapper;
    public getContentWrapper(
        contractType: ArtifactContentContractName,
        contractAddress: string
    ): ContentWrapperTypes {

        assert.isETHAddressHex('contractAddress', contractAddress);

        switch (contractType) {
            case 'Content':
                return new ContentWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            case 'UpdatableContent':
                return new UpdatableContentWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            case 'IterativeContent':
                return new IterativeContentWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            default:
                return assert.isNever('contractType', contractType);
        }
    }
}