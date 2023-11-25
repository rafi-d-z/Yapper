import React, { useState } from "react";
import { Button, Modal, Select } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from 'react-router-dom';

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
        console.error("Supabase insert error:", error);
      } else {
        console.log("Supabase insert successful:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

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
      console.log(error);
    }
    if (data) {
      console.log(data);
      userID = data.user.id;
      insertUserType();
      navigate('/')
    }

    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("UserName: ", username);
    console.log(filter);
    console.log("User ID: ", userID);

    setEmail("");
    setPassword("");
    setUsername("");
    setFilter("");
  };

  const UserSelection = () => (
    <>
      <Select
        className="flex w-8/12 gap-2"
        defaultValue="ordinary"
        onChange={(value) => setFilter(value)}
      >
        <option value="ordinary">Ordinary</option>
        <option value="corporate">Corporate</option>
      </Select>
    </>
  );

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
    <>
      <button
        className="w-2/12 h-8 bg-[#4096FF] text-white font-bold border-slate-200"
        onClick={showModal}
      >
        Create Account
      </button>
      <Modal
        title="Create your account"
        className="w-full h-full flex flex-col items-center justify-center"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="w-full h-full flex flex-col gap-4 justify-center border-slate-200 drop-shadow items-center">
          <input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <UserSelection />
        <button
          className="w-11/12 h-8 bg-[#52C41A] text-white font-bold"
          style={{ marginTop: "20px" }}
          onClick={handleCreateAccount}
        >
          Sign Up
        </button>
        <p className="text-[#858585] font-normal">
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
    </>
  );
};

export default CreateAccount;
