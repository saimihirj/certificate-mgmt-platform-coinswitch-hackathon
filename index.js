import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress, abi_verify_signature, contractAddress_verify_signature } from './constants.js'
let ISSUER_PRV_KEY = "0xf00a5f7435ded862b7397ae3270fdee4ae5317bafd29d62fcc22ee8879f3fb13"
let HOLDER_PRV_KEY = "0x0ab8f44722b3254ba2fcf2d284cafa250f4f7d92c36de00f02e95db4bb641208"
let HOLDER_PUB_KEY = "0xE880daD6852fB97fCEc6EC36BB952224247A619f"
/*const connectButton = document.getElementById("")
connectButton.onclick = connect


async function connect() {
    console.log("Connecting...")
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected! "
    }
    else {
        connectButton.innerHTML = "Please install metamask"
    }
}*/

// document.getElementById('gethash').onclick = () => {
//     let hashval = document.getElementById('result').innerHTML;
//     console.log(`Hash from my index.js ${hashval}`);
// };
let hash_elem = document.getElementById("gethash")
hash_elem.onclick = getHash

let hashval;





async function sign(private_key, message) {
    // we will sign the message with the private_key
    //const accounts = await ethers.getSigners(2);


    // const VerifySignature = await ethers.getContractFactory("VerifySignature");
    // const contract = await VerifySignature.deploy();
    // await contract.deployed();

    //const provider = new ethers.providers.Web3Provider(window.ethereum)
    //const signer = provider.getSigner()

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = new ethers.Wallet(private_key, provider)
    const contract = new ethers.Contract(contractAddress_verify_signature, abi_verify_signature, signer)
    const to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    const amount = 999
    const nonce = 123


    const hash = await contract.getMessageHash(to, amount, message, nonce)
    // before passing the hash into the signMessage we need to convert it to a bytes type
    const sig = await signer.signMessage(ethers.utils.arrayify(hash))
    //console.log(`\n\nThis is the signed message: ${sig}\n\n`)
    return sig;
}

// signed_msg is the output of the sign function

async function verify_signature(message, signed_msg, ISSUER_PRV_KEY) {
    const to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    const amount = 999
    const nonce = 123
    // const VerifySignature = await ethers.getContractFactory("VerifySignature");
    // const contract = await VerifySignature.deploy();
    // await contract.deployed();
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = new ethers.Wallet(ISSUER_PRV_KEY, provider)

    //const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress_verify_signature, abi_verify_signature, signer)


    let status = await contract.verify(signer.address, to, amount, message, nonce, signed_msg)
    //console.log(`Status: ${status}`)
    return status;
}

async function get_it(contract) {

    let my_tuple = await contract.cfGetCertificate(hashval)
    console.log(`Returned tuple ${my_tuple}`)

}

async function getHash() {

    hashval = document.getElementById('result').innerHTML;
    console.log(`Hash from my index.js ${hashval}`);

    // end of get hash

    let signed_message = await sign(ISSUER_PRV_KEY, hashval);
    //let signed_msg;
    //signed_msg = signed_promise.then((value) => { value })
    console.log(`Signed message: ${signed_message}\n\n`)


    let status = await verify_signature(hashval, signed_message, ISSUER_PRV_KEY)
    console.log(`Status in func: ${status}`)

    // let us send it to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    let IssuerPublicKey = await signer.getAddress()
    console.log(`public key ${IssuerPublicKey} `)
    let CredentialContractAddress = await contract.deployCredentialContract("UIDAI")
    console.log("Between")
    await contract.cfIssueCertificate(hashval, IssuerPublicKey, signed_message)
    console.log("sent")


    let holder_signed_message = await sign(HOLDER_PRV_KEY, hashval);
    console.log(`Holder Signed message: ${holder_signed_message}\n\n`)
    let holder_status = await verify_signature(hashval, holder_signed_message, HOLDER_PRV_KEY)
    console.log(`Status in func: ${holder_status}`)
    const holder_signer = new ethers.Wallet(HOLDER_PRV_KEY, provider)
    await contract.cfHolderSignCertificate(hashval, holder_signer.address, holder_signed_message)
    console.log("Published holder sign")

    console.log("Let us get certificate")

    setTimeout(get_it, 20000, contract)

}

async function Issue(contract, signer) {
    let signed_message = await sign(ISSUER_PRV_KEY, hashval);
    console.log(`Signed message: ${signed_message}\n\n`)

    let IssuerPublicKey = await signer.getAddress()
    console.log(`public key ${IssuerPublicKey} `)

    await contract.cfIssueCertificate(hashval, IssuerPublicKey, signed_message);
    console.log("Issued...")
}


async function main() {

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //returns whichever wallet is connected to the browser
        const contract = new ethers.Contract(contractAddress, abi, signer)


        contract.deployCredentialContract("UIDAI") //hardcoded for Aadhar

        Issue(contract, signer)

        //call sign 

        //call smartcontract function
        //contract.cfIssueCertificate(hash,signer.address,sign)




    }
}







// =----------------------divyam ==--------------------------
// var doc_hash;

// function handleFiles(files) {
//     console.log(files[0]);
//     Object.keys(files).forEach((item, index) => {
//         const file = files[index];
//         const reader = new FileReader();

//         reader.onload = () => {
//             const fileResult = reader.result;

//             crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
//                 var sha256result = hex(hash);
//                 doc_hash = sha256result;
//                 console.log(`sha256result ${sha256result}`);
//                 console.log(`doc_hash ${doc_hash}`);

//                 document.getElementById('result').innerHTML = "File has been sucesfully uploaded";
//             });
//         };

//         reader.readAsArrayBuffer(file);
//     });

// }

// function hex(buffer) {
//     var hexCodes = [];
//     var view = new DataView(buffer);
//     for (var i = 0; i < view.byteLength; i += 4) {
//         var value = view.getUint32(i)
//         var stringValue = value.toString(16)
//         var padding = '00000000'
//         var paddedValue = (padding + stringValue).slice(-padding.length)
//         hexCodes.push(paddedValue);
//     }

//     return hexCodes.join("");
// }




