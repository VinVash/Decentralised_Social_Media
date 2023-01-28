import React from "react";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

import contractAddresses from "../../../constants/contractAddresses.json";
import abi from "../../../constants/abi.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Moralis.start({
//   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// });

export default function PeopleCard({ person, index, leaders }) {
  const [score, setScore] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const connectToWeb3 = async () => {
    console.log(selectedPerson);
    try {
      const contract = new ethers.Contract(
        "0x7C582a184401C037112F84423d11451E18D58b6D",
        abi
      );
      const response = await contract.scores(selectedPerson);
      setScore(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectToWeb3();
  }, [selectedPerson]);

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4 text-3xl">
        <FontAwesomeIcon
          icon={faMedal}
          className={
            index === 0
              ? "text-[#FFD700]"
              : index === 1
              ? "text-[#C0C0C0]"
              : index === 2
              ? "text-[#CD7F32]"
              : "text-[#191819]"
          }
        />
        <div className="flex flex-col gap-1">
          <p className="truncate text-sm font-medium text-gray-900">{person}</p>
          {score && (
            <p className="truncate text-sm font-medium text-gray-900">
              {score}
            </p>
          )}
        </div>
      </div>
      <div>
        <p
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200"
          onClick={() => {
            setSelectedPerson(person);
          }}
        >
          Score
        </p>
      </div>
    </div>
  );
}
