import React, { useState } from "react";
import { Button, Modal, Select, Input } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

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
  async function signIn(){
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error){
        console.error(error)
      } else {
        navigate("/");
      }
    } catch (error){
      console.log(error);
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
      // weird trick that if identities == 0 then that means account already exists
      // TODO: when user puts password, under 6 characters, it gives error so have to make UI aspect of it
      console.log(data)
      if(data.user.identities?.length > 0){
        userID = data.user.id;
        insertUserType();
        // sign in
        signIn();
      } else {
        // this means account already exists
        console.log('account already exists')
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
    <div className="w-full h-full">
      <button
        className="w-full h-10 bg-[#4096FF] rounded-lg text-white font-bold border-slate-200"
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
        <div className="w-full h-full flex flex-col gap-4 justify-center border-slate-200 items-center">
          <Input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <Input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <Input.Password
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <div className="w-11/12">
            <Select
              className="flex w-6/12 gap-2"
              defaultValue="ordinary"
              onChange={(value) => setFilter(value)}
            >
              <option value="ordinary">Ordinary</option>
              <option value="corporate">Corporate</option>
            </Select>
          </div>
          <Button
            className="w-11/12 h-10 bg-[#52C41A] text-white font-bold mx-auto"
            onClick={handleCreateAccount}
          >
            Sign Up
          </Button>
        </div>
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
  );
};

export default CreateAccount;
