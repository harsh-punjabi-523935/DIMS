// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UnifiedIdentity {
    struct Identity {
        string name;
        string email;
        uint256 id;
        bytes32 identityHash;
        address owner;
        bool exists;
        bool shareName;
        bool shareEmail;
        bool shareId;
    }

    mapping(address => Identity) private identities;
    mapping(address => bool) private registered;
    mapping(address => mapping(address => bool)) private accessPermissions;

    event IdentityCreated(address indexed user, string name);
    event AccessGranted(address indexed owner, address indexed requester);
    event AccessRevoked(address indexed owner, address indexed requester);
    event SharingPreferencesUpdated(address indexed user, bool shareName, bool shareEmail, bool shareId);

    function createIdentity(
        string memory _name,
        string memory _email,
        uint256 _id,
        string memory _identityProof
    ) public {
        require(!registered[msg.sender], "Identity already exists!");

        bytes32 identityHash = keccak256(abi.encodePacked(_identityProof, msg.sender));

        identities[msg.sender] = Identity({
            name: _name,
            email: _email,
            id: _id,
            identityHash: identityHash,
            owner: msg.sender,
            exists: true,
            shareName: false,
            shareEmail: false,
            shareId: false
        });

        registered[msg.sender] = true;
        emit IdentityCreated(msg.sender, _name);
    }

    function updateSharingPreferences(bool _shareName, bool _shareEmail, bool _shareId) public {
        require(registered[msg.sender], "User not registered");

        identities[msg.sender].shareName = _shareName;
        identities[msg.sender].shareEmail = _shareEmail;
        identities[msg.sender].shareId = _shareId;

        emit SharingPreferencesUpdated(msg.sender, _shareName, _shareEmail, _shareId);
    }

    function getUserDetails(address _user) public view returns (string memory, string memory, uint256) {
        require(registered[_user], "User not registered");

        Identity memory user = identities[_user];
        string memory name = user.shareName ? user.name : "Private";
        string memory email = user.shareEmail ? user.email : "Private";
        uint256 id = user.shareId ? user.id : 0;

        return (name, email, id);
    }

    function getMyDetails() public view returns (string memory, string memory, uint256) {
        require(registered[msg.sender], "User not registered");
        Identity memory user = identities[msg.sender];
        return (user.name, user.email, user.id);
    }

    function grantAccess(address _requester) public {
        require(registered[msg.sender], "Identity not found!");
        accessPermissions[msg.sender][_requester] = true;
        emit AccessGranted(msg.sender, _requester);
    }

    function revokeAccess(address _requester) public {
        require(registered[msg.sender], "Identity not found!");
        accessPermissions[msg.sender][_requester] = false;
        emit AccessRevoked(msg.sender, _requester);
    }

    function verifyIdentity(address _user, string memory _identityProof) public view returns (bool) {
        require(registered[_user], "Identity does not exist!");
        require(accessPermissions[_user][msg.sender], "Access not granted!");

        bytes32 identityHash = keccak256(abi.encodePacked(_identityProof, _user));

        return identities[_user].identityHash == identityHash;
    }

    function isUserRegistered(address _user) public view returns (bool) {
        return registered[_user];
    }
}
