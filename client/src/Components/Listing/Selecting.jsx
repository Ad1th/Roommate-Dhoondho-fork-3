import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
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

export const Listing = () => {
  const {
    selectRoommateEmail,
    selectRoommatePhone,
    showModal,
    showModal2,
    selectRoommateDetail,
    selectRoomDetail,
    selectRoomEmail,
    selectRoomPhone,
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

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        setIsLoading(true);
        const userId = profileData?.user?._id || profileData?.id;
        
        const userRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${userId}`);
        const likedRoommateIds = userRes.data.likesRoommate || [];
        const likedRoomIds = userRes.data.likesRoom || [];

        const roommatePromises = likedRoommateIds.map(id => axios.get(`${process.env.REACT_APP_SERVER_URL}/roommate/${id}`));
        const roomPromises = likedRoomIds.map(id => axios.get(`${process.env.REACT_APP_SERVER_URL}/room/${id}`));

        const [roommateResults, roomResults] = await Promise.all([
          Promise.allSettled(roommatePromises),
          Promise.allSettled(roomPromises)
        ]);

        setRoommatePosts(roommateResults.filter(res => res.status === 'fulfilled').map(res => res.value.data));
        setRoomPosts(roomResults.filter(res => res.status === 'fulfilled').map(res => res.value.data));
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load selections");
        setIsLoading(false);
      }
    };
    if (profileData) fetchLikedItems();
  }, []);

  const handleStartChat = async (roommate) => {
    const chat = await startChat({ _id: roommate._id, firstname: roommate.firstname, lastname: roommate.lastname });
    if (chat) toast.success("Chat started!");
  };

  return (
    <div className="listing">
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
          <>
            {showModal && <Modal />}
            {showModal2 && <Modal2 />}

            <h3 className="selection-heading">Liked Roommates</h3>
            <div className="cards"> {/* Grid Parent */}
              {roommatePosts.length > 0 ? roommatePosts.map((item) => (
                <div className="each-card" key={item?._id}>
                  <div className="main-card">
                    <div className="card-details">
                      <div className="card-img" style={{ backgroundImage: `url('https://static01.nyt.com/images/2020/04/19/magazine/19Ethicist/19Ethicist-jumbo.jpg')`, backgroundSize: 'cover' }}></div>
                      <div className="card-info">
                        <div className="card-informatios">
                          <div className="card-name">Roommate Posting</div>
                          <button className="chat-button" onClick={() => handleStartChat(item)}>Chat</button>
                        </div>
                        <div className="card-preference">
                          <div className="card-rank">
                            <div className="card-preference-title">Rank</div>
                            <div className="card-preference-content">{item?.rank}</div>
                          </div>
                          <div className="card-bed">
                            <div className="card-preference-title">Bed</div>
                            <div className="card-preference-content">{item?.preferredBed}</div>
                          </div>
                        </div>
                        <div className="card-downers">
                          <div className="card-year">
                            <div className="card-preference-title">Year</div>
                            <div className="card-preference-Year">{item?.year}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-hr"><hr /></div>
                    <div className="card-habits-section">
                      <div className="card-habit">Description</div>
                      <div className="card-habit-details" onClick={() => {
                        selectRoommateDetail(item?.desc);
                        selectRoommatePhone(item?.phone);
                        selectRoommateEmail(item?.username);
                      }}>
                        <img src="./image/desc.png" alt="desc" style={{ height: "18px", width: "18px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )) : <p className="empty-msg">No liked roommates yet.</p>}
            </div>

            <h3 className="selection-heading">Liked Rooms</h3>
            <div className="cards"> {/* Grid Parent */}
              {roomPosts.length > 0 ? roomPosts.map((room) => (
                <div className="each-card" key={room?._id}>
                  <div className="main-card">
                    <div className="card-details">
                      <div className="card-img" style={{ backgroundImage: `url('https://c4.wallpaperflare.com/wallpaper/40/849/87/anime-girls-wallpaper-preview.jpg')`, backgroundSize: 'cover' }}></div>
                      <div className="card-info">
                        <div className="card-informatios">
                          <div className="card-name">{room?.preferredBlock} Block</div>
                        </div>
                        <div className="card-preference">
                          <div className="card-rank">
                            <div className="card-preference-title">Rank</div>
                            <div className="card-preference-content">{room?.rank}</div>
                          </div>
                          <div className="card-bed">
                            <div className="card-preference-title">Bed</div>
                            <div className="card-preference-content">{room?.preferredBed}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-hr"><hr /></div>
                    <div className="card-habits-section">
                      <div className="card-habit">Room Details</div>
                      <div className="card-habit-details" onClick={() => {
                        selectRoomDetail(room?.desc);
                        selectRoomPhone(room?.phone);
                        selectRoomEmail(room?.username);
                      }}>
                        <img src="./image/desc.png" alt="desc" style={{ height: "18px", width: "18px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )) : <p className="empty-msg">No liked rooms yet.</p>}
            </div>
          </>
        )}
      </div>

      {activeChats.map((chat) => (
        <ChatWindow key={chat.id} chatId={chat.id} otherUser={chat.otherUser} onClose={() => closeChat(chat.id)} />
      ))}
    </div>
  );
};