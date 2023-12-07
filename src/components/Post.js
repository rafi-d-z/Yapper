import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  DeleteOutlined, //CHANGES,
  HeartOutlined
} from "@ant-design/icons";
import {getItem} from "../utils/helper_functions";
import { Image, Badge, Dropdown, Button, Modal, Input } from "antd";
import Feedback from "./Feedback";

function Post(props) {
  const { message, likes, dislikes, pid, uuid, trendy, views } = props;
  const [username, setUsername] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [avatarUrl, setAvatarURL] = useState(null)
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const getReportItem = (label, key, onClick) => ({
    label,
    key,
    icon: <ExclamationCircleOutlined />,
    onClick,
  });

  const handleReportMessage = async (postId) => {
    try {
      const { data, error } = await supabase
        .from("complaint")
        .insert([
          {
          reported_user_id: uuid, // the user of the message that we're reporting
          reporter_user_id: user.id, // the user who made the report
          message_id: pid, // the message_id
          },
        ]);
  
      if (error) {
        throw error;
      }
      } catch (error) {
      console.error("Error reporting message:", error);
    }
  };

  const handleFollowMessage = async () => {
    if (!user || !user.id) {
      // User is not logged in, handle accordingly (e.g., redirect to login)
      navigate("/auth");
      return;
    }
    if (user.id == null){
      
    }
    try { 
      let { data: follow_message, error } = await supabase
      .from('follow_message')
      .select() 
      .match({ follower_id: user.id, message_id: pid })
      if (error) {
        throw error;
      } else if (follow_message) {
        console.log(follow_message);
      } else {
        console.log("found nothing");
      }


      if (follow_message.length > 0) {
        alert("You already follow this message")
      }
      else{
        const { data, error } = await supabase
        .from('follow_message')
        .insert([
          { follower_id: user.id, message_id: pid },
        ])
        .select()

      }
    } catch (error) {
      console.log(error);
    }
    
  };

  console.log("Current User:", user); 
  const items = [
    getReportItem(
      "Report Message", 
      "report", 
      () => handleReportMessage(pid)
    ),

      getItem("Follow Message",
       "follow",
      <HeartOutlined />,
      handleFollowMessage),
      
      
    ...(user && (user.id === uuid || user.user_type === 'super')
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

  const openComment = () => {
    setIsCommentOpen(true);
  }

  const closeComment = () => {
    setIsCommentOpen(false);
  }

  const updateComment = (e) => {
    setComment(e.target.value);

  }

  const postComment = () => {
    console.log(comment);
    const commentResp = supabase.from("comment");
    commentResp.insert([{
      comment_content: comment
    }])

  }

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
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    }).then(() => {
      // give loading animation time to actually display by displaying it for 2 seconds after the data is fetched
      setTimeout(() => setLoading(false), 500);
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
      <div className="w-11/12 flex items-center mx-auto">
        <p className="text-base">{message}</p>
      </div>
      <Feedback countLikes={likes} countDislikes={dislikes} countComments={likes} pid={pid} uuid={uuid} />
      {Number.isInteger(views) ? <div className="w-11/12 mx-auto text-[#8C8C8C]">Seen {views} times</div> : <></>}
      <div className="flex items-center">
        </div>
    </div>
  );
}
export default Post;
