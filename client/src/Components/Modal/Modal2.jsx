import { useContext } from "react";
import React from "react";
import { ListingContext } from "../../Context/listing-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Modal.css";
import secureLocalStorage from "react-secure-storage";

function Modal2() {
  const profileData = JSON.parse(secureLocalStorage.getItem("profile"));
  const { seletedroomdetail, seletedroomemail, seletedroomphone, closeModal2 } =
    useContext(ListingContext);
  // console.log(seletedroomdetail);
  const countryCode = "91";
  const whatsappMessage = `Hello! I am ${profileData.user.firstname} ${profileData.user.lastname}, I found your listing from Roommate Dhoondho app and I am interested in your listing.`;
  const whatsappLink = `https://wa.me/${countryCode}${seletedroomphone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;
  const emailSubject = `${profileData.user.firstname} ${profileData.user.lastname} - Roommate Dhoondho`;
  const emailBody = `Hello! I am ${profileData.user.firstname} ${profileData.user.lastname}, I found your listing from Roommate Dhoondho app and I am interested in your listing.`;
  const emailLink = `mailto:${seletedroomemail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const instagramPrefix = "Insta: ";
  let instagramUID = "";
  let instagramLink = "";
  let descriptionOnly = "";
  if (seletedroomdetail.startsWith(instagramPrefix)) {
    const parts = seletedroomdetail.split("|");
    if (parts.length > 0) {
      instagramUID = parts[0].replace(instagramPrefix, "").trim();
      instagramLink = `https://instagram.com/${instagramUID}`;
    }
    if (seletedroomdetail.includes("| ")) {
      const parts = seletedroomdetail.split("| ");
      if (parts.length > 1 && parts[1].trim() !== "") {
        descriptionOnly = parts[1];
      } else {
        descriptionOnly = "";
      }
    }
  } else {
    descriptionOnly = seletedroomdetail;
  }

  return (
    <aside className="modal-overlay">
      <div className="modal-container">
        <div className="habits">
          <div className="habitstab-main">
            <div className="habits-buttons">
              <div className="activehabits">
                <p className="habits-text">Description</p>
              </div>
            </div>
            <div>
              <p><small><font color="grey">Click on the phone no. to open WhatsApp chat</font></small></p>
            </div>
            <div className="habitstab-hr">
              <hr />
            </div>
          </div>
          <div className="habitssection">
            <p>
              <b>Phone Number: </b>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon="fab fa-whatsapp" />
                <i class="fab fa-whatsapp"></i> {seletedroomphone}
              </a>
            </p>
            <br />
            <p>
              <b>Email Id: </b>
              <a href={emailLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon="fa-regular fa-envelope" />
                <i class="fa-regular fa-envelope"></i> {seletedroomemail}
              </a>
            </p>
            <br />
            <p>
              {instagramUID && <><b>Instagram: </b>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon="fab fa-instagram" />
                  <i class="fab fa-instagram"></i> {instagramUID}
                </a>
                <br /><br /></>}

              <b>Details: </b>
              <p className="h-20 overflow-y-scroll">
                {descriptionOnly ? descriptionOnly : <small><i><font color="grey">(empty)</font></i></small>}
              </p>
            </p>
          </div>
          <button
            onClick={closeModal2}
            className="mx-auto bg-[#d98548] hover:bg-[#c77235] px-[2rem] py-[0.5rem] text-white font-[700] rounded-[20px] uppercase tracking-wide transition-all shadow-md self-center disabled:hover:cursor-not-allowed"
          >
            Close
          </button>
        </div>
      </div>
    </aside>
  );
}
export default Modal2;
