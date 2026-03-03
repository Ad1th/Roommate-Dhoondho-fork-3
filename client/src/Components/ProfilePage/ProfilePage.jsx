import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../NavBar/Navbar";
import Footer from "../Footer/Footer";
import DisplayRoommateListingCard from "../DisplayRoommateListingCard/DisplayRoommateListingCard";
import DisplayRoomListingCard from "../DisplayRoomListingCard/DisplayRoomListingCard";
import { logout } from "../../actions/AuthActions";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

import Hotjar from '@hotjar/browser';
import { Helmet } from "react-helmet";
import blob1 from "../../Assets/profile-page/blob1.svg";
import blob2 from "../../Assets/profile-page/blob2.svg";
import blob3 from "../../Assets/profile-page/blob3.svg";
import blob4 from "../../Assets/profile-page/blob4.svg";
import blob5 from "../../Assets/profile-page/blob5.svg";
import boy from "../../Assets/profile-page/profile-boy.png"

const siteId = 3765543;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);
const profilePage = '/profile';
Hotjar.stateChange(profilePage);

const Profilepage = () => {
  const profileData = JSON.parse(secureLocalStorage.getItem("profile"))
  const navigate = useNavigate();
  const [additionalData, setAdditionalData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regnum, setRegNumber] = useState("");
  const [gender, setGender] = useState("");
  const [rank, setRank] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState(null);
  const [changesMade, setChangesMade] = useState(true);
  const [notification, setNotification] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formEvent, setFormEvent] = useState(null);
  const [showInfoLabel, setShowInfoLabel] = useState(false);
  const isGenderEditable = !profileData?.user?.gender || profileData.user.gender === "" || profileData.user.gender === null;
  const [isLoading, setIsLoading] = useState(true);
  const [isListingButtonActive, setIsListingButtonActive] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/server-messages/profile-yourlisting-1`
        );

        if (response.data) {
          setServerMessage(response.data);
          console.log(response);
        }
      } catch (error) {
        // Handle errors if needed
        console.error("Error fetching server message:", error);
      }
    };

    fetchData();
  }, []);

  // Constants for preventing XSS Attacks


  Hotjar.identify(profileData?.username, {
    first_name: profileData?.firstname,
    last_name: profileData?.lastname,
    gender: profileData?.gender
  });

  console.log("HI", profileData, Hotjar);
  console.log("bfew;o", secureLocalStorage.getItem("profile"))

  useEffect(() => {
    if (!profileData) {
      console.error('Error accessing user profileData');
      toast.error('Error L4781C. Please Sign In again.')
      navigate("/");
    }
  }, [profileData, navigate]);

  // const handleChangePassword = (e) => {
  //   setPassword(e.target.value);
  // };

  // const validatePassword = () => {
  //   return !!password;
  // };

  // const dispatch = useDispatch();
  // const handleResetPasswordClick = () => {
  //   secureLocalStorage.removeItem("profile");
  //   dispatch(logout());
  //   navigate('/resetPassword');
  // };

  const handleConfirmationOpen = (e) => {
    e.preventDefault();
    console.log("Opening confirmation dialog");
    setFormEvent(e);
    setOpenConfirmation(true);
  };

  const handleConfirmationClose = (confirmed) => {
    setOpenConfirmation(false);

    console.log("hi");
    console.log("g1: ", gender);
    if (confirmed && formEvent && gender) {
      console.log("Submitting form with gender:", gender);
      submituserRegistrationForm(formEvent, gender);
      secureLocalStorage.setItem("isProfileComplete", true);
    }
  };

  const handleListingButtonClick = () => {
    navigate('/need');
  };

  console.log("user specific data: ", profileData);
  console.log("id", profileData?.id || profileData?.user?._id)

  useEffect(() => {
    console.log("token:", secureLocalStorage.getItem("token"))
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/user/personal/${profileData?.id}`,
        {
          headers: {
            "x_authorization": `Bearer ${JSON.parse(secureLocalStorage.getItem("auth_token"))}`
          }
        }
      )
      .then((response) => {
        const data = response.data;
        console.log("Fetched user data:", data);
        setAdditionalData(data);
        setFirstName(data.firstname);
        setLastName(data.lastname);
        setRegNumber(data.regnum);
        setGender(data.gender);
        setRank(data.rank);
        setContactNumber(data.mobile);
        setEmail(data.username);

        setFields({
          firstname: data.firstname,
          lastname: data.lastname,
          regnum: data.regnum,
          gender: data.gender,
          emailid: data.username,
          mobileno: data.mobile,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching additional data:", error);
        setIsLoading(false);
      });
  }, []);

  const [fields, setFields] = useState({});

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setFields({
      ...fields,
      [name]: value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let formIsValid = true;

    if (!fields["firstname"]) {
      formIsValid = false;
      newErrors["firstname"] = "*Please enter your firstname.";
    }

    if (typeof fields["firstname"] !== "undefined") {
      if (!fields["firstname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        newErrors["firstname"] = "*Please enter alphabet characters only.";
      }
    }
    if (!fields["lastname"]) {
      formIsValid = false;
      newErrors["lastname"] = "*Please enter your lastname.";
    }

    if (typeof fields["lastname"] !== "undefined") {
      if (!fields["lastname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        newErrors["lastname"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["regnum"]) {
      formIsValid = false;
      newErrors["regnum"] = "*Please enter your registration number.";
    }

    if (typeof fields["regnum"] !== "undefined") {
      const pattern2 = /^[0-9]{2}[A-Za-z]{3}[0-9]{4}$/;

      if (!pattern2.test(fields["regnum"])) {
        formIsValid = false;
        newErrors["regnum"] = "*Please enter a valid registration number.";
      }
    }

    // if (!fields["emailid"]) {
    //   formIsValid = false;
    //   newErrors["emailid"] = "*Please enter your email-ID.";
    // }

    // if (typeof fields["emailid"] !== "undefined") {
    //   const emailPattern =
    //     /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

    //   if (!emailPattern.test(fields["emailid"])) {
    //     formIsValid = false;
    //     newErrors["emailid"] = "*Please enter valid email-ID.";
    //   }
    // }

    if (!fields["mobileno"]) {
      formIsValid = false;
      newErrors["mobileno"] = "*Please enter your contact no.";
    }

    if (typeof fields["mobileno"] !== "undefined") {
      const mobilePattern = /^[0-9]{10}$/;

      if (!mobilePattern.test(fields["mobileno"])) {
        formIsValid = false;
        newErrors["mobileno"] = "*Please enter valid contact no.";
      }
    }
    if (!fields["gender"]) {
      formIsValid = false;
      newErrors["gender"] = "*Please select your gender.";
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const submituserRegistrationForm = (e, gender) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedData = {
        currentUserId: profileData?.id || profileData?.user?._id,
        firstname: firstName || profileData?.user?.firstname,
        lastname: lastName,
        regnum: regnum,
        gender: gender,
        rank: rank,
        mobile: contactNumber,
        isProfileComplete: true,
      };

      console.log("Updating profile with data:", updatedData);

      axios
        .put(
          `${process.env.REACT_APP_SERVER_URL}/user/${profileData?.id || profileData?.user?._id}`,
          updatedData,
          {
            headers: {
              "x_authorization": `Bearer ${JSON.parse(secureLocalStorage.getItem("auth_token"))}`
            }
          }
        )
        .then((response) => {
          console.log("Profile update response:", response.data);
          setChangesMade(true);
          toast.success("Changes saved successfully!");
          secureLocalStorage.setItem("profile", JSON.stringify(response.data));
          navigate('/home');
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          toast.error("Error saving changes. Please try again.");
        });
    }
  };

  return (
    <>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div className="listing-background">
          <img src={blob1} alt="" className="blob b1" />
          <img src={blob2} alt="" className="blob b2" />
          <img src={blob3} alt="" className="blob b3" />
          <img src={blob4} alt="" className="blob b4" />
          <img src={blob5} alt="" className="blob b5" />
        </div>
        <div>
          <Navbar />
        </div>
        {isLoading ? (
          <div className="loading-indicator-container">
            <CircularProgress disableShrink color="primary" size={40} />
          </div>
        ) : (
          <>
            <div className="profile relative z-10">
              <div className="profiletab-main">
                <div className="profile-buttons">
                  <button className="activeprofile">
                    <p className="profile-text">Profile</p>
                  </button>
                </div>
                <div className="profiletab-hr">
                  <hr />
                </div>
              </div>
              <div className="profile-split-container">
                <div className="profile-left-box">
                  <div className="avatar-wrapper">
                    <img src={boy} alt="Avatar" />
                  </div>
                  <h2 className="hello-text">Hello There!</h2>
                </div>

                <div className="profile-right-box">
                  <h3 className="box-heading">Other Details</h3>
                  <form
                    method="post"
                    name="userRegistrationForm"
                    className="profile-form-grid"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (validateForm()) {
                        if (!profileData?.gender) {
                          handleConfirmationOpen(e);
                        } else {
                          submituserRegistrationForm(e);
                        }
                      }
                    }}
                  >
                    {showInfoLabel && (
                      <Alert severity="info" onClose={() => setShowInfoLabel(false)} style={{ gridColumn: '1 / -1' }}>
                        You can set your gender only ONCE. Once set, it can't be changed.
                        Email id cannot be changed.
                      </Alert>
                    )}

                    <div className="form-group">
                      <label>First Name*</label>
                      <input
                        type="text"
                        name="firstname"
                        value={firstName === "" && profileData?.user?.firstname ? profileData.user.firstname : firstName}
                        onChange={(e) => {
                          handleChange(e);
                          setFirstName(e.target.value);
                          setChangesMade(true);
                        }}
                      />
                      <div className="errorMsg">{errors.firstname}</div>
                    </div>

                    <div className="form-group">
                      <label>Last Name*</label>
                      <input
                        type="text"
                        name="lastname"
                        value={lastName === "" && profileData?.user?.lastname ? profileData.user.lastname : lastName}
                        onChange={(e) => {
                          handleChange(e);
                          setLastName(e.target.value);
                          setChangesMade(true);
                        }}
                      />
                      <div className="errorMsg">{errors.lastname}</div>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Gender*</label>
                      <div className="gender-toggle">
                        <div
                          name="gender"
                          className={`gender-btn ${(fields.gender === "M" || profileData?.user?.gender === "M") ? "selected" : ""}`}
                          onClick={(e) => {
                            if (isGenderEditable) {
                              handleChange({ target: { name: "gender", value: "M" } });
                              setGender("M");
                              setChangesMade(true);
                            }
                          }}
                        >
                          M
                        </div>
                        <div
                          name="gender"
                          className={`gender-btn ${(fields.gender === "F" || profileData?.user?.gender === "F") ? "selected" : ""}`}
                          onClick={(e) => {
                            if (isGenderEditable) {
                              handleChange({ target: { name: "gender", value: "F" } });
                              setGender("F");
                              setChangesMade(true);
                            }
                          }}
                        >
                          F
                        </div>
                      </div>
                      <div className="errorMsg">{errors.gender}</div>
                    </div>

                    <div className="form-group">
                      <label>Registration Number*</label>
                      <input
                        type="text"
                        name="regnum"
                        value={regnum}
                        onChange={(e) => {
                          handleChange(e);
                          setRegNumber(e.target.value);
                          setChangesMade(true);
                        }}
                      />
                      <div className="errorMsg">{errors.regnum}</div>
                    </div>

                    <div className="form-group">
                      <label>Contact Number*</label>
                      <input
                        type="text"
                        name="mobileno"
                        value={contactNumber}
                        onChange={(e) => {
                          handleChange(e);
                          setContactNumber(e.target.value);
                          setChangesMade(true);
                        }}
                      />
                      <div className="errorMsg">{errors.mobileno}</div>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Email ID*</label>
                      <input
                        type="text"
                        name="emailid"
                        value={email || ''}
                        onChange={(e) => { setChangesMade(true); }}
                        readOnly
                      />
                    </div>

                    {changesMade && (
                      <div className="form-submit-container" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button className="submit-btn" style={{ backgroundColor: "#d98548", color: "#fff", padding: "10px 40px", borderRadius: "10px", fontWeight: "bold" }}>
                          FINISH
                        </button>
                      </div>
                    )}
                    {notification && (
                      <div style={{ gridColumn: '1 / -1' }} className={notification.startsWith("Error") ? "error-notification" : "success-notification"}>
                        {notification}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
            <div className="listing">
              <div className="listing-buttons">
                <button className="activelisting">
                  <p className="listing-text">Your Listing</p>
                  {/* <div className="add-button">
                  <button
                    className={`add-button-inner ${isListingButtonActive ? 'active' : ''}`}
                    onClick={handleListingButtonClick}
                    onMouseDown={() => setIsListingButtonActive(true)}
                    onMouseUp={() => setIsListingButtonActive(false)}
                    onMouseLeave={() => setIsListingButtonActive(false)}
                  >
                    +
                  </button>
                </div> */}
                </button>
              </div>
              <div className="tab-content">
                <div className="cards">
                  <DisplayRoommateListingCard />
                  <DisplayRoomListingCard />
                </div>
              </div>
              {serverMessage && (
                <Alert severity={serverMessage.severity || "info"}>
                  <strong>{serverMessage.title}</strong>
                  <br />
                  {serverMessage.desc}
                </Alert>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <Footer />
      </div>
      <Dialog
        open={openConfirmation}
        onClose={() => handleConfirmationClose(false)}
      >
        <DialogTitle>WARNING</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set your gender only ONCE. Once set, it can't be changed. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationClose(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleConfirmationClose(true)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profilepage;