import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../Cards/Cards.css";
import { ListingContext } from "../../Context/listing-context";
import Modal2 from "../Modal/Modal2";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

function DisplayRoomListingCard() {
  const { showModal2, selectRoomDetail, selectRoomEmail, selectRoomPhone } = useContext(ListingContext);
  const profileData = JSON.parse(secureLocalStorage.getItem("profile"));
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_Id = profileData?.id || profileData?.user?._id;
        // console.log("user_Id recorded:", user_Id);

        const requestData = {
          userId: user_Id,
        };

        // console.log("requestData:", requestData);

        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/room/my/${user_Id}`,
          requestData
        );
        setRooms(response.data);
        console.log("Room Data:", response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchData();
  }, [profileData?.id]);

  const deleteRoom = async (room_id) => {
    try {
      const user_Id = profileData?.id || profileData?.user?._id;
      const requestBody = {
        userId: user_Id,
        roomId: room_id
      };

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/room/delete`,
        {
          data: requestBody,
        }
      );
      toast.success("Room deleted successfully!");
      // console.log("Room deleted:", response);
      setRooms((prevRooms) => prevRooms.filter((room) => room?._id !== room_id));
    } catch (error) {
      // console.error("Error deleting room:", error);
    }
  };
  return (
    <>
      {showModal2 && <Modal2 />}
      {rooms.map((room) => (
        <div className="each-card" key={room?.id}>
          <span className="cards">
            <div className="main-card">
              <div className="card-img" style={{ backgroundImage: `url(${require('../../Assets/listing-page/boys-listing.png')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="card-info">
                <div className="card-informatios">
                  <div className="card-name">Rank: {room?.rank || "N/A"} - {room?.preferredBlock || "N/A"} Block</div>
                  <div className="card-add" onClick={() => deleteRoom(room?._id)}>
                    <i className="fa-solid fa-heart-crack" style={{ color: "#d98548", fontSize: "16px", cursor: "pointer" }}></i>
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
      ))}
    </>
  );
}

export default DisplayRoomListingCard;


//checker