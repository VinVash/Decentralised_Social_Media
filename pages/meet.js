import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { video } from "@fortawesome/free-regular-svg-icons";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

import { getHuddleClient } from "@huddle01/huddle01-client";

import { useHuddleStore } from "@huddle01/huddle01-client/store";
import PeerVideoAudioElem from "../components/PeerVideoAudioElem";
import MeVideoElem from "../components/MeVideoElem";
import { useState, useEffect } from "react";

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
              Meet
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

export default function Meet() {
  const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const roomState = useHuddleStore((state) => state.roomState);
  const recordingState = useHuddleStore((state) => state.recordingState);
  const recordings = useHuddleStore((state) => state.recordings);

  const [domLoaded, setDomLoaded] = useState(false);
  const [roomId, setRoomId] = useState("dev");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleJoin = async () => {
    try {
      await huddleClient.join(roomId, {
        address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
        wallet: "",
        ens: "axit.eth",
      });

      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <LayoutHeader>
        <div className="flex">
          <div className="md:flex-2 sm:flex-1"> </div>
          <div className="md:flex-2 sm:flex-3" style={{ width: "100%" }}>
            <div>
              <div className="mt-6 flex-1  flow-root">
                <h2
                  className={`text-${
                    !roomState.joined ? "red" : "green"
                  } text-center`}
                >
                  Room Joined:&nbsp;{roomState.joined.toString()}
                </h2>

                <div className="flex flex-row justify-between mt-4">
                  <input
                    type="text"
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="p-2 border-2"
                  ></input>

                  <button
                    onClick={handleJoin}
                    className="text-white bg-gray-300 px-6 py-2"
                  >
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="text-gray-600 hover:text-gray-400"
                    />
                  </button>
                </div>

                <div className="flex flex-row justify-between mt-4">
                  <button
                    onClick={() => huddleClient.enableWebcam()}
                    className="text-white bg-gray-300 px-6 py-3"
                  >
                    <FontAwesomeIcon
                      icon={faVideo}
                      className="text-gray-600 hover:text-gray-400"
                    />
                  </button>

                  <button
                    onClick={() => huddleClient.disableWebcam()}
                    className="text-white bg-gray-300 px-6 py-3"
                  >
                    <FontAwesomeIcon
                      icon={faVideoSlash}
                      className="text-gray-600 hover:text-gray-400"
                    />
                  </button>

                  <button
                    onClick={() => huddleClient.unmuteMic()}
                    className="bg-gray-300 text-white px-6 py-3"
                  >
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      className="text-gray-600 hover:text-gray-400"
                    />
                  </button>

                  <button
                    onClick={() => huddleClient.muteMic()}
                    className="bg-gray-300 text-white px-6 py-3"
                  >
                    <FontAwesomeIcon
                      icon={faMicrophoneSlash}
                      className="text-gray-600 hover:text-gray-400"
                    />
                  </button>
                </div>

                <div className="mt-4 flex flex-row justify-around">
                  <button
                    onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}
                    className="bg-black text-white p-2"
                  >
                    Allow All Lobby Peers to Join Room
                  </button>
                </div>

                {domLoaded && <MeVideoElem />}

                {lobbyPeers[0] && <h2>Lobby Peers</h2>}
                <div>
                  {lobbyPeers.map((peer) => (
                    <div key={index}>{peer.peerId}</div>
                  ))}
                </div>

                {peersKeys[0] && <h2>Peers</h2>}

                <div className="peers-grid">
                  {peersKeys.map((key) => (
                    <PeerVideoAudioElem
                      key={`peerId-${key}`}
                      peerIdAtIndex={key}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:flex-2 sm:flex-1"> </div>
        </div>
      </LayoutHeader>
    </>
  );
}
