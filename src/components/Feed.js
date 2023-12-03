import { Layout, Card, Input } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import Post from "./Post";
import Navbar from "./Navbar"; // Import the Navbar component
import Profile from "./Profile";
const { Content, Sider } = Layout;

export default function Feed() {
  const [messages, setMessages] = useState("");

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
    <div className="min-h-screen flex flex-col">
      {/* Header with Navbar */}
      <header className="fixed w-full z-10 top-0">
        <Navbar />
      </header>

      {/* Main content */}
      <div className="min-h-screen flex flex-col bg-gray-100">
        
        <div className="flex-1 flex mt-16">
        <div className="w-1/3 h-fit bg-white rounded-2xl">
        <Profile />
        </div>
          
          <div className="w-full h-fit bg-white rounded-2xl bg-gray-100">
            {/* Display messages in cards */}
            {messages.length > 0 &&
              messages.map((message) => (
                <Card className="m-5 p-1">
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
        
      </div>

      
    </div>
  );
  
}
