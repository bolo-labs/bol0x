import * as Web3 from 'web3';
import { BigNumber } from '@0xproject/utils';
import {
    BlockParam,
    BlockParamLiteral,
    ContractEventArg,
    LogWithDecodedArgs
    } from '@0xproject/types';
import { ContentContractEventArgs, ContentEvents } from './contract_wrappers/generated/content';
import { ContentOwnerEntityContractEventArgs, ContentOwnerEntityEvents } from './contract_wrappers/generated/content_owner_entity';
import { EntityAddedContractEventArgs, EntityDirectoryEvents } from './contract_wrappers/generated/entity_directory';
import { EntityContractEventArgs, EntityEvents } from './contract_wrappers/generated/entity';
import { IterativeContentContractEventArgs, IterativeContentEvents } from './contract_wrappers/generated/iterative_content';
import { UniqueIdentifierEntityDirectoryContractEventArgs, UniqueIdentifierEntityDirectoryEvents } from './contract_wrappers/generated/unique_identifier_entity_directory';
import { UpdatableContentContractEventArgs, UpdatableContentEvents } from './contract_wrappers/generated/updatable_content';

export type ArtifactContentContractName =
      'Content'
    | 'IterativeContent'
    | 'UpdatableContent';

export type ArtifactContractName = 
       ArtifactContentContractName
    | 'ContentOwnerEntity'
    | 'Entity'
    | 'EntityDirectory'
    | 'UniqueIdentifierEntityDirectory';

export interface Artifact {
    contractName: ArtifactContractName;
    abi: Web3.ContractAbi;
    networks: {
        [networkId: number]: {
            address: string;
        };
    };
}

export interface DecodedLogEvent<ArgsType> {
    isRemoved: boolean;
    log: LogWithDecodedArgs<ArgsType>;
}
export type EventCallback<ArgsType> = (err: null | Error, log?: DecodedLogEvent<ArgsType>) => void;

export interface IndexedFilterValues {
    [index: string]: ContractEventArg;
}

export enum InternalBoloExError {
    NoAbiDecoder = 'NO_ABI_DECODER',
}

export enum BoloExError {
    BoloExContractDoesNotExist = 'BOLO_EX_CONTRACT_DOES_NOT_EXIST',
    ContentContractDoesNotExist = 'CONTENT_CONTRACT_DOES_NOT_EXIST',
    UpdatableContentContractDoesNotExist = 'UPDATABLE_CONTENT_CONTRACT_DOES_NOT_EXIST',
    IterativeContentContractDoesNotExist = 'ITERATIVE_CONTENT_CONTRACT_DOES_NOT_EXIST',
    EntityContractDoesNotExist = 'ENTITY_CONTRACT_DOES_NOT_EXIST',
    ContentOwnerEntityContractDoesNotExist = 'CONTENT_OWNER_ENTITY_CONTRACT_DOES_NOT_EXIST',
    EntityDirectoryContractDoesNotExist = 'ENTITY_DIRECTORY_CONTRACT_DOES_NOT_EXIST',
    UniqueIdentifierEntityDirectoryContractDoesNotExist = 'UNIQUE_IDENTIFIER_ENTITY_DIRECTORY_CONTRACT_DOES_NOT_EXIST',
    UnhandledError = 'UNHANDLED_ERROR',
    UserHasNoAssociatedAddress = 'USER_HAS_NO_ASSOCIATED_ADDRESSES',
    InvalidSignature = 'INVALID_SIGNATURE',
    ContractNotDeployedOnNetwork = 'CONTRACT_NOT_DEPLOYED_ON_NETWORK',
    InvalidJump = 'INVALID_JUMP',
    OutOfGas = 'OUT_OF_GAS',
    NoNetworkId = 'NO_NETWORK_ID',
    SubscriptionNotFound = 'SUBSCRIPTION_NOT_FOUND',
    SubscriptionAlreadyPresent = 'SUBSCRIPTION_ALREADY_PRESENT',
    TransactionMiningTimeout = 'TRANSACTION_MINING_TIMEOUT',
}

export interface BlockRange {
    fromBlock: BlockParam;
    toBlock: BlockParam;
}

export type ContractEvents =
      ContentEvents
    | ContentOwnerEntityEvents
    | EntityDirectoryEvents
    | EntityEvents
    | IterativeContentEvents
    | UniqueIdentifierEntityDirectoryEvents
    | UpdatableContentEvents

export type ContractEventArgs =
      ContentContractEventArgs
    | ContentOwnerEntityContractEventArgs
    | EntityAddedContractEventArgs
    | EntityContractEventArgs
    | IterativeContentContractEventArgs
    | UniqueIdentifierEntityDirectoryContractEventArgs
    | UpdatableContentContractEventArgs

/*
 * defaultBlock: The block up to which to query the blockchain state. Setting this to a historical block number
 * let's the user query the blockchain's state at an arbitrary point in time. In order for this to work, the
 * backing  Ethereum node must keep the entire historical state of the chain (e.g setting `--pruning=archive`
 * flag when  running Parity).
 */
export interface MethodOpts {
    defaultBlock?: Web3.BlockParam;
}

/*
 * gasPrice: Gas price in Wei to use for a transaction
 * gasLimit: The amount of gas to send with a transaction
 */
export interface TransactionOpts {
    gasPrice?: BigNumber;
    gasLimit?: number;
}

export type Web3Provider = Web3.Provider;

export interface BoloExConfig {
    networkId: number;
    gasPrice?: BigNumber;
}

export enum EntityIdentityProvider {
    None = 0,
    EtherAddress = 1,
    Email = 2,
    KeyBase = 3,
    Name = 4,
    TwitterHandle = 5,
    Other = 6
}

export interface EntityIdentity {
    identifier: string;
    identityProvider: EntityIdentityProvider
}

export interface EntityOwnedContent {
    contentAddress: string;
    isDeleted: boolean;
}