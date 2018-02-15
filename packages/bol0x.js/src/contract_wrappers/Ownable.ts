import { MethodOpts, TransactionOpts } from '../types';
// import { OwnableContract, OwnableContractWrapper } from './types';
// import { Content } from './generated/content';

export interface IOwnerWrapper {
    /**
     * Retrieve the owner of the contract.
     * @param methodOpts Optional argument this method accepts.
     * @returns The ETH address of the owner of the contract.
     */
    getOwnerAsync(methodOpts?: MethodOpts): Promise<string>;

    /**
     * Transfer the ownership of the contract to a new owner.
     * @param newOwnerAddress The ETH address of the new owner.
     * @param transactionOpts Optional argument this method accepts.
     */
    transferOwnershipAsync(newOwnerAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
}

// export type Constructor<T extends OwnableContractWrapper<any>> = new(...args: any[]) => T;

// export default function Ownable<T extends Constructor<OwnableContractWrapper<any>>>(Base: T) {
//     return class extends Base implements IOwnerWrapper {
//         constructor(...args: any[]) {
//             super(...args);
//         }

//         async getOwner() {
//             (await this._getContractAsync())
//             return '';
//         }

//         transferOwnership(newOwnerAddress: string): void {

//         }
//     }
// }