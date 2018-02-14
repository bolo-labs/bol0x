import { MethodOpts, TransactionOpts } from '../types';
// import { OwnableContract, OwnableContractWrapper } from './types';
// import { Content } from './generated/content';

export interface IOwnerWrapper {
    getOwner(methodOpts?: MethodOpts): Promise<string>;
    transferOwnership(newOwnerAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
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