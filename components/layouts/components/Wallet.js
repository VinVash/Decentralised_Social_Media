import styled from "styled-components";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import desoContract from "../../../artifacts/contracts/PostApp.sol/SocialMedia.json";

const networks = {
  polygon: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://polygon-mumbai.g.alchemy.com/v2/cZrTCE5xuzwP1zWh76EtQ21JSdG5fau8",
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

const Wallet = () => {
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    if (provider.network !== "matic") {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks["polygon"],
          },
        ],
      });
    }

    // Subscribe to accounts change
    window.ethereum.on('accountsChanged', (accounts) => {
      setAddress(accounts[0]);
    });

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(accounts[0]);
  };

  useEffect(() => {
    connectWallet()
  }, [])

  return (
    <>
      {address == "" ? (
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <a href="#" className="group block flex-shrink-0">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {address !== undefined ? `${address.slice(0, 6)}...${address.slice(39)}` : ""}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                View profile
              </p>
            </div>
          </div>
        </a>
      )}
    </>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 5px 9px;
  height: 100%;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: "Roboto";
  font-weight: bold;
  font-size: small;
  cursor: pointer;
`;

const Address = styled.h2`
  background-color: ${(props) => props.theme.bgSubDiv};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px 0 5px;
  border-radius: 10px;
`;

export default Wallet;
