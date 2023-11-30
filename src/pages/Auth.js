import React, { useEffect, useState, useRef, useMemo } from "react";
import { Input, Button, Alert, notification } from "antd";
import { createClient } from "@supabase/supabase-js";
import CreateAccount from "../components/CreateAccount";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
// Import the `testSupabaseInsert` function here

const Context = React.createContext({ name: 'Default' });
function Auth() {
  // User logging In :
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // variables for error notification
  const [api, contextHolder] = notification.useNotification();
  const openNotificationRef = useRef();
  const contextValue = useMemo(() => ({ name: 'Yapper' }));

  useEffect(() => {
    openNotificationRef.current = (message) => {
      api.error({
        message: `${message}`,
        placement: 'top'
      });
    };
  }, [api]);

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      openNotificationRef.current('Invalid email or password')
    } else if (data) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
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
  <Context.Provider value={contextValue}>
    {contextHolder}
    <div className="w-full h-full min-h-screen flex items-center bg-[#f5f5f5]">
      {/* Left Container */}
      <div className="w-5/12 flex flex-col items-center justify-center gap-4">
        <p className="text-black font-bold text-6xl">Join Today</p>
        <p className="text-[#8E8181] font-medium text-lg">
          Learn what is going on in the world
        </p>
      </div>

      {/* Right Container */}
      <div className="w-7/12 h-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-6/12 h-fit bg-white flex flex-col py-5 gap-3 items-center rounded-lg">
          <div className="w-11/12 h-full flex flex-col gap-4 justify-center border-slate-200 items-center">
            <Input
              className="w-full h-10 px-2"
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
            />
            <Input.Password
              className="w-full h-10 px-2"
              type="pass"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="flex flex-col gap-3 w-full text-center">
              <Button
                className="w-full h-10 bg-[#52C41A] text-white text-lg font-bold"
                onClick={handleLogin}
              >
                Login
              </Button>
              <a
                href="#"
                onClick={handlePasswordReset}
                className="text-[#776BFF] text-sm font-italic cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>
            <hr className="w-full"  />
            <CreateAccount />
          </div>
        </div>
        <p className="w-6/12 text-center text-[#858585] text-xs mt-2">
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
  </Context.Provider>
  );
}

export default Auth;
