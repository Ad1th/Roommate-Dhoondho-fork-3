import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Bed from "../../Assets/bed.svg";
import BoldBed from "../../Assets/bold-bed.svg";
import BoldPeople from "../../Assets/bold-people.svg";
import People from "../../Assets/people.svg";
import Footer from "../Footer/Footer";
import Navbar from "../NavBar/Navbar";
import "./NeedRoomComponent.css";
import Alert from "@mui/material/Alert";
import secureLocalStorage from "react-secure-storage";

import blob1 from "../../Assets/listing-page/blob1.svg";
import blob2 from "../../Assets/listing-page/blob2.svg";
import blob3 from "../../Assets/listing-page/blob3.svg";
import blob4 from "../../Assets/listing-page/blob4.svg";
import blob5 from "../../Assets/listing-page/blob5.svg";

import Hotjar from '@hotjar/browser';
const siteId = 3765543;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);
const needRoomPage = '/need';
Hotjar.stateChange(needRoomPage);

export const NeedRoomComponent = () => {
  const profileData = JSON.parse(secureLocalStorage.getItem("profile"));
  const navigate = useNavigate();

  const initialNeedRoomFormState = {
    rank: profileData?.user?.rank,
    // gender: "M",
    bedType: "",
    PreferredBlocks: ["Select Block"],
    contactNumber: profileData?.user?.mobile,
    year: "1",
    description: "",
    remaining: "",
  };
  const initialNeedRoomMateFormState = {
    Insta: "",
    rank: profileData?.user?.rank,
    // gender: "M",
    noOfBeds: "",
    PreferredBlocks: ["Select Block"],
    contactNumber: profileData?.user?.mobile,
    year: "1",
    description: "",
    remaining: "",
  };

  const [needRoom, setNeedRoom] = useState(true);
  const [needRoomForm, setNeedRoomForm] = useState(initialNeedRoomFormState);
  const [needRoomMateForm, setNeedRoomMateForm] = useState(initialNeedRoomMateFormState);
  const [blocks, setBlocks] = useState([]);
  const user = useSelector((state) => state.authReducer.authData);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  Hotjar.identify(profileData?.user?.username, {
    first_name: profileData?.user?.firstname,
    last_name: profileData?.user?.lastname,
    gender: profileData?.user?.gender
  });

  const fetchGenderAndSetBlocks = async () => {
    try {
      // Fetch gender from profileData
      const userGender = profileData?.user?.gender;

      if (userGender === 'F') {
        setBlocks(["Select Block", "A", "B", "C", "D", "E", "F", "G", "H"]);
        setShowPlaceholder(false);
      } else if (userGender === 'M') {
        setBlocks([
          "Select Block",
          "A",
          "B",
          "B ANNEX",
          "C",
          "D",
          "D ANNEX",
          "E",
          "F",
          "G",
          "H",
          "J",
          "K",
          "L",
          "M",
          "M ANNEX",
          "N",
          "P",
          "Q",
          "R",
          "S",
          "T",
        ]);
        setShowPlaceholder(false);
      } else {
        console.log("Failed to fetch gender from profileData:", userGender);
        setShowPlaceholder(true);
      }
    } catch (error) {
      console.error("Error fetching gender:", error);
      setShowPlaceholder(true);
    }
  };

  useEffect(() => {
    if (!profileData) {
      console.error('Error accessing user profileData');
      toast.error('Error L4932H. Please Sign In again.')
      navigate("/");
    }
  }, [profileData, navigate]);

  useEffect(() => {
    fetchGenderAndSetBlocks();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  function needRoomClickHandler(trigger) {
    if (trigger === "room") {
      setNeedRoom(true);
    } else {
      setNeedRoom(false);
    }
  }

  function needRoomFormOnChangeHandler(e, index) {
    let { name, value } = e.target;
    if (name === "prefferedBlocks") {
      setNeedRoomForm((prev) => {
        const updatedBlocks = [...prev.PreferredBlocks];
        updatedBlocks[index] = value;
        return { ...prev, PreferredBlocks: updatedBlocks };
      });
    }

    //manage gender  state
    let gender = e.target.getAttribute("data-gender");
    if (gender) {
      let change = {};
      change["gender"] = gender;
      setNeedRoomForm((prev) => {
        return { ...prev, ...change };
      });
    }

    let change = {};
    change[name] = value;
    setNeedRoomForm((prev) => {
      return { ...prev, ...change };
    });
  }

  function needRoomMateFormOnChangeHandler(e, index) {
    let { name, value } = e.target;
    //manage preferred blocks state
    if (name === "prefferedBlocks") {
      setNeedRoomMateForm((prev) => {
        const updatedBlocks = [...prev.PreferredBlocks];
        updatedBlocks[index] = value;
        return { ...prev, PreferredBlocks: updatedBlocks };
      });
    }

    // let gender = e.target.getAttribute("data-gender");
    // if (gender) {
    //   let change = {};
    //   change["gender"] = gender;
    //   setNeedRoomMateForm((prev) => {
    //     return { ...prev, ...change };
    //   });
    // }

    let change = {};
    change[name] = value;
    setNeedRoomMateForm((prev) => {
      return { ...prev, ...change };
    });
  }

  function countCharacters(str) {
    return str.replace(/\s/g, "").length;
  }

  async function needRoomSubmitHandler() {
    if (!validateNeedRoomForm()) {
      return;
    }

    try {
      let userId = profileData?.user?._id;
      console.log(userId);
      const requestData = {
        userId: userId,
      };
      // Make an API request to get the user's room postings
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/room/my/${userId}`,
        requestData
      );

      // Check the number of existing room postings
      const numberOfRoomPosts = response.data.length;

      // If the user has 7 or more room postings, prevent form submission
      if (numberOfRoomPosts >= 7) {
        toast.error(
          "You cannot create more than 7 room postings. Try deleting one of your existing room postings."
        );
        return;
      }

      if (countCharacters(needRoomForm.description) > 1000) {
        toast.error("Description should not exceed 1000 characters.");
        return;
      }

      let requestBody = {
        userId: userId,
        username: profileData.user.username,
        rank: needRoomForm?.rank,
        gender: profileData.user.gender,
        preferredBed: needRoomForm?.bedType,
        preferredBlock: needRoomForm?.PreferredBlocks[0],
        phone: profileData.user.mobile,
        year: needRoomForm?.year,
        desc: needRoomForm?.description,
        remaining: needRoomForm?.remaining
      };

      let result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/room/${userId}`,
        requestBody
      );

      // console.log("API Response:", result.data);
      toast.success("Room created successfully!");
      navigate("/home");
    } catch (error) {
      toast.error("Error creating room.");
      // console.error("API Error:", error);
    }
  }

  async function needRoomMateSubmitHandler() {
    if (!validateNeedRoomMateForm()) {
      return;
    }
    let userId = profileData?.user?._id;

    let requestBody = {
      userId: userId,
      username: profileData.user.username,
      rank: needRoomMateForm?.rank,
      gender: profileData.user.gender,
      preferredBed: needRoomMateForm?.noOfBeds,
      preferredBlock: needRoomMateForm?.PreferredBlocks[0],
      phone: profileData.user.mobile,
      year: needRoomMateForm?.year,
      desc: `${needRoomMateForm?.Insta ? 'Insta: ' + needRoomMateForm?.Insta + ' | ' + '\n' : ''}${needRoomMateForm?.description}`,
      remaining: needRoomMateForm?.remaining,
      // instagram: needRoomMateForm?.Insta
    };

    try {
      const requestData = {
        userId: userId,
      };
      // Make an API request to get the user's roommate postings
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/roommate/my/${userId}`,
        requestData
      );

      // Check the number of existing roommate postings
      const numberOfRoommatePosts = response.data.length;

      // If the user has 7 or more roommate postings, prevent form submission
      if (numberOfRoommatePosts >= 7) {
        toast.error(
          "You cannot create more than 7 roommate postings. Try deleting one of your existing roommate postings."
        );
        return;
      }

      if (countCharacters(needRoomMateForm.description) > 1000) {
        toast.error("Description should not exceed 1000 characters.");
        return;
      }

      // Proceed with form submission if the user has less than 7 roommate postings
      let result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/roommate/${userId}`,
        requestBody
      );

      // console.log("API Response:", result.data);
      toast.success("Roommate created successfully!");
      navigate("/home");
    } catch (error) {
      toast.error("Error creating roommate.");
      // console.error("API Error:", error);
    }
  }

  function validateNeedRoomForm() {
    const numericRegex = /^[0-9]+$/;
    const indianNumberRegex = /^[6789]\d{9}$/;
    if (!needRoomForm["rank"]) {
      toast.error("Plase enter your rank");
      return false;
    } else if (
      !needRoomForm["bedType"] ||
      !["1", "2", "3", "4", "6", "8"].includes(needRoomForm["bedType"])
    ) {
      toast.error("Please enter valid bed type (1, 2, 3, 4, 6, 8)");
      return false;
    }
    // else if (
    //   !needRoomForm["contactNumber"] ||
    //   !indianNumberRegex.test(needRoomForm["contactNumber"]) ||
    //   needRoomForm["contactNumber"].length !== 10
    // ) {
    //   toast.error("Please enter a valid 10-digit Contact number");
    //   return false;
    // } 
    else if (!needRoomForm["year"]) {
      toast.error("Please enter your year");
      return false;
    } else if (
      !needRoomForm["year"] ||
      !["1", "2", "3", "4"].includes(needRoomForm["year"])
    ) {
      toast.error("Please enter a valid year (1, 2, 3, or 4)");
      return false;
    }

    if (needRoomForm["rank"]) {
      let isRankValid = numericRegex.test(needRoomForm["rank"]);
      if (!isRankValid) {
        toast.error("Please enter a valid rank");
        return false;
      }
      let isRankAbove5 = needRoomForm["rank"].length > 5 ? true : false;
      if (isRankAbove5) {
        toast.error("Please enter a valid rank");
        return false;
      }
    } else if (needRoomForm["bedType"]) {
      let isBedTypeValid = numericRegex.test(needRoomForm["bedType"]);
      if (!isBedTypeValid) {
        toast.error("Please enter a valid bed type");
        return false;
      }
    }
    // else if (needRoomForm["contactNumber"]) {
    //   let isContactNumberValid = indianNumberRegex.test(
    //     needRoomForm["contactNumber"]
    //   );
    //   if (!isContactNumberValid) {
    //     toast.error("Please enter a valid Contact number");
    //     return false;
    //   }
    else if (!needRoomForm["PreferredBlocks"] || needRoomForm["PreferredBlocks"][0] === "Select Block") {
      toast.error("Please select a preferred block first");
      return false;
    }
    else if (needRoomForm["PreferredBlocks"]) {
      let isValid = areValuesUnique(needRoomForm["PreferredBlocks"]);
      if (!isValid) {
        toast.error("Blocks must be unique");
        return false;
      }
    }
    return true;
  }

  function validateNeedRoomMateForm() {
    const numericRegex = /^[0-9]+$/;
    const indianNumberRegex = /^[6789]\d{9}$/;

    if (!needRoomMateForm["rank"]) {
      toast.error("Please enter your rank");
      return false;
    } else if (
      !needRoomMateForm["noOfBeds"] ||
      !["1", "2", "3", "4", "6", "8"].includes(needRoomMateForm["noOfBeds"])
    ) {
      toast.error("Please enter a valid number of beds (1, 2, 3, 4, 6, 8)");
      return false;
    }
    // else if (
    //   !needRoomMateForm["contactNumber"] ||
    //   !indianNumberRegex.test(needRoomMateForm["contactNumber"]) ||
    //   needRoomMateForm["contactNumber"].length !== 10
    // ) {
    //   toast.error("Please enter a valid 10-digit Contact number");
    //   return false;
    // } 
    else if (
      !needRoomMateForm["year"] ||
      !["1", "2", "3", "4"].includes(needRoomMateForm["year"])
    ) {
      toast.error("Please enter a valid year (1, 2, 3, or 4)");
      return false;
    }

    if (needRoomMateForm["rank"]) {
      let isRankValid = numericRegex.test(needRoomMateForm["rank"]);
      if (!isRankValid) {
        toast.error("Please enter a valid rank");
        return false;
      }

      let isRankAbove5 = needRoomMateForm["rank"].length > 5 ? true : false;
      if (isRankAbove5) {
        toast.error("Please enter a valid rank");
        return false;
      }
    } else if (needRoomMateForm["noOfBeds"]) {
      let isNoOfBedsValid = numericRegex.test(needRoomMateForm["noOfBeds"]);
      if (!isNoOfBedsValid) {
        toast.error("Please enter a valid number of beds (1, 2, 3, 4, 6, 8)");
        return false;
      }
    }
    // else if (needRoomMateForm["contactNumber"]) {
    //   let isContactNumberValid = indianNumberRegex.test(
    //     needRoomMateForm["contactNumber"]
    //   );
    //   if (!isContactNumberValid) {
    //     toast.error("Please enter a valid Contact number");
    //     return false;
    //   }
    else if (!needRoomMateForm["PreferredBlocks"] || needRoomMateForm["PreferredBlocks"][0] === "Select Block") {
      toast.error("Please select a preferred block first");
      return false;
    }
    else if (needRoomMateForm["PreferredBlocks"]) {
      let isValid = areValuesUnique(needRoomMateForm["PreferredBlocks"]);
      if (!isValid) {
        toast.error("Blocks must be unique");
        return false;
      }
    }
    return true;
  }

  function areValuesUnique(arr) {
    const uniqueSet = new Set();
    for (const value of arr) {
      if (uniqueSet.has(value)) {
        return false;
      }
      uniqueSet.add(value);
    }
    return true;
  }

  const handleGoToProfile = () => {
    navigate("/profile");
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
      <div className="m-auto w-[90vw] relative z-10">
        {/* navbar */}
        <div className="flex pt-4 pb-2 px-2 border-b-2 border-[#7E8490]">
          <div
            className="flex flex-col items-center cursor-pointer"
            data-name="room"
            onClick={() => needRoomClickHandler("room")}
          >
            <img
              alt="bedlogo"
              className="h-[35px]"
              src={needRoom ? BoldBed : Bed}
            />
            <span
              className={`${needRoom ? "border-b-2 border-b-[#000] font-[600]" : ""
                } pb-1`}
            >
              Need Room
            </span>
          </div>
          <div
            className="flex flex-col items-center ml-6 cursor-pointer"
            onClick={needRoomClickHandler}
          >
            <img
              alt="roomlogo"
              className="h-[35px]"
              src={!needRoom ? BoldPeople : People}
            />
            <span
              className={`${!needRoom ? "border-b-2 border-b-[#000] font-[600]" : ""
                } pb-1`}
            >
              Need Roommates
            </span>
          </div>
        </div>
        {/* form */}
        {showPlaceholder ? (
          <div align="center">
            <Alert severity="warning">
              Please complete your profile before using this application.
            </Alert>
            <br />
            <p>
              If you face any problem, please report to us at
              <br />
              support@mozillavit.in
              <br /><br />
              <button
                onClick={handleGoToProfile}
                className="bg-[#140922] px-4 py-2 text-white rounded-md"
              >
                Profile
              </button>
              {/* <button
                onClick={handleRefresh}
                className="bg-[#140922] px-4 py-2 text-white rounded-md"
              >
                Refresh
              </button> */}
              <br /><br />
            </p>
          </div>
        ) : needRoom ? (
          <div className="w-[100%]">
            <h1 className="mb-6 mt-5 text-[24px] font-[800] text-[#06105A] uppercase tracking-wide">Looking for Room</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap:4  md:gap:4 lg:gap-8">
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="flex flex-col mb-6 md:mr-4">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Your Rank *</span>
                  <input
                    name="rank"
                    value={needRoomForm["rank"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                <div className="flex flex-col mb-6 md:mr-4">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Preferred Bed Type*</span>
                  <input
                    name="bedType"
                    value={needRoomForm["bedType"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                {/* <div className="flex flex-col mb-6 md:mr-4">
                  <span>Contact Number*</span>
                  <input
                    name="contactNumber"
                    value={needRoomForm["contactNumber"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div> */}
                <div className="flex md:hidden flex-col mb-6 ">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Year*</span>
                  <input
                    name="year"
                    value={needRoomForm["year"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="containerr max-h-[80px]">
                  <div className="label">Preferred Block*</div>
                  <div className="flex gap-6">
                    <div className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] rounded-[10px] flex items-center shadow-sm">
                      <select
                        name="prefferedBlocks"
                        value={needRoomForm["PreferredBlocks"][0]}
                        onChange={(e) => needRoomFormOnChangeHandler(e, 0)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer"
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#ffffff] border-[1.5px] border-[#c5c8d0] rounded-[10px] flex items-center shadow-sm">
                      <select
                        name="prefferedBlocks"
                        value={needRoomForm["PreferredBlocks"][1]}
                        onChange={(e) => needRoomFormOnChangeHandler(e, 1)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#ffffff] border-[1.5px] border-[#c5c8d0] rounded-[10px] flex items-center shadow-sm">
                      <select
                        name="prefferedBlocks"
                        value={needRoomForm["PreferredBlocks"][2]}
                        onChange={(e) => needRoomFormOnChangeHandler(e, 2)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col mb-6 ">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Year*</span>
                  <input
                    name="year"
                    value={needRoomForm["year"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                {/* <div className="flex flex-col mb-6 md:mr-4">
                  <span>Vacancy</span>
                  <input
                    name="remaining"
                    value={needRoomForm["remaining"]}
                    onChange={needRoomFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div> */}
              </div>
            </div>
            <div className="containerr w-[100%] mb-6 mt-6 md:mt-2">
              <div className="label">Description</div>
              <textarea
                rows="3"
                className="w-[100%] bg-transparent focus:border-none outline-none resize-none text-[#333] font-[500] placeholder-[#a0a3ab]"
                name="description"
                placeholder="Tell us a bit about yourself..."
                value={needRoomForm["description"]}
                onChange={needRoomFormOnChangeHandler}
              ></textarea>
            </div>
            <div className="w-[100%] flex justify-center mb-6 mt-6">
              <button
                onClick={needRoomSubmitHandler}
                className="mx-auto bg-[#d98548] hover:bg-[#c77235] px-[2.5rem] py-[0.75rem] text-white font-[700] rounded-[12px] uppercase tracking-wide transition-all shadow-md self-start disabled:hover:cursor-not-allowed"
              >
                {" "}
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[100%]">
            <h1 className="mb-6 mt-5 text-[24px] font-[800] text-[#06105A] uppercase tracking-wide">Have Room & Looking for Roommate</h1>
            <div className="grid grid-cols-1 md:grid-cols-2  md:gap:4 lg:gap-8">
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="flex flex-col mb-6">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Your Rank *</span>
                  <input
                    name="rank"
                    value={needRoomMateForm["rank"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">No of Beds*</span>
                  <input
                    name="noOfBeds"
                    value={needRoomMateForm["noOfBeds"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Instagram Account (optional)</span>
                  <input
                    name="Insta"
                    value={needRoomMateForm["Insta"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                {/* <div className="flex flex-col mb-6">
                  <span>Contact Number*</span>
                  <input
                    name="contactNumber"
                    value={needRoomMateForm["contactNumber"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div> */}
                <div className="flex md:hidden flex-col mb-6 ">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Year*</span>
                  <input
                    name="year"
                    value={needRoomMateForm["year"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div
                style={{ gridAutoRows: "120px" }}
                className="grid grid-cols-1 items-center"
              >
                <div className="containerr max-h-[80px]">
                  <div className="label">Preferred Block*</div>
                  <div className="flex gap-6">
                    <div className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] rounded-[10px] flex items-center shadow-sm">
                      <select
                        name="prefferedBlocks"
                        value={needRoomMateForm["PreferredBlocks"][0]}
                        onChange={(e) => needRoomMateFormOnChangeHandler(e, 0)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer"
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#ffffff] border-[1.5px] border-[#c5c8d0] rounded-[10px] flex items-center shadow-sm">
                      <select
                        name="prefferedBlocks"
                        value={needRoomMateForm["PreferredBlocks"][1]}
                        onChange={(e) => needRoomMateFormOnChangeHandler(e, 1)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="hidden bg-[#ffffff] border-[1.5px] border-[#c5c8d0] rounded-[10px] flex items-center shadow-sm">
                      <select
                        name="prefferedBlocks"
                        value={needRoomMateForm["PreferredBlocks"][2]}
                        onChange={(e) => needRoomMateFormOnChangeHandler(e, 2)}
                        className="bg-[transparent] w-[100%] py-3 px-6 outline-none focus:border-none cursor-pointer "
                      >
                        {blocks.map((block) => (
                          <option key={block} value={block}>
                            {block}
                          </option>
                          //   <option>{`${block}-Block`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col mb-6 ">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Year*</span>
                  <input
                    name="year"
                    value={needRoomMateForm["year"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
                <div className="flex flex-col mb-6 md:mr-4">
                  <span className="text-[#666] font-[600] text-[11px] uppercase tracking-wide ml-2">Vacancy*</span>
                  <input
                    name="remaining"
                    value={needRoomMateForm["remaining"]}
                    onChange={needRoomMateFormOnChangeHandler}
                    className="bg-[#ffffff] border-[1.5px] border-[#c5c8d0] text-[#333] font-[600] focus:border-[#d98548] focus:outline-none rounded-[10px] mt-1 h-[3rem] p-4 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
            <div className="containerr w-[100%] mb-6 mt-6 md:mt-2">
              <div className="label">Description</div>
              <textarea
                rows="3"
                className="w-[100%] bg-transparent focus:border-none outline-none resize-none text-[#333] font-[500] placeholder-[#a0a3ab]"
                name="description"
                placeholder="Tell us a bit about yourself and the room..."
                value={needRoomMateForm["description"]}
                onChange={needRoomMateFormOnChangeHandler}
              ></textarea>
            </div>
            <div className="w-[100%] flex justify-center mb-6 mt-6">
              <button
                onClick={needRoomMateSubmitHandler}
                className="mx-auto bg-[#d98548] hover:bg-[#c77235] px-[2.5rem] py-[0.75rem] text-white font-[700] rounded-[12px] uppercase tracking-wide transition-all shadow-md self-start disabled:hover:cursor-not-allowed"
              >
                {" "}
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

// export default NeedRoom;
