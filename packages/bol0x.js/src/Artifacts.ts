import * as ContentArtifact from './artifacts/Content.json';
import * as ContentOwnerEntityArtifact from './artifacts/ContentOwnerEntityArtifact.json';
import * as EntityArtifact from './artifacts/Entity.json';
import * as EntityDirectoryArtifact from './artifacts/EntityDirectory.json';
import * as IterativeContentArtifact from './artifacts/IterativeContent.json';
import * as UniqueIdentifierEntityDirectoryArtifact from './artifacts/UniqueIdentifierEntityDirectory.json';
import * as UpdatableContentArtifact from './artifacts/UpdatableContent.json';
import { Artifact } from './types';

export const artifacts = {
    Content: {
        ContentArtifact: (ContentArtifact as any) as Artifact,
        UpdatableContentArtifact: (UpdatableContentArtifact as any) as Artifact,
        IterativeContentArtifact: (IterativeContentArtifact as any) as Artifact
    },
    Entity: {
        EntityArtifact: (EntityArtifact as any) as Artifact,
        ContentOwnerEntityArtifact: (ContentOwnerEntityArtifact as any) as Artifact
    },
    Directory: {
        EntityDirectoryArtifact: (EntityDirectoryArtifact as any) as Artifact,
        UniqueIdentifierEntityDirectoryArtifact: (UniqueIdentifierEntityDirectoryArtifact as any) as Artifact
    }
};