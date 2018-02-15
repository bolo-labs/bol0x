import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import ContentWrapper, { IContentWrapper } from './ContentWrapper';
import { BigNumber } from '@0xproject/utils';
import { MethodOpts, TransactionOpts } from '../types';
import { UpdatableContentContract } from './generated/updatable_content';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export interface IUpdatableContentWrapper extends IContentWrapper {
    /**
     * Retrieves the time when the content was last updated.
     * @param methodOpts Optional arguments the method accepts.
     * @returns The time when the content was last updated.
     */
    getContentUpdateTimeAsync(methodOpts?: MethodOpts): Promise<Date>;

    /**
     * Changes the content address of the contract. This allows the user to refer to the same contract
     * and still be able to change the underlying content address.
     * @param newContentAddress The new content address which should be changed to in the contract.
     * @param transactionOpts Optional arguments the method accepts.
     */
    changeContentAsync(newContentAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
}

export default class UpdatableContentWrapper extends ContentWrapper implements IUpdatableContentWrapper {

    private _updatableContentContract: UpdatableContentContract | null = null;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId, contractAddress);
    }
  
    /** @inheritDoc */
    public async getContentUpdateTimeAsync(methodOpts?: MethodOpts): Promise<Date> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        const result = await contract.contentUpdateTime.callAsync(defaultBlock);

        // TODO: Check if converting from BigNumber to number in case of time will have any issues
        return new Date(result.toNumber());
    }

    /** @inheritDoc */
    public async changeContentAsync(
        newContentAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        const contract = await this._getContractAsync();

        await contract.changeContent.sendTransactionAsync(
            newContentAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    protected async _getContractAsync(): Promise<UpdatableContentContract> {
        if(!_.isNull(this._updatableContentContract)) {
            return this._updatableContentContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Content.UpdatableContentArtifact,
            this._contractAddress);

        const contractInstance = new UpdatableContentContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults());

        this._updatableContentContract = contractInstance;
        return this._updatableContentContract;
    }
}