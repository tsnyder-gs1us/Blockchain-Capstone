var solnSquareContract = artifacts.require('SolnSquareVerifier');
var SquareVerifier = artifacts.require("Verifier");

// Dev Tool for Smart Contract Events
// https://github.com/rkalis/truffle-assertions
const truffleAssert = require('truffle-assertions');

const TOKEN_NAME = "TestToken";
const TOKEN_SYMBOL = "TTS";

const testProof = {
    "proof": {
      "a": [
        "0x10b65099b47791ac9f93cd433fa21ad0325df1019d3530b05f0a7b562c2c29d6",
        "0x117f3d64bf62ab670e4fa3cc127aac0587bcaf33dc00a63e7c008f30880f3017"
      ],
      "b": [
        [
          "0x1c5294c90e939fdd43525f2eca7ee0ac9ca8c1417bf2a5c2a80490159232d6ba",
          "0x0a65d8655a68ad78332cc5b07e5a4e6ea2cbe1aea8aed9099b22dd40a8f49f0b"
        ],
        [
          "0x20e878170a0b49e0c0f6c6912c0a9f989da01d4ae8e64f30fccb0cae2992e281",
          "0x0d20334797ac198bd58e73a4d65a5cb75483a654b93b431f79a25ea322b0bc3b"
        ]
      ],
      "c": [
        "0x2990c79cbc3fc4b49bd8df40de2c53c4ed7e31f6d1ffa52dffaffc53f3b7c71f",
        "0x2e2eacdff8afd6d48d6a39c9772be1bb6501762b872ecebc7d39a4fcbde92b70"
      ]
    },
    "inputs": [
      "0x0000000000000000000000000000000000000000000000000000000000000009",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
  };

contract('TestSquareVerifier', async(accounts) => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('test square verifier', function () {

        beforeEach(async function () { 
            // Create contracts for unit test(s)
            const verifier = await SquareVerifier.new({from: account_one});
            this.contract = await solnSquareContract.new(verifier.address, TOKEN_NAME, TOKEN_SYMBOL, {from: account_one});
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('can solution be added to the contract', async function () { 

            let result = await this.contract.addSolution(testProof.proof.a, testProof.proof.b, testProof.proof.c, testProof.inputs, {from:account_two});

            // Handle Events fired from Smart Contract
            truffleAssert.eventEmitted(result, 'SolutionAdded', (ev) => {
                const checkEventResult = ev.solutionAddress === account_two;
                assert.equal(checkEventResult, true, "Solution could not be added to the contract.");
                return checkEventResult;
            });
        }) 

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('can ERC721 token be minted', async function () { 
            
            const valueForA = testProof.inputs[0];
            const valueForB = testProof.inputs[1];

            let result = await this.contract.addSolution(testProof.proof.a, testProof.proof.b, testProof.proof.c, testProof.inputs, {from:account_one});

            await this.contract.mintNFT(valueForA, valueForB, account_three, {from:account_one});

            var balance = await this.contract.balanceOf(account_three);
            assert.equal(balance, 1, "Token Balance is invalid.");

        }) 
    });
})





