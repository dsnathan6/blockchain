const LLContract = artifacts.require("LLContract");

module.exports = function(deployer) {
  deployer.deploy(LLContract);
};
