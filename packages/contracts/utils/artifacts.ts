export default class Artifacts {
    public Content: any;
    public UpdatableContent: any;
    public IterativeContent: any;

    constructor(artifacts: any) {
        this.Content = artifacts.require('Content');
        this.UpdatableContent = artifacts.require('UpdatableContent');
        this.IterativeContent = artifacts.require('IterativeContent');
    }
}