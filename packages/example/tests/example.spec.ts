import { describe, expect, test } from 'vitest';
import data from '../src';

describe('Example Test', () => {
    test('pass', () => {
        expect('example').toBeTruthy();
    });

    test('null data', () => {
        expect(data).toBeNull();
    });
});
