import { Layout, Card, Input, Image } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import Post from "./Post";
import Profile from "./Profile";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const { Content, Sider, Header } = Layout;

export default function Feed() {
  const [messages, setMessages] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("message")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex-1 flex mt-16">
      <div className="w-1/3 h-fit bg-white rounded-2xl">
        <Profile />
      </div>

      <div className="w-full h-fit bg-white rounded-2xl bg-gray-100">
        {messages.length > 0 &&
          messages.map((message) => (
            <Card
              className="m-5 p-1"
              key={message.id}
              onClick={() => navigate(`/feed/${message.id}`)}
            >
              <Post
                key={message.id}
                message={message.message_content}
                likes={message.likes}
                dislikes={message.dislikes}
                subscribers={message.subscribers}
              />
            </Card>
          ))}
      </div>
    </div>
  );
}
