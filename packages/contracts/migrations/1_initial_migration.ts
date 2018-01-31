var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer: any) {
  deployer.deploy(Migrations);
};
