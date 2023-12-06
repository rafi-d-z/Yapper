import { Badge, Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { MoneyCollectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LikesDislikes from "./Feedback/LikesDislikes";
import Comment from "./Feedback/Comment";

function Feedback(props) {
  const [tipAmount, setTipAmount] = useState("");
  const { pid, uuid } = props;
  // pid is the post id of this post, uuid is the id of the POSTER

  const [isTipActive, setIsTipActive] = useState(false);
  const [session, setSession] = useState(null);
  // user is the data of the user signed in, if a user is signed in
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState();
  const [recipientBalance, setRecipientBalance] = useState();
  const [recipientTip, setRecipientTip] = useState();

  const navigate = useNavigate();

  const getPoster = async () => {
    try {
      let { data: post, error } = await supabase
        .from("user")
        .select()
        .eq("id", uuid);
      if (error) {
        throw error;
      }
      console.log(post[0].account_balance);
      setRecipientBalance(post[0].account_balance);
      console.log(recipientBalance);
      setRecipientTip(post[0].tips);
    } catch (error) {
      console.log(error);
    }
  };

  const openTipPanel = () => {
    setIsTipActive(true);
  };

  const closeTipPanel = () => {
    setIsTipActive(false);
    setTipAmount();
  };
  const handleTipAmountChange = (e) => {
    setTipAmount(e.target.value);
  };

  const tipUser = async () => {
    const parsedTipAmount = parseFloat(tipAmount);
    if (!isNaN(parsedTipAmount)) {
      if (balance >= tipAmount) {
        // Decrement user balance

        try {
          let { data: post, error } = await supabase
            .from("user")
            .update({ account_balance: balance - parsedTipAmount })
            .eq("id", user.id);
          if (error) {
            throw error;
          } else {
            setBalance(balance - parsedTipAmount);
          }
        } catch (error) {
          console.log(error);
        }

        // increment the new user's balance and their tips
        try {
          let { data: post, error } = await supabase
            .from("user")
            .update({
              account_balance: recipientBalance + parsedTipAmount,
              tips: recipientTip + parsedTipAmount,
            })
            .eq("id", uuid);
          if (error) {
            throw error;
          } else {
            setBalance(balance - parsedTipAmount);
            setRecipientBalance(recipientBalance + parsedTipAmount);
            setRecipientTip(recipientTip + parsedTipAmount);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Warning: Insufficent Balance");
      }
    } else {
      alert("Invalid Tip Amount. Please enter a valid number.");
    }

    // send to the users tip jar
    // using the pid find the uuid of posting user

    closeTipPanel();
  };
  // add function here, if a user clicks on tip it will use the pid to search for the
  // in the post table, then grab that users id.
  // from that users id i can find his table on users
  // update the tables as needed dec user balance inc recivers balance and tip

  useEffect(() => {
    const getUser = async (user_id) => {
      try {
        const { data, error } = await supabase
          .from("user")
          .select()
          .eq("id", user_id);
        if (error) {
          throw error;
        } else if (data) {
          console.log(data);
          setUser(data[0]);
          setBalance(data[0].account_balance);
        } else {
          console.log("found nothing");
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
      }
    });
    getPoster();
  }, []);

  return (
    <div className="flex w-11/12 mx-auto items-center gap-12">
      {/* Component is found in /components/Feedback */}
      <LikesDislikes isUserLoggedIn={user ? true : false} curUser={user ? user : null} pid={pid} uuid={uuid} />
      <div
        className="flex gap-1 items-center p-1 hover:text-[#4096FF] rounded-md cursor-pointer hover:bg-[#F5F5F5] "
        onClick={user ? openTipPanel : () => navigate("/auth")}
      >
        <MoneyCollectOutlined className="text-xl text-[#FADB14] " />
        <p className="text-sm font-bold text-[#FADB14]">Tip</p>
      </div>
      {/* Ant Design Modal for Tip */}
      <Modal
        open={isTipActive}
        title="Tip This Post!"
        onCancel={closeTipPanel}
        footer={null} // You can customize the footer if needed
      >
        {/* Add your tip panel content here */}
        <p className="text-lg font-bold"></p>
        <p>Remember to be generous!</p>
        <Input
          className="w-1/6"
          size="small"
          placeholder="$0.00"
          value={tipAmount}
          onChange={handleTipAmountChange}
        />
        <button
          className="font-bold text-[#4096ff] p-2"
          type="text"
          onClick={tipUser}
        >
          Tip
        </button>
      </Modal>
      {/* Component is found in /components/Feedback */}
      <Comment curUser={user ? user : null} pid={pid} />
    </div>
  );
}

export default Feedback;
