// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { readdirSync } from 'fs';

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = readdirSync('dist').sort();
      const expected = [
         'blogger-tweaks.min.css',
         'layouts',
         'lib-x.d.ts',
         'lib-x.dev.js',
         'lib-x.js',
         'lib-x.min.js',
         'reset.min.css',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
