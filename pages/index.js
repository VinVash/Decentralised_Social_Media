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
        <div className="flex bg-[#191819] justify-center min-h-screen py-24">
          <div className="w-1/2 border border-gray-600 rounded-3xl">
            {/*middle wall*/}
            <div className="flex justify-between items-center w-full px-8 py-4">
              <h2 className="text-xl font-semibold text-white">Home</h2>
              <a
                href="#"
                className=" text-2xl font-medium rounded-full text-white hover:text-blue-500 float-right"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <path d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z" />
                  </g>
                </svg>
              </a>
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
