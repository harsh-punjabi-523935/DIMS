// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Identity {
    // Struct to store user information
    struct User {
        string name;
        string email;
        uint256 id;
        address owner;  // The owner of the data
        bool shareName;
        bool shareEmail;
        bool shareId;
    }

    // Mapping to store users' data
    mapping(address => User) private users;
    // Mapping to check if a user is registered
    mapping(address => bool) private registered;

    // Event logs for tracking actions
    event UserRegistered(address indexed user, string name);
    event SharingPreferencesUpdated(address indexed user, bool shareName, bool shareEmail, bool shareId);
    
    // Function to register a user with default privacy settings (hidden by default)
    function registerUser(
        string memory _name,
        string memory _email,
        uint256 _id
    ) public {
        require(!registered[msg.sender], "User already registered");

        users[msg.sender] = User(
            _name,
            _email,
            _id,
            msg.sender,
            false,  // shareName default false
            false,  // shareEmail default false
            false   // shareId default false
        );
        registered[msg.sender] = true;

        emit UserRegistered(msg.sender, _name);
    }

    // Function to update sharing preferences
    function updateSharingPreferences(bool _shareName, bool _shareEmail, bool _shareId) public {
        require(registered[msg.sender], "User not registered");

        users[msg.sender].shareName = _shareName;
        users[msg.sender].shareEmail = _shareEmail;
        users[msg.sender].shareId = _shareId;

        emit SharingPreferencesUpdated(msg.sender, _shareName, _shareEmail, _shareId);
    }

    // Function to retrieve another user's details (with privacy enforcement)
    function getUserDetails(address _user) public view returns (string memory, string memory, uint256) {
        require(registered[_user], "User not registered");

        User memory user = users[_user];

        // Return data based on the user's privacy settings
        string memory name = user.shareName ? user.name : "Private";
        string memory email = user.shareEmail ? user.email : "Private";
        uint256 id = user.shareId ? user.id : 0;

        return (name, email, id);
    }

    // Function for a user to view their **own** full details
    function getMyDetails() public view returns (string memory, string memory, uint256) {
        require(registered[msg.sender], "User not registered");
        User memory user = users[msg.sender];
        return (user.name, user.email, user.id);
    }

    // Function to check if a user is registered
    function isUserRegistered(address _user) public view returns (bool) {
        return registered[_user];
    }
}
