import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button, Modal, Form, Select, Input, notification } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

const Context = React.createContext({ name: "Default" });
const CreateAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("ordinary"); // handle ordinary user choice
  // account credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  var userID = "";
  // routing navigate function
  const navigate = useNavigate();

  async function insertUserType() {
    try {
      const { data, error } = await supabase
        .from("user")
        .insert([{ id: userID, user_name: username, user_type: filter }]);

      if (error) {
        openNotificationRef.current(error.message);
      } else {
        console.log("Supabase insert successful:", data);
      }
    } catch (error) {
      openNotificationRef.current(error.message);
    }
  }
  async function signIn() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        openNotificationRef.current(error.message);
      } else {
        navigate("/");
      }
    } catch (error) {
      openNotificationRef.current(error.message);
    }
  }

  // variables for error notification
  const [api, contextHolder] = notification.useNotification();
  const openNotificationRef = useRef();
  const contextValue = useMemo(() => ({ name: "Yapper" }));

  useEffect(() => {
    openNotificationRef.current = (message) => {
      api.error({
        message: `${message}`,
        placement: "top",
      });
    };
  }, [api]);

  // Define functions to handle input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleCreateAccount = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      openNotificationRef.current(error.message);
    } else if (data) {
      // weird trick that if identities == 0 then that means account already exists
      // TODO: when user puts password, under 6 characters, it gives error so have to make UI aspect of it
      if (data.user.identities?.length > 0) {
        userID = data.user.id;
        insertUserType();
        // sign in
        signIn();
      } else {
        // this means account already exists
        openNotificationRef.current("Account already exists");
      }
    }

    setEmail("");
    setPassword("");
    setUsername("");
    setFilter("");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="w-full h-full">
        <button
          className="w-full h-10 bg-[#4096FF] text-lg rounded-lg text-white font-bold border-slate-200"
          onClick={showModal}
        >
          Create Account
        </button>
        <Modal
          title="Create your account"
          className="flex flex-col items-center justify-center"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            className="w-full h-full flex mt-10 flex-col gap-4 justify-center border-slate-200 items-center"
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={handleCreateAccount}
          >
            <Form.Item
              className="w-11/12 h-10 mb-2"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                className="w-full h-10 px-2"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                prefix={
                  <UserOutlined className="mr-2 text-lg text-[#7C7C7C]" />
                }
                required
              />
            </Form.Item>
            <Form.Item
              className="w-11/12 h-10 mb-2"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                className="w-full h-10 px-2"
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                prefix={
                  <MailOutlined className="mr-2 text-lg text-[#7C7C7C]" />
                }
                required
              />
            </Form.Item>
            <Form.Item
              className="w-11/12 h-10 mb-2"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value.length >= 6) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Password must be at least 6 characters"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="w-full h-10 px-2"
                type="text"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                prefix={
                  <LockOutlined className="mr-2 text-lg text-[#7C7C7C]" />
                }
              />
            </Form.Item>
            <Form.Item
              name="type"
              rules={[
                { required: true, message: "Please input your type of user!" },
              ]}
              className="w-11/12"
            >
              <Select
                className="flex w-6/12 gap-2"
                onChange={(value) => setFilter(value)}
                placeholder="Select the type of user you are"
              >
                <option value="ordinary">Ordinary</option>
                <option value="corporate">Corporate</option>
              </Select>
            </Form.Item>
            <Form.Item className="w-11/12 h-10">
              <Button
                className="w-full h-10 bg-[#52C41A] text-white font-bold mx-auto"
                htmlType="submit"
                // onClick={handleCreateAccount}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <p className="w-11/12 text-center text-[#858585] text-xs font-normal mx-auto">
            By clicking signing up, you agree to the
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
        </Modal>
      </div>
    </Context.Provider>
  );
};

export default CreateAccount;
