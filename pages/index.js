import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

import contractAddresses from "../constants/contractAddresses.json";
import abi from "../constants/abi.json";
import PostCard from "../components/layouts/components/PostCard";

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

const Home = () => {
  const [chainId, setChainId] = useState("");
  const [account, setAccount] = useState(null);
  const [posts, setPosts] = useState([]);

  const connectToWeb3 = async () => {
    try {
      const chain = EvmChain.MUMBAI;
      const address = "0x896D8Ee3962CDd31A95D9A0C1f91ba1b09Cf2626";

      // token 0 address, e.g. WETH token address
      const functionName = "getAllPosts";

      const response = await Moralis.EvmApi.utils.runContractFunction({
        abi,
        functionName,
        address,
        chain,
      });

      setPosts(response.toJSON());
      console.log(response.toJSON());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectToWeb3();
  }, []);

  let contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // console.log(contractAddress[0]); // error in this line. cannot access 0th index.

  return (
    <>
      {posts && posts.length > 0 ? (
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
                  Posts
                </span>
                <span
                  className="flex-grow block border-t border-black"
                  aria-hidden="true"
                  role="presentation"
                />
              </h2>
            </div>

            <hr className=" bg-slate-900" />
            {posts.map((post, index) => {
              return (
                <div className="px-4 border-t border-gray-600" key={index}>
                  <PostCard post={post} key={post.id} length={posts.length} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Print message connected to the wallet
        <div className="flex justify-center min-h-screen items-center">
          Loading Posts...
        </div>
      )}
    </>
  );
};

export default Home;
