const Plot = artifacts.require("Plot");
const Client = artifacts.require("Client");

module.exports = function(deployer) {
  deployer.deploy(Plot).then(function(){
    return deployer.deploy(Client, Plot.address)
});
};
/*
module.exports = function(deployer) {
  deployer.deploy(Plot);
  var hPlot = Plot.deployed();
  deployer.deploy(Client, hPlot)
};
*/