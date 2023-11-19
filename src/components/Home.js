import { Input, Card, Button } from "antd";
import { FileImageFilled, PlayCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from 'react'
import { supabase } from "../utils/supabaseClient";

const { TextArea } = Input; 


function Home() {
const[fetchError, setFetchError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // Added state to store the text input value

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('message')
        .select();

      if (error) {
        console.log(error)
    
      }
      if (data) {
    
      }
    }

    fetchMessages();
  }, []);

  const handlePostClick = async () => {
    // Log the text input value
    console.log(newMessage);
     const { data, error } = await supabase
       .from('message')
       .insert([
         { user_id: '9bbe2db9-65b0-4f56-b0cd-1fb808beb764',
            message_content: newMessage,
            message_type: "message",
            keywords: "test"
        
         },
       ]);

    // Clear the input field
    setNewMessage("");
  }

    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="w-8/12 h-full">
                <Card className="w-full h-52 border border-slate-200 drop-shadow mt-7">
                <div className="w-full h-full flex flex-col gap-10 justify-center">
                    <TextArea className="w-full h-24 resize-none" placeholder="Whats happening?..." showCount maxLength={100} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <div className="flex justify-between w-full">
                    <div className="flex w-2/12 gap-2">
                        <Button className="border-none" icon={<FileImageFilled />} />
                        <Button className="border-none" icon={<PlayCircleFilled />} />
                    </div>
                    <Button className="px-5 bg-[#4096FF] text-white font-bold" onClick={handlePostClick}>Post</Button>
                    </div>
                </div>
                </Card>
            </div>
        </div>
    )
}
export default Home;