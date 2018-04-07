[![Gitter chat](https://badges.gitter.im/bol0x.png)](https://gitter.im/bol0x/Lobby)

bol0x
=====

NOT READY FOR PRODUCTION (Ethereum main net)

bol0x is an open protocol for content publishing using decentralized technologies (e.g. Ethereum, IPFS).

## Table of Contents

- [Why](#why)
- [What](#what)
  - [Examples](#examples)
- [Where we are](#where-we-are)
- [How can you help](#how-can-you-help)
- [Contribute](#contribute)
	- [Install dependencies](#install-dependencies)
	- [Build](#build)
	- [Run tests](#run-tests)

## Why
Decentralization is great for content delivery and making sure no one person or organization controls everything. One of the problem we saw while building decentralized apps (DApps) was that there is no good way to discover content that is published on some decentralized storage. The other issue is that as content is immutable so we need to have a registry which can be changed by user to point to the latest content.

We believe there should be an open protocol to handle scenarios surrounding content publishing (text, audio, video etc.) on decentralized systems.

One reason to have an open protocol is that public content of user should not be owned by one application but should be usable by other applications. This enables a market of applications for users to pick from without worrying about repopulating content on the new web application. If you use one DApp for publishing blogs but there is another DApp in the market which has better features you should be able to move to that DApp immediately as it would be built on the same open protocol.

## What
We are starting with IPFS as decentralized storage and Ethereum as the decentralized compute, but out aim is to use other technologies and blockchains in future.

![What is bol0x](https://raw.githubusercontent.com/bol0x/bol0x/master/packages/website/assets/images/what_bol0x.jpg)

We are building set of contracts for Ethereum to make discovery and maintenance of content easier. The contracts will also come with Javascript APIs that can be used by developers in DApps to use the bol0x protocol. We will also be building some common content models and APIs to publish on IPFS.

### Example
If you are creating a video publishing platform on bol0x it will include the following steps

![Example dapp using bol0x](https://raw.githubusercontent.com/bol0x/bol0x/master/packages/website/assets/images/example_bol0x.jpg)

1. Create an Entity for the user (if not already created). This will track all the content published under one user on the Ethereum blockchain.
2. Register the user entity with the directory. This will make all the users discoverable.
3. Your DApp publishes the video on IPFS.
4. Publish the metadata about the content on Ethereum.

## Where we are
We have just started building the protocol with some Ethereum contracts and Javascript APIs to use those contracts. We are nowhere near to being production ready so please don't use it on Ethereum main net. 
As more people start contributing we are planning to build APIs and common models to publish various content on IPFS. We will also be building DApps using the bol0x.

## How can you help
We need all the help we can get. If you are onboard the vision of building the bol0x protocol you can contribute various ways

* If you are a developer interested in building the protocol start contributing.
* If you are interested in building DApps, let's start the conversation of what you are building and how can the protocol evolve to support your application. Feel free to create issues discussing your scenarios.
* If you are a designer we need help with a website.
* If you are content writer you can help with writing guides and tutorials to use the protocol.
* If you are not any of it but still want to contribute, jump onto [gitter](https://gitter.im/bol0x/Lobby)

## Contributing

### Install dependencies
Make sure you have installed `yarn` and `lerna` globally.

### Build
Build all packages
```
yarn lerna:run build
```

### Run tests
Before running tests, you will need to start a test network at `http://localhost:7547`. We recommend using Ganache to do that. After running the test network

```
yarn lerna:run test
```
