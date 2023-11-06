import React, { useState } from 'react';
import { Button, Modal, Dropdown } from "antd";

const items = [
    {
      key: '1',
      label: (<p>Ordinary</p>),
    },
    {
      key: '2',
      label: (<p>Corporate</p>),
    },
  
  ];
  const UserSelection = () => (
    <>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottom"
        arrow={{
          pointAtCenter: true,
        }}
      >
        <Button>Ordinary</Button>
      </Dropdown>
    </>
  );
  
  const CreateAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        <button className="w-2/12 h-8 bg-[#4096FF] text-white font-bold border-slate-200" onClick={showModal}>
            Create Account
      </button>
        <Modal title="Create your account" className="w-full h-full flex flex-col items-center justify-center" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="w-full h-full flex flex-col gap-4 justify-center border-slate-200 drop-shadow items-center">
            <input
              className="w-11/12 h-10 px-2"
              type="text"
              placeholder="Username"
            />
            <input
              className="w-11/12 h-10 px-2"
              type="text"
              placeholder="Email"
            />
            <input
              className="w-11/12 h-10 px-2"
              type="text"
              placeholder="Password"
            />
          </div>
          < UserSelection />
          <button className="w-11/12 h-8 bg-[#52C41A] text-white font-bold" style={{ marginTop: "20px" }}>
              Sign Up
            </button>
  
        </Modal>
      </>
    );
  };

  export default CreateAccount;