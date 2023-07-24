import 'core-js/actual';
import { listen } from "@ledgerhq/logs";
import Eth from "@ledgerhq/hw-app-eth";

// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Transport from '@ledgerhq/hw-transport';
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
// import TransportWebHID from "@ledgerhq/hw-transport-webhid";


const MESSAGE = Buffer.from("test").toString("hex")
console.log(MESSAGE)

async function connectPage(document: any): Promise<Transport | undefined> {
  try {
    //trying to connect to your Ledger device with USB protocol
    const transport = await TransportWebUSB.create();
    //Display the header in the div which has the ID "main"
    document.querySelector("#status").textContent = "Connected";
    return transport
  } catch (e) {
    document.querySelector("#status").textContent = e.toString()
  }
}

async function deriveAddresses(document: any, eth: Eth) {
  //Display the address on the Ledger device and ask to verify the address
  const { publicKey, address } = await eth.getAddress("44'/60'/0'/0/0")
  document.querySelector("#publicKey").textContent = publicKey
  document.querySelector("#address").textContent = address
}

async function signTransaction(document: any, eth: Eth) {
  try {
    // sign the message
    const message = document.getElementById("message-input").value
    const signature = await eth.signPersonalMessage("44'/60'/0'/0/0", message);
    const signedHash = "0x" + signature.r + signature.s + signature.v.toString(16);
    //Display signed message on the screen
    document.querySelector("#message").textContent = message
    document.querySelector("#signature").textContent = signedHash
  } catch (e) {
    //Catch any error thrown and displays it on the screen
    document.querySelector("#signature").textContent = e.toString()
  }
}

export async function main(document: any) {
  let transport: Transport
  let eth: Eth

  const connectButton = document.querySelector("#connect-ledger-button");
  const deriveAddressesButton = document.querySelector("#derive-address-button");
  const signTransactionButton = document.querySelector("#sign-message-button");

  listen(log => console.log(log))
  connectButton.addEventListener("click", async () => {
    transport = (await connectPage(document))!;
    eth = new Eth(transport);
  });
  deriveAddressesButton.addEventListener("click", async () => deriveAddresses(document, eth))
  signTransactionButton.addEventListener("click", async () => signTransaction(document, eth))
}


// @ts-ignore
main(document)