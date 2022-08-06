// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Credential {
    struct Certificate {
        address publicKeyIssuer;
        address publicKeyHolder;
        string signedByIssuer;
        string signedByHolder;
        string documentHash;
        uint8 valid;
    }

    /*struct keyPair {
        address publicKey;
        address privateKey;
    }*/

    // two element array, used to hold [publicKey1, privateKey1], [publicKey2,privateKey2]
    // keyPair[2] public pairs;

    address public Issuer;
    string public organization;
    // String is the hash of the document
    mapping(string => Certificate) public certificates;

    //mapping (string => keyPair[2]) public documentKeys;

    // ex. UIDAI
    constructor(string memory _organization) {
        Issuer = msg.sender;
        organization = _organization;
    }

    modifier onlyOwner() {
        require(Issuer == msg.sender, "Only Issuer can call this function.");
        _;
    }

    function IssueCertificate(
        string memory hash,
        address publicKeyIssuer,
        string memory IssuerSign
    ) public onlyOwner {
        Certificate memory certificate = Certificate({
            publicKeyIssuer: publicKeyIssuer,
            publicKeyHolder: address(0),
            signedByIssuer: IssuerSign,
            signedByHolder: "",
            documentHash: hash,
            valid: 1
        });

        certificates[hash] = certificate;
    }

    function HolderSignCertificate(
        string memory hash,
        address publicKeyHolder,
        string memory HolderSign
    ) public {
        Certificate storage certificate = certificates[hash];
        certificate.publicKeyHolder = publicKeyHolder;
        certificate.signedByHolder = HolderSign;
    }

    function revoke(string memory hash) public {
        // check if msg.sender is the Issuerpublickey
        Certificate storage certificate = certificates[hash];
        address publicKeyIssuer = certificate.publicKeyIssuer;
        if (msg.sender == publicKeyIssuer) {
            certificate.valid = 0;
        }
    }

    function getCertificate(string memory hash)
        public
        view
        returns (
            address publicKeyIssuer,
            address publicKeyHolder,
            string memory signedByIssuer,
            string memory signedByHolder,
            string memory documentHash,
            uint8 valid
        )
    {
        Certificate memory c = certificates[hash];
        return (
            c.publicKeyIssuer,
            c.publicKeyHolder,
            c.signedByIssuer,
            c.signedByHolder,
            c.documentHash,
            c.valid
        );
    }
}
