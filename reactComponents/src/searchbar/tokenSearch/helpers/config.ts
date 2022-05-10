export const romeTokenSyncUri = String(
  process.env.REACT_APP_HASURA_API_ENDPOINT_WS || //todo should be a prop or something
    'https://romenet.prod.velox.global/v1/graphql'
).replace('ws', 'http');

export const maxHits = Number(process.env.REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM || 500);
