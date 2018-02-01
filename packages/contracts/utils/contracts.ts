import * as UpdatableContent from '../build/contracts/UpdatableContent.json';
import * as Content from '../build/contracts/Content.json';
import * as IterativeContent from '../build/contracts/IterativeContent.json';
import Web3 = require('web3');
const contract = require('truffle-contract');

export default class Contracts {
    public Content: any;
    public UpdatableContent: any;
    public IterativeContent: any;

    constructor(provider: Web3.Provider) {
        this.Content = contract(Content),
        this.UpdatableContent = contract(UpdatableContent),
        this.IterativeContent = contract(IterativeContent)

        this.Content.setProvider(provider);
        this.UpdatableContent.setProvider(provider);
        this.IterativeContent.setProvider(provider);
    }
}