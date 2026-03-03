import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import { ListingContext } from "../../Context/listing-context.jsx";
import { useChat } from "../../Context/chat-context";
import ChatWindow from "../Chat/ChatWindow";
import "../Cards/Cards.css";
import "./Selecting.css";
import Modal from "../../Components/Modal/Modal";
import Modal2 from "../Modal/Modal2";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

import blob1 from "../../Assets/listing-page/blob1.svg";
import blob2 from "../../Assets/listing-page/blob2.svg";
import blob3 from "../../Assets/listing-page/blob3.svg";
import blob4 from "../../Assets/listing-page/blob4.svg";
import blob5 from "../../Assets/listing-page/blob5.svg";
import boysListingImg from "../../Assets/listing-page/boys-listing.png";

import Hotjar from '@hotjar/browser';
const siteId = 3765543;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);

export const Listing = () => {
  const {
    showModal,
    showModal2,
    selectRoommateDetail,
    selectRoomDetail,
    selectRoommatePhone,
    selectRoommateEmail,
    selectRoomPhone,
    selectRoomEmail,
  } = useContext(ListingContext);

  const { activeChats, startChat, closeChat } = useChat();
  const profileData = JSON.parse(secureLocalStorage.getItem("profile"));
  const navigate = useNavigate();

  const [roommatePosts, setRoommatePosts] = useState([]);
  const [roomPosts, setRoomPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profileData) {
      toast.error('Session expired. Please Sign In again.');
      navigate("/");
    }
  }, [profileData, navigate]);

  const fetchLikedItems = async () => {
    try {
      setIsLoading(true);
      const userId = profileData?.user?._id || profileData?.id;

      const userRes = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/user/${userId}`
      );

      const likedRoommateIds = userRes.data.likesRoommate || [];
      const likedRoomIds = userRes.data.likesRoom || [];

      const roommatePromises = likedRoommateIds.map(id =>
        axios.get(`${process.env.REACT_APP_SERVER_URL}/roommate/${id}`)
      );

      const roomPromises = likedRoomIds.map(id =>
        axios.get(`${process.env.REACT_APP_SERVER_URL}/room/${id}`)
      );

      const [roommateResults, roomResults] = await Promise.all([
        Promise.allSettled(roommatePromises),
        Promise.allSettled(roomPromises)
      ]);

      setRoommatePosts(roommateResults.filter(res => res.status === 'fulfilled').map(res => res.value.data));
      setRoomPosts(roomResults.filter(res => res.status === 'fulfilled').map(res => res.value.data));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching selections:", error);
      toast.error("Failed to load your selections");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) fetchLikedItems();
  }, []);

  // --- HANDLERS FOR UNLIKING (Removing from Selections) ---
  const handleUnlikeRoommate = async (roommateId) => {
    try {
      const currentUserId = profileData?.user?._id || profileData?.id; // Renamed to match backend
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/likesroommate`, {
        currentUserId, // Changed key from userId to currentUserId
        roommateId
      });
      toast.success("Removed from selections");
      setRoommatePosts(prev => prev.filter(item => (item?._id || item?.id) !== roommateId));
    } catch (error) {
      toast.error("Failed to remove roommate");
    }
  };

  const handleUnlikeRoom = async (roomId) => {
    try {
      const currentUserId = profileData?.user?._id || profileData?.id; // Renamed to match backend
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/likesroom`, {
        currentUserId, // Changed key from userId to currentUserId
        roomId
      });
      toast.success("Removed from selections");
      setRoomPosts(prev => prev.filter(item => (item?._id || item?.id) !== roomId));
    } catch (error) {
      toast.error("Failed to remove room");
    }
  };

  const handleStartChat = async (roommate) => {
    const chat = await startChat({
      _id: roommate._id,
      firstname: roommate.firstname,
      lastname: roommate.lastname,
    });
    if (chat) toast.success("Chat started!");
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <div className="listing-background">
        <img src={blob1} alt="" className="blob b1" />
        <img src={blob2} alt="" className="blob b2" />
        <img src={blob3} alt="" className="blob b3" />
        <img src={blob4} alt="" className="blob b4" />
        <img src={blob5} alt="" className="blob b5" />
      </div>
      <Navbar />
      <div className="listing relative z-10 w-[90vw] m-auto mb-8">
        <div className="listing-buttons">
          <button className="activelisting">
            <p className="listing-text">Your Selections</p>
          </button>
        </div>
        <div className="profiletab-hr"><hr /></div>

        <div className="tab-content">
          {isLoading ? (
            <div className="loading-indicator-container">
              <CircularProgress disableShrink color="primary" size={40} />
            </div>
          ) : (
            <div>
              {showModal && <Modal />}
              {showModal2 && <Modal2 />}

              {/* --- ROOMMATES SECTION --- */}
              <h3 className="selection-heading">Liked Roommates</h3>
              <div className="cards">
                {roommatePosts.length > 0 ? roommatePosts.map((item) => (
                  <div className="each-card" key={item?._id}>
                    <span className="cards">
                      <div className="main-card">
                        <div className="card-img" style={{ backgroundImage: `url(${boysListingImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="card-info">
                          <div className="card-informatios">
                            <div className="card-name">
                              {item?.userDetails?.firstname ?? "Roommate"} {item?.userDetails?.lastname ?? "Posting"}
                            </div>
                            <div className="card-actions flex gap-2">
                              <button className="chat-button" onClick={() => handleStartChat(item)}>Chat</button>
                              <div className="card-add" onClick={() => handleUnlikeRoommate(item?._id)}>
                                <i className="fa-solid fa-heart-crack" style={{ color: "#d98548", fontSize: "14px", cursor: "pointer" }}></i>
                              </div>
                            </div>
                          </div>
                          <div className="card-preference">
                            <div>
                              <div className="card-preference-title">Rank</div>
                              <div className="card-preference-content">{item?.rank || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Preferred Bed</div>
                              <div className="card-preference-content">{item?.preferredBed || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Year</div>
                              <div className="card-preference-content">{item?.year || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Gender</div>
                              <div className="card-preference-content">{item?.gender || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Vacancy</div>
                              <div className="card-preference-content">{item?.remaining || "N/A"}</div>
                            </div>
                          </div>
                          <div className="card-habits-section">
                            <div className="card-habit-details" onClick={() => {
                              selectRoommateDetail(item?.desc);
                              selectRoommatePhone(item?.phone);
                              selectRoommateEmail(item?.username);
                            }}>
                              Description
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                )) : <p>No liked roommates yet.</p>}
              </div>

              {/* --- ROOMS SECTION --- */}
              <h3 className="selection-heading" style={{ marginTop: '40px' }}>Liked Rooms</h3>
              <div className="cards">
                {roomPosts.length > 0 ? roomPosts.map((room) => (
                  <div className="each-card" key={room?._id}>
                    <span className="cards">
                      <div className="main-card">
                        <div className="card-img" style={{ backgroundImage: `url(${boysListingImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="card-info">
                          <div className="card-informatios">
                            <div className="card-name">
                              Rank: {room?.rank || "N/A"} - {room?.preferredBlock || "N/A"} Block
                            </div>
                            <div className="card-add" onClick={() => handleUnlikeRoom(room?._id)}>
                              <i className="fa-solid fa-heart-crack" style={{ color: "#d98548", fontSize: "14px", cursor: "pointer" }}></i>
                            </div>
                          </div>
                          <div className="card-preference">
                            <div>
                              <div className="card-preference-title">Rank</div>
                              <div className="card-preference-content">{room?.rank || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Preferred Bed</div>
                              <div className="card-preference-content">{room?.preferredBed || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Block</div>
                              <div className="card-preference-content">{room?.preferredBlock || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Year</div>
                              <div className="card-preference-content">{room?.year || "N/A"}</div>
                            </div>
                            <div>
                              <div className="card-preference-title">Gender</div>
                              <div className="card-preference-content">{room?.gender || "N/A"}</div>
                            </div>
                          </div>
                          <div className="card-habits-section">
                            <div className="card-habit-details" onClick={() => {
                              selectRoomDetail(room?.desc);
                              selectRoomPhone(room?.phone);
                              selectRoomEmail(room?.username);
                            }}>
                              Description
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                )) : <p>No liked rooms yet.</p>}
              </div>
            </div>
          )}
        </div>

        {activeChats.map((chat) => (
          <ChatWindow key={chat.id} chatId={chat.id} otherUser={chat.otherUser} onClose={() => closeChat(chat.id)} />
        ))}
      </div>
    </div>
  );
};