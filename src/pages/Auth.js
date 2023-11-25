import React, { useState } from "react";
import { Input, Card, Button, Modal, Dropdown, Space } from "antd";
import { createClient } from "@supabase/supabase-js";
import CreateAccount from "../components/CreateAccount";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
// Import the `testSupabaseInsert` function here

function Auth() {
  // User logging In :
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // routing navigate function
  const navigate = useNavigate();

  // Define functions to handle input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Define a function to handle the login button click
  const handleLogin = async () => {
    console.log("Email: ", email);
    console.log("Password: ", password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      navigate("/");
    }
    setEmail("");
    setPassword("");
  };

  const handlePasswordReset = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
  };

  return (
    <div className="w-full h-full flex">
      {/* Left Container */}
      <div className="w-7/12 flex flex-col items-center justify-center">
        <p className="text-black font-bold text-xl">Join Today</p>
        <p className="text-[#8E8181] font-bold text-md">
          Learn what is going on in the world
        </p>
      </div>

      {/* Right Container */}
      <div className="w-11/12 h-full flex flex-col items-center justify-center">
        <div className="w-5/12 h-52 border border-slate-200 drop-shadow mt-7">
          <div className="w-11/12 h-full flex flex-col gap-4 justify-center border-slate-200 drop-shadow items-center">
            <input
              className="w-full h-10 px-2"
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              className="w-full h-10 px-2"
              type="text"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              className="w-full h-8 bg-[#52C41A] text-white font-bold"
              onClick={handleLogin}
            >
              Login
            </button>
            <a
              href="#"
              onClick={handlePasswordReset}
              className="text-[#776BFF] font-italic cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>
        </div>
        <p className="text-black font-bold">or</p>
        <CreateAccount />
        <p className="text-[#858585] font-normal">
          By signing up, you agree to the
          <a href="https://twitter.com/en/tos" className="underline">
            {" "}
            Terms of Service
          </a>{" "}
          and
          <a href="https://twitter.com/en/privacy" className="underline">
            {" "}
            Privacy Policy
          </a>
          , including
          <a
            href="https://help.twitter.com/en/rules-and-policies/x-cookies"
            className="underline"
          >
            {" "}
            Cookie Use.
          </a>
        </p>
      </div>
    </div>
  );
}

export default Auth;
