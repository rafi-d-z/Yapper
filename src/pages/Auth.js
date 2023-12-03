import React, { useEffect, useState, useRef, useMemo } from "react";
import { Input, Button, notification, Form } from "antd";
import CreateAccount from "../components/CreateAccount";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
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

  // TODO: Figure this out
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
          <Form className="w-11/12 h-full flex flex-col gap-4 justify-center border-slate-200 items-center" onFinish={handleLogin}>
            <Form.Item className="w-full h-full mb-2" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input
                className="w-full h-10 px-2"
                type="text"
                placeholder="Email Address"
                value={email}
                prefix={<MailOutlined className="mr-2 text-lg text-[#7C7C7C]" />}
                onChange={handleEmailChange}
              />
            </Form.Item>
            <Form.Item className="w-full h-full mb-2" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                className="w-full h-10 px-2"
                type="pass"
                placeholder="Password"
                value={password}
                prefix={<LockOutlined className="mr-2 text-lg text-[#7C7C7C]" />}
                onChange={handlePasswordChange}
              />
            </Form.Item>
            <Form.Item className="w-full h-full mb-0">
              <div className="flex flex-col gap-3 w-full text-center">
                <Button
                  type="primary"
                  className="w-full h-10 bg-[#52C41A] hover:bg-[#389e0d] text-white text-lg font-bold"
                  // onClick={handleLogin}
                  htmlType="submit"
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
            </Form.Item>
            </Form>
            <div className="w-11/12 h-full flex flex-col gap-4 justify-center">
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
