bol0x
=====

The bol0x content publication protocol for blockchain

# Contributing

## Install dependencies
Make sure you have installed `yarn` and `lerna` globally.

## Build
Build all packages
```
yarn lerna:run build
```

## Run Tests
Before running tests, you will need to start a test network at `http://localhost:7547`. We recommend using Ganache to do that. After running the test network

```
yarn lerna:run test
```