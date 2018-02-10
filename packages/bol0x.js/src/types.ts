import * as Web3 from 'web3';
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

export type ArtifactContractName = 
      'Content'
    | 'ContentOwnerEntity'
    | 'Entity'
    | 'EntityDirectory'
    | 'IterativeContent'
    | 'UniqueIdentifierEntityDirectory'
    | 'UpdatableContent';

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
