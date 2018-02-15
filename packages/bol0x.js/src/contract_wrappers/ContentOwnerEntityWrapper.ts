import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import EntityWrapper from './EntityWrapper';
import { BigNumber } from 'bignumber.js';
import { ContentOwnerEntityContract } from './generated/content_owner_entity';
import { EntityOwnedContent, MethodOpts, TransactionOpts } from '../types';
import { IContentOwnerEntityWrapper } from './types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export default class ContentOwnerEntityWrapper extends EntityWrapper implements IContentOwnerEntityWrapper {

    private _contentOwnerEntityContract: ContentOwnerEntityContract | null = null;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId, contractAddress);
    }

    /** @inheritDoc */
    public async getContentAsync(
        index: number | BigNumber,
        methodOpts?: MethodOpts
    ): Promise<EntityOwnedContent> {

        const contract = await this._getContractAsync();

        // Check if the index is a number then convert it into big number
        const indexBigNum: BigNumber = _.isFinite(index) ? new BigNumber(index) : index as BigNumber;

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        const [contentAddress, deleted] = await contract.ownedContents.callAsync(indexBigNum, defaultBlock);

        return {
            contentAddress: contentAddress,
            isDeleted: deleted
        };
    }

    /** @inheritDoc */
    public async getAllOwnedContentAsync(
        methodOpts?: MethodOpts
    ): Promise<string[]> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        return await contract.getAllOwnedContent.callAsync(defaultBlock);
    }

    /** @inheritDoc */
    public async addContentAsync(
        contentAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('contentAddress', contentAddress);

        const contract = await this._getContractAsync();

        await contract.addContent.sendTransactionAsync(
            contentAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    /** @inheritDoc */
    public async deleteContentAsync(
        contentAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('contentAddress', contentAddress);

        const contract = await this._getContractAsync();

        await contract.deleteContent.sendTransactionAsync(
            contentAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    protected async _getContractAsync(): Promise<ContentOwnerEntityContract> {
        if(!_.isNull(this._contentOwnerEntityContract)) {
            return this._contentOwnerEntityContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Entity.ContentOwnerEntityArtifact,
            this._contractAddress);

        const contractInstance = new ContentOwnerEntityContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults());

        this._contentOwnerEntityContract = contractInstance;
        return this._contentOwnerEntityContract;
    }
}