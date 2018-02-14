import { assert as sharedAssert } from '@0xproject/assert';
import { BigNumber } from '@0xproject/utils';
import { Schema } from '@0xproject/json-schemas';
import { Exception } from 'handlebars';

export default {
    ...sharedAssert,
    isNever(variableName: string, value: never): never {
        const message = sharedAssert.typeAssertionMessage(
            variableName,
            'never',
            value
        );
        sharedAssert.assert(false, message);

        throw new Error(message);
    }
};
