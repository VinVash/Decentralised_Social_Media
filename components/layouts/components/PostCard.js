import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
export default function PostCard({ post, key, length }) {
  return (
    <div className="flex gap-4 items-center p-4 w-full">
      <img
        className="inline-block h-10 w-10 rounded-full"
        src={
          post[6] ||
          "https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
        }
        // alt="Profile Pic"
      />
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
        <div className="my-4">
          <p className="text-sm leading-5 text-gray-700 italic">{post[2]}</p>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-gray-600 hover:text-gray-200"
            />
            <span className="text-sm leading-5 text-gray-600 group-hover:text-gray-300 transition ease-in-out duration-150">
              {post[7] ? post[7].length : 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faPen}
              className="text-gray-600 hover:text-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
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
              className="text-gray-600 hover:text-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
