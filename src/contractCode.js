const solc = require('solc');
const fs = require('fs');

function generateContractCode(name, symbol, totalSupply) {
  const abi = [
    // ... ABI definitions
  ];

  const bytecode = `
    // Solidity contract code here
    contract MyToken is ERC20 {
        constructor() ERC20("${name}", "${symbol}") {
            _mint(msg.sender, ${totalSupply});
        }
    }
  `;

  return { abi, bytecode };
}

module.exports = { generateContractCode };



function generateContractCode(name, symbol, supply) {
  const contractCode = `// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ERC20 {
  mapping(address => uint256) public balances;
  mapping(address => mapping(address => uint256)) public allowed;

  uint256 public totalSupply;
  string public name;
  string public symbol;
  uint256 public decimals;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor(string memory _name, string memory _symbol, uint256 _supply, uint256 _decimals) {
    name = _name;
    symbol = _symbol;
    totalSupply = _supply * 10 ** _decimals;
    balances[msg.sender] = totalSupply;
    decimals = _decimals;
  }

  function transfer(address _to, uint256 _value) public {
    require(balances[msg.sender] >= _value, "Insufficient balance");
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
  }

  function approve(address _spender, uint256 _value) public {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public {
    require(balances[_from] >= _value, "Insufficient balance");
    require(allowed[_from][msg.sender] >= _value, "Allowance exceeded");
    balances[_from] -= _value;
    balances[_to] += _value;
    allowed[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
  }

  function balanceOf(address _owner) public view returns (uint256) {
    return balances[_owner];
  }

  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }

  // Mint function
  function mint(address to, uint256 amount) public {
    require(to != address(0), "Cannot mint to zero address");
    totalSupply += amount;
    balances[to] += amount;
    emit Transfer(address(0), to, amount); // Emit transfer event for minting
  }
}

contract ${name.split(' ').join('')} is ERC20 {
  constructor() ERC20("${name}", "${symbol}", ${supply}, 18) {}
}
  `;

  fs.writeFileSync('contract.sol', contractCode);

  const input = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: contractCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  const contractArtifact =
    output.contracts['contract.sol'][name.split(' ').join('')];
  const contractArtifactBytecode =
    contractArtifact.evm.bytecode.object;
  if (!contractArtifact) {
    throw new Error(`Failed to compile contract: ${name} not found in output.`);
  }

  return {
    bytecode: contractArtifactBytecode,
    abi: contractArtifact.abi,
  };
}

module.exports = { generateContractCode };
