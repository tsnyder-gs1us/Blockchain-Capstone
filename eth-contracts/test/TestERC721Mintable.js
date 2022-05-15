var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const BASE_TOKEN_URI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
    const NUMBER_OF_TEST_TOKENS = 5;
    const TOKEN_NAME = "TestToken";
    const TOKEN_SYMBOL = "TestToken";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 

            try {
                this.contract = await ERC721MintableComplete.new(TOKEN_NAME, TOKEN_SYMBOL, {from: account_one});
  
                // TODO: mint multiple tokens
                // Create Test Tokens for Each Test
                for(let tokenId = 0; tokenId < NUMBER_OF_TEST_TOKENS; tokenId++) {
                    let result = await this.contract.mint(account_two, tokenId, {from:account_one});
                }
            } catch(e) {
                console.log(e);
            }
        })

        it('should return total supply', async function () { 
            let amount = await this.contract.totalSupply();
            assert.equal(parseInt(amount), NUMBER_OF_TEST_TOKENS, "Expected Token Supply is not correct.");
        })

       it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_two);
            assert.equal(parseInt(balance), NUMBER_OF_TEST_TOKENS, "Expected Token Balance is not correct.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const token_id = 1;
            let tokenURI = await this.contract.tokenURI(token_id);
            assert.equal(tokenURI, BASE_TOKEN_URI + token_id,"Expected token uri is not correct.");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_three, 1, {from:account_two});
            let newTokenOwner = await this.contract.ownerOf(1);

            assert.equal(newTokenOwner, account_three,"Incorrect Owner after transfering token.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(TOKEN_NAME, TOKEN_SYMBOL, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            const tokenId = 12;
            let checkMintFailed = false;

            try {
                let result = await this.contract.mint(account_two, tokenId, {from:account_two});
            } catch(e) {
                // Expect Exception to be thrown when non contract owner tries to mint tokens
                // console.log(e);
                checkMintFailed = true;
            }

            assert.equal(checkMintFailed, true, "Contract owner required to mint tokens.");
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.contractOwner();
            assert.equal(contractOwner, account_one, "Contract Owner is incorrect!");
        })

    });
})