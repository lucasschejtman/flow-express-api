/* @flow */

import * as cache from '../../utils/cache';
import { searchById, searchOmdb } from '../../services/imdbService';

import { compose, trim, ifElse, take, equals } from 'ramda';

const isTitle         = (id: string): bool => compose(equals('tt'), take(2))(id);
// Unfortunately the GraphQL driver expect a promise
const searchPerson    = (id: string): Promise<OmdbTitleResultData> => searchById(id).promise().then(cache.set(id));
const searchTitle     = (id: string): Promise<OmdbTitleResultData> => searchOmdb(id).promise().then(cache.set(id));
const searchResource  = (id: string): Promise<OmdbTitleResultData|ImdbPersonData> => ifElse(isTitle, searchTitle, searchPerson)(id);
const fromCacheOrApi  = (id: string): Promise<OmdbTitleResultData|ImdbPersonData> => ifElse(cache.has, cache.get, searchResource)(id);

export const search   = (root: any, { id }: any): Promise<OmdbTitleResultData|ImdbPersonData> => compose(fromCacheOrApi, trim)(id);
