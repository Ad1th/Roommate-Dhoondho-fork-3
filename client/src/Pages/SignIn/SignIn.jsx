import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";
import Header from "../../Components/Header/Header";

import blob1 from "../../Assets/login-page/blob1.svg";
import blob2 from "../../Assets/login-page/blob2.svg";
import blob3 from "../../Assets/login-page/blob3.svg";
import blob4 from "../../Assets/login-page/blob4.svg";
import blob11 from "../../Assets/login-page/blob11.svg";
import signinImage from "../../Assets/login-page/signin-image.png";
import logo from "../../Assets/logo.png";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        secureLocalStorage.setItem("auth_token", JSON.stringify(token));
        secureLocalStorage.setItem("profile", JSON.stringify(decodedUser));

        toast.success("Login successful!");
        navigate("/profile", { replace: true });
      } catch (error) {
        toast.error("Invalid token. Please log in again.");
        navigate("/signin", { replace: true });
      }
    }
  }, [location, navigate]);

  function handleGoogleLogin() {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  }

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      <Header />

      {/* LOGO */}
      {/* <img
        src={logo}
        alt="Logo"
        className="absolute top-0 left-0 w-[150px] z-20"
      /> */}

      {/* RIGHT RECTANGLE BACKGROUND */}
      <div className="absolute top-0 right-0 h-full w-1/2 hidden lg:block z-0" />

      {/* BLOBS */}
      <img
        src={blob2}
        alt=""
        className="absolute top-0 right-0 h-full opacity-40 z-0"
      />

      <img
        src={blob1}
        alt=""
        className="absolute bottom-0 right-[18%] w-[260px] opacity-50 z-0"
      />

      <img
        src={blob3}
        alt=""
        className="absolute left-[40%] top-[20%] w-[250px] opacity-40 z-0"
      />

      <img
        src={blob4}
        alt=""
        className="absolute bottom-0 left-0 w-[240px] opacity-40 z-0"
      />

      <img
        src={blob11}
        alt=""
        className="absolute top-0 right-[200px] w-[260px] opacity-50 z-0"
      />

      {/* MAIN GRID */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT SECTION */}
        <div className="flex flex-col items-start justify-start pt-28 pl-12 md:pl-20 pr-8">
          <div className="hidden lg:block absolute top-[62px] left-[120px] w-[595px] h-[610px] rounded-[27px] overflow-hidden">
            <img
              src={signinImage}
              alt="Sign In"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-center items-center px-6 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen">
          <div className="w-full max-w-[420px] flex flex-col items-center text-center mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
              Welcome back!
            </h1>

            <p className="text-gray-600 mb-8">
              Sign in using your VIT credentials
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-[#8DB255] hover:bg-[#7da64a] text-white font-semibold py-3 rounded-lg transition"
            >
              Sign in with Google
            </button>

            {/* <div className="flex items-center w-full my-6">
              <div className="flex-1 h-[1px] bg-gray-400" />
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-1 h-[1px] bg-gray-400" />
            </div> */}

            {/* <p className="text-gray-600 text-center w-full">
              Don't have an account?
              <Link
                to="/signup"
                className="ml-2 underline font-medium text-black"
              >
                Sign Up here
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
