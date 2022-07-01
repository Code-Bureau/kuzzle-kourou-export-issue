# Demo of data import/export data corruption

Kourou doesn't display warnings when importing corrupted data.

## Running

1. `npm install`
2. `npm run dev:docker`
3. Optionally check created demo index and data collection in [http://console.kuzzle.io](http://console.kuzzle.io)
4. In another terminal run `kourou collection:export demo data`
5. Delete the data collection in [http://console.kuzzle.io](http://console.kuzzle.io)
6. Try and re-import with `cd demo && kourou collection:import data`
7. Kourou reports successful import, but data is not imported (⚠️)

## Why is this bad?

You would expect an import/export function to be unable to corrupt data. The exported data should mimic how data looks when at rest.

The data that is exported is not what it looks like in Elasticsearch but how it is served during runtime. This will break importing as any dynamic things added in the `generic:document:afterGet` hook with be present in the exported data.
