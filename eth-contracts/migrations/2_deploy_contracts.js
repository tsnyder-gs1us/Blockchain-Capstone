// migrating the appropriate contracts
var verifier = artifacts.require('verifier.sol');
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

// Contract MetaData
var contractName = "RMP_MintableToken";
var contractSymbol = "RMP";

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(verifier);
    await deployer.deploy(SolnSquareVerifier, verifier.address, contractName, contractSymbol);
  });
};

