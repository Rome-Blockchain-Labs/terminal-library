import { GraphQLClient } from 'graphql-request';

import { romeTokenSyncUri, } from './config';

export const romePairsClient = new GraphQLClient(romeTokenSyncUri);
