import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { getItem } from "../utils/helper_functions";
import { Image, Dropdown, Badge } from "antd";
import Feedback from "./Feedback";

function Post(props) {
  // pid is the id of this particular post, uuid is the id of the user who POSTED this particular post (not the user logged in)
  const { message, pid, uuid, trendy } = props;
  const [username, setUsername] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [avatarUrl, setAvatarURL] = useState(null)

  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  
  const getUser = async (user_id) => { //CHANGES
    try {
      const { data, error } = await supabase
        .from("user")
        .select()
        .eq("id", user_id);
      if (error) {
        throw error;
      } else if (data) {
        setUser(data[0]);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getDeleteItem = (label, key, onClick) => ({
    label,
    key,
    icon: <DeleteOutlined />,
    onClick,
  });

  console.log("Current User:", user); 
  const items = [
    getItem(
      "Report Message", 
      "report", 
      <ExclamationCircleOutlined />),
    ...(user && user.id === uuid
      ? [getDeleteItem(
        "Delete Message", 
        "delete", 
        () => handleDeletePost(pid))]
      : []),
  ];
  
  const getData = async () => {
    try {
      const resp = await supabase.from("user").select().eq("id", uuid);
      setUsername(resp.data[0].user_name);
      setSubscribers(resp.data[0].subscribers);
      setAvatarURL(resp.data[0].avatar_url)
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => { //CHANGES
    try {
      await supabase.from("message").delete().eq("id", postId);

      // Navigate to the "/loading" route
      navigate('/loading');
      setTimeout(() => {
        navigate('/');
      }, 0);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    
  }; 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    }).catch((error) => {
      console.error("Error fetching session:", error);
    });
  
    getData(); // Moved outside of the `then` block
  }, []);
  

  console.log("Menu Items:", items);

  return (
    
    <div className="w-full h-full py-5 flex flex-col justify-between">
      {trendy == 'True' ? <Badge.Ribbon text="Trending" color="green"></Badge.Ribbon> : null}
      <div className="flex w-11/12 justify-between mx-auto items-center">
        <div className="flex gap-4 w-4/12 items-center">
          <Image
            height={45}
            width={45}
            className="rounded-full"
            preview={false}
            src={avatarUrl}
          />
          <div className="flex flex-col">
            <p className="text-lg font-bold">{username}</p>
            <p className="text-xs text-[#7C7C7C]">{subscribers} subscribers</p>
          </div>
        </div>
        <Dropdown menu={{ items }} >
          <EllipsisOutlined className="text-2xl font-bold text-[#8C8C8C]" />
        </Dropdown>
      </div>
      <div className="w-11/12 flex items-center mx-auto cursor-pointer" onClick={() => navigate('/post', {state: pid})}>
        <p className="text-base">{message}</p>
      </div>
      <Feedback pid={pid} uuid={uuid} />
    </div>
  );
}
export default Post;
