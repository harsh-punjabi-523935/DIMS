// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Identity {
    struct User {
        string name;
        string email;
        uint256 id;
    }

    mapping(address => User) private users;
    mapping(address => bool) private registered; // Track if an address is already registered

    // Function to add a new user
    function addUser(string memory _name, string memory _email, uint256 _id) public {
        require(!registered[msg.sender], "User already registered"); // Prevent duplicate registration
        users[msg.sender] = User(_name, _email, _id);
        registered[msg.sender] = true;
    }

    // Function to get user details
    function getUser() public view returns (string memory, string memory, uint256) {
        require(registered[msg.sender], "User not registered"); // Ensure the caller is registered
        User memory user = users[msg.sender];
        return (user.name, user.email, user.id);
    }
}
