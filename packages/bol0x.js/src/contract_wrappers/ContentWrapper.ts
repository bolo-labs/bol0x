import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import ContractWrapper from './ContractWrapper';
import { ContentContract } from './generated/content';
import { IOwnerWrapper } from './Ownable';
import { MethodOpts, TransactionOpts } from '../types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export interface IContentWrapper extends IOwnerWrapper {
    getContentAddress(methodOpts?: MethodOpts): Promise<string>;
}

export default class ContentWrapper extends ContractWrapper implements IContentWrapper {

    private _contentContract: ContentContract | null = null;

    protected _contractAddress: string;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId);

        assert.isETHAddressHex('contractAddress', contractAddress);

        this._contractAddress = contractAddress;
    }

    /**
     * Retrieve the owner of the contract.
     * @param methodOpts Optional argument this method accepts.
     * @returns The ETH address of the owner of the contract.
     */
    public async getOwner(methodOpts?: MethodOpts): Promise<string> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        return await contract.owner.callAsync(defaultBlock);
    }

    /**
     * Transfer the ownership of the contract to a new owner.
     * @param newOwnerAddress The ETH address of the new owner.
     * @param transactionOpts Optional argument this method accepts.
     */
    public async transferOwnership(
        newOwnerAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('newOwnerAddress', newOwnerAddress);

        const contract = await this._getContractAsync();

        await contract.transferOwnership.sendTransactionAsync(
            newOwnerAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    /**
     * Retrieve the content address.
     * @param methodOpts Optional argument this method accepts.
     * @return The content address stored in the contract.
     */
    public async getContentAddress(methodOpts?: MethodOpts): Promise<string> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        return await contract.contentAddress.callAsync(defaultBlock);
    }

    protected async _getContractAsync(): Promise<ContentContract> {
        if(!_.isNull(this._contentContract)) {
            return this._contentContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Content.ContentArtifact,
            this._contractAddress);

        const contractInstance = new ContentContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults());

        this._contentContract = contractInstance;
        return this._contentContract;
    }
}