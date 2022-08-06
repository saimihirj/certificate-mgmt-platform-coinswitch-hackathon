const connectButton = document.getElementById("connectButton")

connectButton.onclick = connect


async function connect() {
    console.log("Connecting...")
    if (typeof window.ethereum !== "undefined") {
        try {
            //wallet_requestPermissions(doesnt stay connected) (OR) eth_requestAccounts (stays connected)
            await ethereum.request({
                method: "eth_requestAccounts",
                
            })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected! "
        document.getElementById('dashboard').style.display = 'block'

    }
    else {
        connectButton.innerHTML = "<a href = 'https://metamask.io/' target='_blank' style='color: white;'> Download Metamask</a>"
    }
}
