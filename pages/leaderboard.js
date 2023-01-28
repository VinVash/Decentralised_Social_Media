import PeopleCard from "../components/layouts/components/PeopleCard";

const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

import contractAddresses from "../constants/contractAddresses.json";
import abi from "../constants/abi.json";
import { useEffect, useState } from "react";

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

function LayoutHeader({ children }) {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100 pt-24 pb-8">
      <div className="w-1/2 px-12 py-4 mx-auto bg-white rounded-lg shadow-xl">
        {/*middle wall*/}
        <div className="max-w-md mx-auto space-y-6">
          {/* Component starts here */}
          <h2 className="flex flex-row flex-nowrap items-center my-8">
            <span
              className="flex-grow block border-t border-black"
              aria-hidden="true"
              role="presentation"
            />
            <span className="flex-none block mx-4 px-4 py-2.5 leading-none font-medium uppercase bg-black text-white tracking-widest">
              Leaderboard
            </span>
            <span
              className="flex-grow block border-t border-black"
              aria-hidden="true"
              role="presentation"
            />
          </h2>
          {/* Component ends here */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  const connectToWeb3 = async () => {
    try {
      const chain = EvmChain.MUMBAI;
      const address = "0x7C582a184401C037112F84423d11451E18D58b6D";

      // token 0 address, e.g. WETH token address
      const functionName = "getAllLeaderboard";

      const response = await Moralis.EvmApi.utils.runContractFunction({
        abi,
        functionName,
        address,
        chain,
      });

      console.log(response.toJSON());
      setLeaders(response.toJSON());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectToWeb3();
  }, []);

  return (
    <>
      <LayoutHeader>
        <div className="mt-6 divide-y-2">
          {leaders &&
            leaders
              .slice(0, 3)
              .map((person, index) => (
                <PeopleCard person={person} index={index} leaders={leaders} />
              ))}
        </div>
      </LayoutHeader>
    </>
  );
}
