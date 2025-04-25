// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IndividualIdentity {
    enum UserType { Individual, Corporate }

    struct Individual {
        string name;
        string email;
        uint256 id;
        string phone;
        string dob;
        string gender;
        string addressLine;
        string profilePicHash;
        string identityProofHash;
        string occupation;
        bytes32 identityHash;
        address owner;
        bool exists;
        bool shareName;
        bool shareEmail;
        bool shareId;
        bool sharePhone;
        bool shareDob;
        bool shareGender;
        bool shareAddress;
        bool shareProfilePic;
        bool shareIdentityProof;
        bool shareOccupation;
    }

    struct Corporate {
        string orgName;
        string email;
        string registrationNumber;
        string businessType;
        string headquarters;
        string contactPerson;
        address wallet;
        bool exists;
    }

    struct Access {
        address requesterAddress;
        string requesterName;
    }

    struct AccessRequest {
        address requester;
        bool isPending;
    }

    mapping(address => UserType) public userTypes;
    mapping(address => Individual) private individuals;
    mapping(address => Corporate) private corporates;
    mapping(address => bool) private registered;
    mapping(address => mapping(address => bool)) private accessPermissions;
    mapping(address => address[]) private accessList;
    mapping(address => AccessRequest[]) private accessRequests;
    mapping(address => bool) public isCorporateRegistered;
    mapping(address => Corporate) public corporateProfiles;
    address[] private allUsers;

    event IndividualRegistered(address indexed user, string name);
    event CorporateRegistered(address indexed org, string orgName);
    event AccessGranted(address indexed owner, address indexed requester);
    event AccessRevoked(address indexed owner, address indexed requester);
    event SharingPreferencesUpdated(address indexed user);
    event AccessRequestSent(address indexed requester, address indexed owner);
    event AccessRequestAccepted(address indexed requester, address indexed owner);
    event AccessRequestRejected(address indexed requester, address indexed owner);

    // Check if a user is registered
    function isUserRegistered(address _user) public view returns (bool) {
        return registered[_user];
    }

    // Register an individual
    function registerIndividual(
        string memory _name,
        string memory _email,
        uint256 _id,
        string memory _phone,
        string memory _dob,
        string memory _gender,
        string memory _addressLine,
        string memory _profilePicHash,
        string memory _identityProofHash,
        string memory _occupation
    ) public {
        require(!registered[msg.sender], "Already registered");

        bytes32 hash = keccak256(abi.encodePacked(_identityProofHash, msg.sender));

        individuals[msg.sender] = Individual({
            name: _name,
            email: _email,
            id: _id,
            phone: _phone,
            dob: _dob,
            gender: _gender,
            addressLine: _addressLine,
            profilePicHash: _profilePicHash,
            identityProofHash: _identityProofHash,
            occupation: _occupation,
            identityHash: hash,
            owner: msg.sender,
            exists: true,
            shareName: false,
            shareEmail: false,
            shareId: false,
            sharePhone: false,
            shareDob: false,
            shareGender: false,
            shareAddress: false,
            shareProfilePic: false,
            shareIdentityProof: false,
            shareOccupation: false
        });

        registered[msg.sender] = true;
        userTypes[msg.sender] = UserType.Individual;
        allUsers.push(msg.sender);
        emit IndividualRegistered(msg.sender, _name);
    }

    function registerCorporate(
        string memory _orgName,
        string memory _email,
        string memory _registrationNumber,
        string memory _businessType,
        string memory _hq,
        string memory _contactPerson
    ) public {
        require(!registered[msg.sender], "Already registered");

        corporates[msg.sender] = Corporate({
            orgName: _orgName,
            email: _email,
            registrationNumber: _registrationNumber,
            businessType: _businessType,
            headquarters: _hq,
            contactPerson: _contactPerson,
            wallet: msg.sender,
            exists: true
        });

        registered[msg.sender] = true;
        userTypes[msg.sender] = UserType.Corporate;
        allUsers.push(msg.sender);
        emit CorporateRegistered(msg.sender, _orgName);
    }

    // Fetch individual profile (for self)
    function getFullProfile() public view returns (
        string memory, string memory, uint256, string memory, string memory,
        string memory, string memory, string memory, string memory, string memory
    ) {
        require(registered[msg.sender], "Not registered");
        require(userTypes[msg.sender] == UserType.Individual, "Not individual");
        Individual memory user = individuals[msg.sender];
        return (
            user.name,
            user.email,
            user.id,
            user.phone,
            user.dob,
            user.gender,
            user.addressLine,
            user.profilePicHash,
            user.identityProofHash,
            user.occupation
        );
    }

    // Update sharing preferences
    function updateSharingPreferences(
        bool _shareName,
        bool _shareEmail,
        bool _shareId,
        bool _sharePhone,
        bool _shareDob,
        bool _shareGender,
        bool _shareAddress,
        bool _shareProfilePic,
        bool _shareIdentityProof,
        bool _shareOccupation
    ) public {
        require(registered[msg.sender], "Not registered");
        require(userTypes[msg.sender] == UserType.Individual, "Only individuals");

        Individual storage user = individuals[msg.sender];
        user.shareName = _shareName;
        user.shareEmail = _shareEmail;
        user.shareId = _shareId;
        user.sharePhone = _sharePhone;
        user.shareDob = _shareDob;
        user.shareGender = _shareGender;
        user.shareAddress = _shareAddress;
        user.shareProfilePic = _shareProfilePic;
        user.shareIdentityProof = _shareIdentityProof;
        user.shareOccupation = _shareOccupation;

        emit SharingPreferencesUpdated(msg.sender);
    }

    // Access request logic
    function requestAccess(address _owner) public {
        require(registered[msg.sender], "Requester not registered");
        require(registered[_owner], "Owner not registered");

        accessRequests[_owner].push(AccessRequest({
            requester: msg.sender,
            isPending: true
        }));

        emit AccessRequestSent(msg.sender, _owner);
    }

    function acceptRequest(address _requester) public {
        require(registered[msg.sender], "Owner not registered");

        AccessRequest[] storage requests = accessRequests[msg.sender];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == _requester && requests[i].isPending) {
                requests[i].isPending = false;
                accessPermissions[msg.sender][_requester] = true;
                accessList[msg.sender].push(_requester);
                emit AccessRequestAccepted(_requester, msg.sender);
                return;
            }
        }
        revert("Request not found");
    }

    function rejectRequest(address _requester) public {
        require(registered[msg.sender], "Owner not registered");

        AccessRequest[] storage requests = accessRequests[msg.sender];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == _requester && requests[i].isPending) {
                requests[i].isPending = false;
                emit AccessRequestRejected(_requester, msg.sender);
                return;
            }
        }
        revert("Request not found");
    }

    function getUsersWithAccess() public view returns (Access[] memory) {
        require(registered[msg.sender], "Not registered");

        address[] memory addresses = accessList[msg.sender];
        Access[] memory result = new Access[](addresses.length);

        for (uint i = 0; i < addresses.length; i++) {
            result[i] = Access(addresses[i], individuals[addresses[i]].name);
        }
        return result;
    }

    function getUsersWhoHaveAccessToMe() public view returns (Access[] memory) {
        require(registered[msg.sender], "Not registered");

        uint count = 0;
        for (uint i = 0; i < allUsers.length; i++) {
            if (accessPermissions[allUsers[i]][msg.sender]) count++;
        }

        Access[] memory result = new Access[](count);
        uint index = 0;
        for (uint i = 0; i < allUsers.length; i++) {
            if (accessPermissions[allUsers[i]][msg.sender]) {
                result[index++] = Access(allUsers[i], individuals[allUsers[i]].name);
            }
        }

        return result;
    }

    function grantAccess(address _requester) public {
        require(registered[msg.sender], "Not registered");

        accessPermissions[msg.sender][_requester] = true;
        accessList[msg.sender].push(_requester);
        emit AccessGranted(msg.sender, _requester);
    }

    function revokeAccess(address _requester) public {
        require(registered[msg.sender], "Not registered");

        accessPermissions[msg.sender][_requester] = false;

        address[] storage list = accessList[msg.sender];
        for (uint i = 0; i < list.length; i++) {
            if (list[i] == _requester) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }

        emit AccessRevoked(msg.sender, _requester);
    }

    function searchIdentity(address _user) public view returns (
        string memory name,
        string memory email,
        uint256 id,
        string memory phone,
        string memory dob,
        string memory gender,
        string memory addressLine,
        string memory profilePicHash,
        string memory identityProofHash,
        string memory occupation
    ) {
        require(registered[_user], "User not registered");
        require(userTypes[_user] == UserType.Individual, "Not individual");

        Individual memory user = individuals[_user];
        bool hasAccess = accessPermissions[_user][msg.sender];

        name = (user.shareName || hasAccess) ? user.name : "Private";
        email = (user.shareEmail || hasAccess) ? user.email : "Private";
        id = (user.shareId || hasAccess) ? user.id : 0;
        phone = (user.sharePhone || hasAccess) ? user.phone : "Private";
        dob = (user.shareDob || hasAccess) ? user.dob : "Private";
        gender = (user.shareGender || hasAccess) ? user.gender : "Private";
        addressLine = (user.shareAddress || hasAccess) ? user.addressLine : "Private";
        profilePicHash = (user.shareProfilePic || hasAccess) ? user.profilePicHash : "";
        identityProofHash = (user.shareIdentityProof || hasAccess) ? user.identityProofHash : "";
        occupation = (user.shareOccupation || hasAccess) ? user.occupation : "Private";

        return (
            name,
            email,
            id,
            phone,
            dob,
            gender,
            addressLine,
            profilePicHash,
            identityProofHash,
            occupation
        );
    }

    // Function to get pending access requests for an individual (owner)
    function getPendingAccessRequests(address _owner) public view returns (
        address[] memory requesterAddresses,
        string[] memory requesterNames
    ) {
        require(registered[_owner], "Owner not registered");

        AccessRequest[] memory requests = accessRequests[_owner];

        // Count how many are pending
        uint256 pendingCount = 0;
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].isPending) {
                pendingCount++;
            }
        }

        // Create result arrays
        requesterAddresses = new address[](pendingCount);
        requesterNames = new string[](pendingCount);

        uint256 index = 0;
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].isPending) {
                address requester = requests[i].requester;
                requesterAddresses[index] = requester;
                requesterNames[index] = corporates[requester].orgName;
                index++;
            }
        }

        return (requesterAddresses, requesterNames);
    }

     // Function to get corporate profile data
    function getCorporateProfile(address _org) public view returns (
        string memory orgName,
        string memory email,
        string memory registrationNumber,
        string memory businessType,
        string memory headquarters,
        string memory contactPerson,
        address wallet
    ) {
        require(userTypes[_org] == UserType.Corporate, "Not corporate");
        Corporate memory corp = corporates[_org];
        return (
            corp.orgName,
            corp.email,
            corp.registrationNumber,
            corp.businessType,
            corp.headquarters,
            corp.contactPerson,
            corp.wallet
        );
    }

    // Function to get corporate dashboard stats
    function getCorporateDashboardStats(address _corporate) public view returns (
        uint256 totalSent,
        uint256 pending,
        uint256 approved,
        uint256 rejected
    ) {
        require(userTypes[_corporate] == UserType.Corporate, "Not corporate");

        for (uint i = 0; i < allUsers.length; i++) {
            AccessRequest[] memory requests = accessRequests[allUsers[i]];
            for (uint j = 0; j < requests.length; j++) {
                if (requests[j].requester == _corporate) {
                    totalSent++;

                    if (requests[j].isPending) {
                        pending++;
                    } else {
                        // Check if access was granted
                        if (accessPermissions[allUsers[i]][_corporate]) {
                            approved++;
                        } else {
                            rejected++;
                        }
                    }
                }
            }
        }
    }

}