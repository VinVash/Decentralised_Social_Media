import React from "react";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import abi from "../../../constants/abi.json";
import { useState } from "react";
import { ethers } from "ethers";

export default function PeopleCard({ person, index, leaders }) {
  const [score, setScore] = useState(null);

  const getScore = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      abi,
      signer
    );

    const leaderScore = await contract.scores(person);

    setScore(parseInt(leaderScore._hex).toString());
  };

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
            <p className="truncate text-sm italic text-gray-900">
              Score: {score}
            </p>
          )}
        </div>
      </div>
      <div>
        <p
          className="cursor-pointer hover:bg-gray-100 inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm transition-all duration-200"
          onClick={() => {
            getScore();
          }}
        >
          View Score
        </p>
      </div>
    </div>
  );
}
