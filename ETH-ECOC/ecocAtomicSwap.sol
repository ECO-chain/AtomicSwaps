pragma solidity ^0.4.21;

contract EcocAtomicSwap {

  struct Swap {
    address senderAddress;
    address receiverAddress;
    uint256 value;
    uint256 blockNumber;
    bytes32 SHA3Hash;
    bytes secretKey;
  }

  enum States {
    INVALID,
    OPEN,
    CLOSED,
    EXPIRED
  }

  mapping (bytes32 => Swap) private swaps;
  mapping (bytes32 => States) private swapStates;

  event Open(bytes32 _AtomicSwapID, address _receiverAddress,bytes32 _SHA3Hash);
  event Expire(bytes32 _AtomicSwapID);
  event Close(bytes32 _AtomicSwapID, bytes _secretKey);

  modifier onlyInvalidSwaps(bytes32 _AtomicSwapID) {
    require (swapStates[_AtomicSwapID] == States.INVALID);
    _;
  }

  modifier onlyOpenSwaps(bytes32 _AtomicSwapID) {
    require (swapStates[_AtomicSwapID] == States.OPEN);
    _;
  }

  modifier onlyClosedSwaps(bytes32 _AtomicSwapID) {
    require (swapStates[_AtomicSwapID] == States.CLOSED);
    _;
  }

  modifier onlyExpirableSwaps(bytes32 _AtomicSwapID) {
    require (block.number >= swaps[_AtomicSwapID].blockNumber + 100);
    _;
  }

  modifier onlyWithSecretKey(bytes32 _AtomicSwapID, bytes _secretKey) {
    // TODO: Require _secretKey length to conform to the spec
    require (swaps[_AtomicSwapID].SHA3Hash == sha3(_secretKey));
    _;
  }

  function open(bytes32 _AtomicSwapID, address _receiverAddress, bytes32 _SHA3Hash, uint256 _blockNumber) public onlyInvalidSwaps(_AtomicSwapID) payable {
    // Store the details of the swap.
    Swap memory swap = Swap({
      senderAddress: msg.sender,
      receiverAddress: _receiverAddress,
      value: msg.value,
      blockNumber: _blockNumber,
      SHA3Hash: _SHA3Hash,
      secretKey: new bytes(0)
    });
    swaps[_AtomicSwapID] = swap;
    swapStates[_AtomicSwapID] = States.OPEN;

    // Trigger open event.
    Open(_AtomicSwapID, _receiverAddress, _SHA3Hash);
  }

  function close(bytes32 _AtomicSwapID, bytes _secretKey) public onlyOpenSwaps(_AtomicSwapID) onlyWithSecretKey(_AtomicSwapID, _secretKey) {
    // Close the swap.
    Swap memory swap = swaps[_AtomicSwapID];
    swaps[_AtomicSwapID].secretKey = _secretKey;
    swapStates[_AtomicSwapID] = States.CLOSED;

    // Transfer the ECO funds from this contract to the withdrawing trader.
    swap.receiverAddress.transfer(swap.value);

    // Trigger close event.
    Close(_AtomicSwapID, _secretKey);
  }

  function check(bytes32 _AtomicSwapID) public view returns (uint256 timelock, uint256 value, address receiverAddress, bytes32 SHA3Hash, bytes secretKey) {
    Swap memory swap = swaps[_AtomicSwapID];
    return (swap.timelock, swap.value, swap.receiverAddress, swap.SHA3Hash, swap.secretKey);
  }
}