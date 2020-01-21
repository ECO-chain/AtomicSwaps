pragma solidity ^0.4.21;

contract EcocAtomicSwap {

  struct Swap {
    address senderAddress;
    address receiverAddress;
    uint256 value;
    uint256 blockNumber;
    bytes32 SHA256Hash;
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

  event Open(bytes32 _AtomicSwapID, address _receiverAddress,bytes32 _SHA256Hash);
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
    require (block.number >= swaps[_AtomicSwapID].blockNumber + 1000);
    _;
  }

  modifier onlyWithSecretKey(bytes32 _AtomicSwapID, bytes _secretKey) {
    // TODO: Require _secretKey length to conform to the spec
    require (swaps[_AtomicSwapID].SHA256Hash == sha256(_secretKey));
    _;
  }

  function open(bytes32 _AtomicSwapID, address _receiverAddress, bytes32 _SHA256Hash, uint256 _blockNumber) public onlyInvalidSwaps(_AtomicSwapID) payable {
    // Store the details of the swap.
    Swap memory swap = Swap({
      senderAddress: msg.sender,
      receiverAddress: _receiverAddress,
      value: msg.value,
      blockNumber: _blockNumber,
      SHA256Hash: _SHA256Hash,
      secretKey: new bytes(0)
    });
    swaps[_AtomicSwapID] = swap;
    swapStates[_AtomicSwapID] = States.OPEN;

    // Trigger open event.
    Open(_AtomicSwapID, _receiverAddress, _SHA256Hash);
  }

  function close(bytes32 _AtomicSwapID, bytes _secretKey) public onlyOpenSwaps(_AtomicSwapID) onlyWithSecretKey(_AtomicSwapID, _secretKey) {
    // Close the swap.
    Swap memory swap = swaps[_AtomicSwapID];
    swaps[_AtomicSwapID].secretKey = _secretKey;
    swapStates[_AtomicSwapID] = States.CLOSED;

    // Transfer the ETH funds from this contract to the withdrawing trader.
    swap.receiverAddress.transfer(swap.value);

    // Trigger close event.
    Close(_AtomicSwapID, _secretKey);
  }

  function expire(bytes32 _AtomicSwapID) public onlyOpenSwaps(_AtomicSwapID) onlyExpirableSwaps(_AtomicSwapID) {
    // Expire the swap.
    Swap memory swap = swaps[_AtomicSwapID];
    swapStates[_AtomicSwapID] = States.EXPIRED;

    // Transfer the ETH value from this contract back to the ETH trader.
    swap.senderAddress.transfer(swap.value);

     // Trigger expire event.
    Expire(_AtomicSwapID);
  }

  function check(bytes32 _AtomicSwapID) public view returns (uint256 timelock, uint256 value, address receiverAddress, bytes32 SHA256Hash) {
    Swap memory swap = swaps[_AtomicSwapID];
    return (swap.timelock, swap.value, swap.receiverAddress, swap.SHA256Hash);
  }

  function checkSecretKey(bytes32 _AtomicSwapID) public view onlyClosedSwaps(_AtomicSwapID) returns (bytes secretKey) {
    Swap memory swap = swaps[_AtomicSwapID];
    return swap.secretKey;
  }
}