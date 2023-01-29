import { createContext, useState, useContext, useEffect, use } from "react";
import { TailSpin } from "react-loader-spinner";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import Router from "next/router";
import abi from "../../constants/abi.json";
let pinataUrlString = "";
const axios = require("axios");
const FormState = createContext();
import FormData from "form-data";
import { post } from "pinata-ipfs-http-client/src/lib/core";

export default function NewFormEdit(postId) {
  const [form, setForm] = useState({
    story: "",
  });

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [storyUrl, setStoryUrl] = useState();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [postData, setPostData] = useState(null);

  const FormHandler = (e) => {
    setForm({
      ...form,
      story: e.target.value,
    });
  };

  let filedata = new FormData();

  //   to be called just after loading the DOM.
  const getPostData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      abi,
      signer
    );

    const postData = await contract.posts(postId.postId);
    setPostData(postData);
    setForm({ ...form, story: postData[2] });
    pinataUrlString = postData[6];
    console.log(postData);
  };

  useEffect(() => {
    getPostData();
  }, []);

  const editPost = async (e, pinataUrlString) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      abi,
      signer
    );

    setUploadLoading(true);
    console.log(form);

    if (file) {
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      //we gather a local file from the API for this example, but you can gather the file from anywhere

      const result = await axios({
        method: "post",
        url: url,
        data: filedata,
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: `${process.env.NEXT_PUBLIC_IPFS_ID}`,
          pinata_secret_api_key: `${process.env.NEXT_PUBLIC_IPFS_KEY}`,
        },
      });

      console.log("RESULT  " + JSON.stringify(result));
      let IPFSHASH = result.data.IpfsHash;
      pinataUrlString = `https://gateway.pinata.cloud/ipfs/${IPFSHASH}`;
    }

    setUploadLoading(false);
    const textToIpfsUrl = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    let textToIpfsJson = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: "",
      },
      pinataContent: {},
    };

    if (storyUrl != "" && storyUrl != undefined) {
      let address = await signer.getAddress();
      textToIpfsJson.pinataMetadata.name = address + "_caption";
      textToIpfsJson.pinataContent[`${address}`] = storyUrl;

      const result = await axios({
        method: "post",
        url: textToIpfsUrl,
        data: textToIpfsJson,
        headers: {
          "Content-Type": `application/json`,
          pinata_api_key: `${process.env.NEXT_PUBLIC_IPFS_ID}`,
          pinata_secret_api_key: `${process.env.NEXT_PUBLIC_IPFS_KEY}`,
        },
      });

      console.log("Result for text Upload", JSON.stringify(result));
      let IPFSHASH = result.data.IpfsHash;
      pinataUrlString = `https://gateway.pinata.cloud/ipfs/${IPFSHASH}`;
    }

    if (form.story === "") {
      toast.warn("Story Field Is Empty");
    } else {
      setLoading(true);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        abi,
        signer
      );

      const desoData = await contract.editPost(
        postId.postId,
        form.story,
        pinataUrlString
      );

      const desoPostResult = await desoData.wait();

      console.log("Post edited!");
      setAddress(desoData.to);
      if (desoPostResult.to) {
        setLoading(false);
        toast.success("Post edited Successfully!");
        Router.push("/");
      }
    }
    return false;
  };

  return (
    <FormState.Provider
      value={{
        form,
        setForm,
        setLoading,
        FormHandler,
        setStoryUrl,
        // editPost,
        setUploaded,
      }}
    >
      <form action="#" className="relative">
        <div style={{ margin: "20px 32px" }}>
          <label htmlFor="story" className="sr-only">
            Description
          </label>
          <textarea
            rows={2}
            name="story"
            id="story"
            onChange={FormHandler}
            className="block w-full resize-none border-0 py-0 placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="Write a caption..."
            style={{ outline: "none", fontSize: "15px" }}
            defaultValue={postData ? postData[2] : ""}
          />

          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
            <div className="h-px" />
            <div className="py-2">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-px bottom-0">
          <div
            style={{ margin: "0 15px" }}
            className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3"
          >
            <div className="flex">
              <input
                type="file"
                alt="dapp"
                id="actual-btn"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setFile(true);
                }}
                required
                accept="image/*"
                style={{ fontSize: "12px" }}
                className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400"
                hidden={true}
              />
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                onClick={(e) => {
                  filedata.append("file", image);
                  editPost(e, pinataUrlString);
                }}
                style={{ fontSize: "12px", height: "30px" }}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormState.Provider>
  );
}
