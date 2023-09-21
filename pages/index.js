import { useEffect, useState } from "react";
import { ethers } from "ethers";

import contractAddresses from "../constants/contractAddresses.json";
import desoContract from "../artifacts/contracts/PostApp.sol/SocialMedia.json";

import PostCard from "../components/layouts/components/PostCard";

const Home = () => {

  const [chainId, setChainId] = useState("");
  const [posts, setPosts] = useState([]);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const connectToMetaMask = async () => {

    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signerInstance = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        desoContract,
        signerInstance
      );

      setProvider(web3Provider);
      setSigner(signerInstance);
      setContract(contractInstance);

      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected the connect request");
      }

      // Subscribe to accounts change
      window.ethereum.on('accountsChanged', (accounts) => {
        setCurrentAccount(accounts[0]);
      });
    } else {
      console.log("No web3? You should consider trying MetaMask!");
    }
  };


  const getAllPosts = async () => {

    try {
      const allPosts = await contract.getAllPosts()
      console.log("All posts: ", allPosts)
      setPosts(allPosts)
    } catch (e) {
      console.log("error in fetching all posts")
      console.log(e)
    }

  };

  useEffect(() => {
    if(currentAccount === null) {
      connectToMetaMask()
    }
    if(currentAccount !== null) {
      getAllPosts()
    }
  }, [currentAccount]);

  return (
    <>
      <div className="flex justify-center min-h-screen bg-gray-100 pt-24 pb-8">
        <div className="w-1/2 px-12 py-4 mx-auto bg-white rounded-lg shadow-xl">
          <div className="max-w-md mx-auto space-y-6">
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
          {posts && posts.length > 0 ? (
            <div className="divide-y divide-gray-200 -mt-4 overflow-y-scroll">
              {posts
                .filter(
                  (post) =>
                    post[1] !== "0x0000000000000000000000000000000000000000"
                )
                .reverse()
                .map((post, index) => {
                  if(!post.isCensored) {
                    return (
                      <div className="px-4 py-4" key={index}>
                        <PostCard
                          post={post}
                          postId={post.id}
                          length={posts.length}
                        />
                      </div>
                    );
                  }}
                )}
            </div>
          ) : (
            <div
              role="status"
              className="flex justify-center items-center mt-8"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
