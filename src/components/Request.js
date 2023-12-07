import { useEffect, useState } from "react";
import { supabase, supabaseAdmin } from "../utils/supabaseClient";
import { Button, Modal, Form, Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Request(props) {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [requestID, setRequestID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const navigate = useNavigate();

  const userAccepted = async () => {
    emailAccept().then(() => {
      deleteRequest(requestID).then(() => {
        // Perform actions after deletion is successful
        console.log("here");
        navigate("/loading");
        setTimeout(() => {
          navigate("/accountRequests");
        }, 500);
      });
    });
  };

  const userDeclined = async () => {
    deleteUser().then(() =>
      emailDecline().then(() => {
        deleteRequest(requestID).then(() => {
          // Perform actions after deletion is successful
          console.log("here");
          navigate("/loading");
          setTimeout(() => {
            navigate("/accountRequests");
          }, 500);
        });
      })
    );
  };

  const emailAccept = async () => {
    console.log(userEmail);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        userEmail,
        {
          redirectTo: "http://localhost:3000/auth",
        }
      );
      if (error) {
        throw error;
      } else if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const emailDecline = async () => {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        userEmail,
        {
          data: { reasoning: reasoning },
        }
      );
    } catch (error) {
      console.log("emailDecline");
      console.log(error);
    }
  };

  const deleteRequest = async () => {
    try {
      const { error } = await supabase
        .from("requests")
        .delete()
        .eq("id", requestID);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async () => {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        user.id
      );
      if (error) {
        throw error;
      } else if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (user_id) => {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(
        user_id
      );
      if (error) {
        throw error;
      } else if (data) {
        console.log(data);
        setUserEmail(data.user.email);
        const resp = await supabase.from("user").select().eq("id", user_id);
        if (resp.error) {
          throw error;
        } else if (resp.data) {
          setUser(resp.data[0]);
        }
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    console.log('reached')
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReasoningChange = (e) => {
    setReasoning(e.target.value);
  };

  useEffect(() => {
    const { uuid, requestID } = props;
    getUser(uuid).then(() => setRequestID(requestID));
  }, []);

  return user ? (
    <div className="w-full h-16 flex rounded-xl justify-between px-4 bg-[#F0F0F0] items-center">
      <div className="flex flex-col">
        <p className="text-xl font-bold">{user.user_name}</p>
        <p className="#7C7C7C">{userEmail}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-xl font-bold">Type</p>
        <p className="text-[#7C7C7C]">{user.user_type}</p>
      </div>
      <div className="flex gap-2">
        <Button icon={<CheckOutlined onClick={userAccepted} />} />
        <Button icon={<CloseOutlined onClick={showModal} />} />
        <Modal
          className="flex flex-col items-center justify-center"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            className="w-96 h-full flex mt-10 flex-col gap-4 justify-center border-slate-200 items-center"
            name="decline_reasoning"
            onFinish={userDeclined}
          >
            <Form.Item
              className="w-11/12 h-10 mb-2"
              name="reasoning"
              rules={[
                { required: true, message: "Please input your reasoning!" },
              ]}
            >
              <Input
                className="w-full h-10 px-2"
                type="text"
                placeholder="Give your reasoning here..."
                value={reasoning}
                onChange={handleReasoningChange}
                required
              />
            </Form.Item>
            <Form.Item className="w-11/12 h-10">
              <Button
                className="w-full h-10 bg-[#52C41A] text-white font-bold mx-auto"
                htmlType="submit"
                // onClick={handleCreateAccount}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  ) : (
    <></>
  );
}
export default Request;
