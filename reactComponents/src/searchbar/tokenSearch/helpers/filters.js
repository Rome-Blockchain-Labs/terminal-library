import { networkExchangePairs } from "./config";

export const filterActiveAll = filteredData => !Object.values(filteredData).some(b => b);

export const filterActiveNames = filteredData => Object.entries(filteredData).filter(entry => entry[1]).map(entry => entry[0]);

export const filterValidExchangeNames = networkNames => [...new Set(networkExchangePairs.filter(network => filterActiveNames(networkNames).includes(network[0])).map(network => network[1]))];