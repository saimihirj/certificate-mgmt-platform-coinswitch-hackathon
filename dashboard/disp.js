import {ethers} from './ethers-5.6.esm.min.js'

async function walletAddress() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        let myAddress = await signer.getAddress().then(function(response) {
            return response;
        })
        document.getElementById('myWalletAddress').innerHTML = myAddress
        console.log(myAddress)
    }
}
walletAddress()
//document.addEventListener('DOMContentLoaded', walletAddress, false);