import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import getItem from "../utils/helper_functions";
import { Image, Badge, Dropdown, Button, Modal, Input } from "antd";
import { getItem } from "../utils/helper_functions";
import Feedback from "./Feedback";

function Post(props) {
  const { message, likes, dislikes, pid, uuid } = props;
  const [username, setUsername] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [avatarUrl, setAvatarURL] = useState(null)

  const items = [
    getItem(
      "Report Message",
      "report",
      <ExclamationCircleOutlined className="text-[#F24E1E] text-lg" />
    ),
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full h-full py-5 flex flex-col justify-between">
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
      <div className="flex items-center">
        <Button className="text-sm font-bold text-[#8C8C8C]" size="small" icon={<CommentOutlined/>} shape='round' type='text' onClick={openComment}>Comment</Button>
        <Modal open={isCommentOpen} onCancel={closeComment} footer={<Button>Comment</Button>}>
        <Image
            height={45}
            width={45}
            className="rounded-full"
            preview={false}
            src='https://i.pinimg.com/originals/d8/f5/2c/d8f52ce52985768ccac65f9550baf49e.jpg'
          />
          <p className="text-lg font-bold">{username}</p>
          <p>{message}</p>
          <br/>
          <br/>
          <Input placeholder="Leave your thoughts!"/>
          
        </Modal>
        </div>
    </div>
  );
}
export default Post;
