// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Credential.sol";

contract CredentialFactory {
    //keeps a track of all the instances of the Credential contract
    Credential[] public trackingArray; //array stores the addresses of the contracts so we can refer to them.
    mapping(string => Credential) public orgToContract;
    mapping(address => Credential) public DeployerToContract;

    // look into changing this functions visibility so that only permissioned entites can call this function, not 'public'
    function deployCredentialContract(string memory _organization)
        public
        returns (address)
    {
        Credential new_credential = new Credential(_organization);
        trackingArray.push(new_credential);
        orgToContract[_organization] = new_credential;
        DeployerToContract[msg.sender] = new_credential;
        return address(new_credential);
    }

    // to refer to a contract I need its address and abi
    // address we have stored in a variable, the ABI we get from the import statement above
    function cfIssueCertificate(
        string memory hash,
        address publicKeyIssuer,
        string memory IssuerSign
    ) public {
        Credential c = Credential(address(DeployerToContract[msg.sender]));
        c.IssueCertificate(hash, publicKeyIssuer, IssuerSign);
    }

    function cfRevoke(string memory hash) public {
        Credential c = Credential(address(DeployerToContract[msg.sender]));
        c.revoke(hash);
    }

    function cfHolderSignCertificate(
        string memory hash,
        address publicKeyHolder,
        string memory HolderSign
    ) public {
        Credential c = Credential(address(DeployerToContract[msg.sender]));
        c.HolderSignCertificate(hash, publicKeyHolder, HolderSign);
    }

    function cfGetCertificate(string memory hash)
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
        Credential c = Credential(address(DeployerToContract[msg.sender]));
        (
            publicKeyIssuer,
            publicKeyHolder,
            signedByIssuer,
            signedByHolder,
            documentHash,
            valid
        ) = c.getCertificate(hash);
        return (
            publicKeyIssuer,
            publicKeyHolder,
            signedByIssuer,
            signedByHolder,
            documentHash,
            valid
        );
    }
}
