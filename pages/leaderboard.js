import PeopleCard from "../components/layouts/components/PeopleCard";
import { ethers } from "ethers";

import contractAddresses from "../constants/contractAddresses.json";
import abi from "../constants/abi.json";

import { useEffect, useState } from "react";

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

  const fetchLeaderboard = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      abi,
      signer
    );

    const leaderboardData = await contract.getAllLeaderboard();
    const leaderboardDataReversed = [...leaderboardData];
    leaderboardDataReversed.reverse();
    setLeaders(leaderboardDataReversed);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <>
      <LayoutHeader>
        <div className="mt-6 divide-y-2">
          {leaders &&
            leaders
              .slice(0, 3)
              .map((person, index) => (
                <PeopleCard
                  person={person}
                  index={index}
                  leaders={leaders}
                  key={index}
                />
              ))}
        </div>
      </LayoutHeader>
    </>
  );
}
