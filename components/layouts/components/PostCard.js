import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartOutline,
  faComment,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
  faPen,
  faHeart,
  faSmile,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import desoContract from "../../../artifacts/contracts/PostApp.sol/SocialMedia.json";

export default function PostCard({ post, postId, length }) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const router = useRouter();

  const [addr, setAddr] = useState(null);
  const [commnetsOpenId, setCommentsOpenId] = useState(null);
  const [comment, setComment] = useState("");

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    desoContract,
    signer
  );

  // set the address of signer in state.
  const getAddressOfSigner = async () => {
    let addr = await signer.getAddress();
    setAddr(addr);
  };

  const likePost = async () => {
    const desoData = await contract.likePost(post[1], post[0]);

    const desoPostResult = await desoData.wait();
  };

  const commentOnPost = async () => {
    const desoData = await contract.commentOnPost(post[1], post[0], comment);

    const desoPostResult = await desoData.wait();
    setComment("");
    setCommentsOpenId(null);
  };

  const editPost = async () => {
    router.push(`/editPost?postId=${postId}`);
  };

  const deletePost = async () => {
    try {
      const desoData = await contract.deletePost(post[0]); // passing the postId.

      const desoPostResult = await desoData.wait();
      window.location.reload();
    } catch (error) {
      if (error.message.includes("cannot estimate gas")) {
        alert("A post can only be deleted by its author!");
      }
    }
  };

  const calculateLikes = (likeAddresses) => {
    let likeCount = 0;

    likeAddresses
      .filter((add) => add !== "0x0000000000000000000000000000000000000000")
      .map((add) => likeCount++);
    return likeCount;
  };

  useEffect(() => {
    getAddressOfSigner();
  }, [addr]);

  return (
    <div className="py-8">
      <div className="w-full">
        <div className="flex justify-between item-center">
          <p className="text-base font-medium text-[#191819]">
            {post[1].slice(0, 4)}...{post[1].slice(-4)}
          </p>
          <div>
            <span className="text-sm leading-5 text-gray-600 group-hover:text-gray-300 transition ease-in-out duration-150">
              {new Date(post[3] * 1000).toString().slice(4, 15)},{" "}
              {new Date(post[3] * 1000).toString().slice(16, 21)} IST
            </span>
          </div>
        </div>
        <div className="mt-2 mb-4">
          <p className="text-sm leading-5 text-gray-700 italic">{post[2]}</p>
        </div>
        <img
          className="inline-block"
          src={
            post[6] ||
            "https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
          }
          // alt="Profile Pic"
        />
        <div className="flex justify-between text-sm mt-4">
          <div className="flex items-center gap-2">
            {post[7].includes(addr) ? (
              <FontAwesomeIcon
                icon={faHeart}
                className="text-red-600 hover:text-red-300 cursor-pointer"
                onClick={() => likePost()}
              />
            ) : (
              <FontAwesomeIcon
                icon={faHeartOutline}
                className="text-red-600 hover:text-red-300 cursor-pointer"
                onClick={() => likePost()}
              />
            )}

            <span className="text-sm leading-5 text-gray-600 group-hover:text-gray-300 transition ease-in-out duration-150">
              {post[7] ? calculateLikes(post[7]) : 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faPen}
              className="text-gray-600 hover:text-gray-200 cursor-pointer"
              onClick={() => editPost()}
            />
          </div>
          <div
            className="flex items-center gap-2"
            onClick={() => setCommentsOpenId(postId)}
          >
            <FontAwesomeIcon
              icon={faComment}
              className="text-gray-600 hover:text-gray-200"
            />
            <span className="text-sm leading-5 text-gray-600 group-hover:text-gray-300 transition ease-in-out duration-150">
              {post[8] ? post[8].length : 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-gray-600 hover:text-gray-200 cursor-pointer"
              onClick={() => deletePost()}
            />
          </div>
        </div>
        {commnetsOpenId === postId && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md"
                onClick={() => commentOnPost()}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
