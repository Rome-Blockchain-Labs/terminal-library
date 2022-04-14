export const filterActiveAll = data => !Object.values(data).some(b => b);

export const filterActiveNames = data => Object.entries(data).filter(entry => entry[1]).map(entry => entry[0]);

export const filterValidExchangeNames = (data, source) => [...new Set(source.filter(entry => filterActiveNames(data).includes(entry[0])).map(entry => entry[1]))];