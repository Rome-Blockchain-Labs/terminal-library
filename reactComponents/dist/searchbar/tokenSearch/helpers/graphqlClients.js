"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.romePairsClient = void 0;
const graphql_request_1 = require("graphql-request");
const config_1 = require("./config");
exports.romePairsClient = new graphql_request_1.GraphQLClient(config_1.romeTokenSyncUri);
