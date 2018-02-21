import Artifacts from '../Artifacts';
import assert from './assert';
import { Artifact, ArtifactContentContractName, ArtifactEntityContractName, ArtifactDirectoryContractName } from '../types';

export function getContentArtifact(contractType: ArtifactContentContractName): Artifact {
    switch (contractType) {
        case 'Content':
            return Artifacts.Content.ContentArtifact;
        case 'UpdatableContent':
            return Artifacts.Content.UpdatableContentArtifact;
        case 'IterativeContent':
            return Artifacts.Content.IterativeContentArtifact;
        default:
            return assert.isNever('contractType', contractType);
    }
}

export function getEntityArtifact(contractType: ArtifactEntityContractName): Artifact {
    switch (contractType) {
        case 'Entity':
            return Artifacts.Entity.EntityArtifact;
        case 'ContentOwnerEntity':
            return Artifacts.Entity.ContentOwnerEntityArtifact;
        default:
            return assert.isNever('contractType', contractType);
    }
}

export function getDirectoryArtifact(contractType: ArtifactDirectoryContractName): Artifact {
    switch (contractType) {
        case 'EntityDirectory':
            return Artifacts.Directory.EntityDirectoryArtifact;
        case 'UniqueIdentifierEntityDirectory':
            return Artifacts.Directory.UniqueIdentifierEntityDirectoryArtifact;
        default:
            return assert.isNever('contractType', contractType);
    }
}