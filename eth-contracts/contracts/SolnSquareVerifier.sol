pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

    // TODO define a solutions struct that can hold an index & an address
    struct SolutionData {
        uint256 solutionIndex;
        address solutionAddress;
        bool isSolution;
        bool isMinted;
    }

    // TODO define an array of the above struct
    SolutionData[] solutions;

    // Used for Tracking Solutions count
    uint256 public numberOfSolutions = 0;

    // TODO define a mapping to store unique solutions submitted
    mapping (bytes32 => SolutionData) submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address indexed solutionAddress);

    Verifier private verifierContract;
  
    constructor(address verifierAddress, string memory name, string memory symbol) CustomERC721Token(name, symbol)
    public
    {
        verifierContract = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    // function addSolution(Proof memory proof, uint[2] memory input)
    function addSolution(uint[2] memory a,uint[2][2] memory b,uint[2] memory c,uint[2] memory input)
      public
    {

        // Generate key for solution 
        bytes32 solutionKey = keccak256(abi.encodePacked(input[0], input[1]));
        
        require(submittedSolutions[solutionKey].isSolution == false, "Solution already exists!");
        
        // Verify solution input
        bool verified = verifierContract.verifyTx(a,b,c, input);
        require(verified, "Solution failed verification");

        // Create new solution and track it 
        numberOfSolutions+=1;
        SolutionData memory sol = SolutionData({solutionIndex: numberOfSolutions, solutionAddress: msg.sender, isSolution: true, isMinted: false });
        submittedSolutions[solutionKey] = sol;
        solutions.push(sol);
   
        // Fire Solution Added Event 
        emit SolutionAdded(msg.sender);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function mintNFT(uint a, uint b, address toAddress) public {

        // Get Solution Key and Verify it exists before minting token 
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b));

        require(submittedSolutions[solutionKey].solutionAddress != address(0), "Solution must exists to be minted");
        require(submittedSolutions[solutionKey].isMinted == false, "Token already minted for this solution");  

        uint256 tokenId = submittedSolutions[solutionKey].solutionIndex;

        super.mint(toAddress, tokenId);
        submittedSolutions[solutionKey].isMinted = true;
    }

}



























