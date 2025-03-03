// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Identity {
    // Struct to store user identity details
    struct User {
        string name;
        string email;
        uint256 id;
        address owner;
        bool shareName;
        bool shareEmail;
        bool shareId;
        bytes32 identityHash; // Hashed identity for verification
    }

    // Mappings for user data, registration status, access control, MFA secrets, recovery contacts, and document storage
    mapping(address => User) private users;
    mapping(address => bool) private registered;
    mapping(address => mapping(address => bool)) private accessPermissions;
    mapping(address => bytes32) private userSecrets;
    mapping(address => address) private recoveryContacts;
    mapping(address => string) private documentHashes;

    // Events to track various actions
    event UserRegistered(address indexed user, string name);
    event SharingPreferencesUpdated(address indexed user, bool shareName, bool shareEmail, bool shareId);
    event AccessGranted(address indexed owner, address indexed requester);
    event AccessRevoked(address indexed owner, address indexed requester);
    event IdentityDeleted(address indexed user);

    // Generates a unique hash for the user identity
    function generateIdentityHash(string memory _name, string memory _email, uint256 _id) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _email, _id));
    }

    // Registers a new user and stores their identity securely
    function registerUser(string memory _name, string memory _email, uint256 _id) public {
        require(!registered[msg.sender], "User already registered");
        users[msg.sender] = User(_name, _email, _id, msg.sender, false, false, false, generateIdentityHash(_name, _email, _id));
        registered[msg.sender] = true;
        emit UserRegistered(msg.sender, _name);
    }

    // Grants access to another user to view identity details
    function grantAccess(address _to) public {
        require(registered[msg.sender], "Only registered users can grant access");
        accessPermissions[msg.sender][_to] = true;
        emit AccessGranted(msg.sender, _to);
    }

    // Revokes access previously granted to a user
    function revokeAccess(address _to) public {
        require(registered[msg.sender], "Only registered users can revoke access");
        accessPermissions[msg.sender][_to] = false;
        emit AccessRevoked(msg.sender, _to);
    }

    // Checks if a specific requester has access to the user's identity
    function canAccess(address _owner, address _requester) public view returns (bool) {
        return accessPermissions[_owner][_requester];
    }

    // Stores a hashed secret for multi-factor authentication (MFA)
    function setSecret(bytes32 _hashedSecret) public {
        require(registered[msg.sender], "User not registered");
        userSecrets[msg.sender] = _hashedSecret;
    }

    // Verifies if the given secret matches the stored MFA secret
    function verifySecret(bytes32 _hashedSecret) public view returns (bool) {
        return userSecrets[msg.sender] == _hashedSecret;
    }

    // Allows users to set a trusted contact for account recovery
    function setRecoveryContact(address _trustedContact) public {
        require(registered[msg.sender], "User not registered");
        recoveryContacts[msg.sender] = _trustedContact;
    }

    // Allows a trusted contact to recover the user's identity
    function recoverIdentity(address _user) public {
        require(recoveryContacts[_user] == msg.sender, "Not authorized");
        users[_user].owner = msg.sender;
    }

    // Deactivates a user's identity and removes their data from the contract
    function deactivateIdentity() public {
        require(registered[msg.sender], "User not registered");
        delete users[msg.sender];
        registered[msg.sender] = false;
        emit IdentityDeleted(msg.sender);
    }

    // Uploads a document hash to be associated with the user's identity
    function uploadDocument(string memory _docHash) public {
        require(registered[msg.sender], "User not registered");
        documentHashes[msg.sender] = _docHash;
    }
}
