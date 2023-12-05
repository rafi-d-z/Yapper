import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
  CommentOutlined
} from "@ant-design/icons";
import {getItem} from "../utils/helper_functions";
import { Image, Badge, Dropdown, Button, Modal, Input, List, Avatar } from "antd";
import Feedback from "./Feedback";

function Post(props) {
  const { message, likes, dislikes, pid, uuid } = props;
  const [username, setUsername] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [avatarUrl, setAvatarURL] = useState(null)
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getUser = async (user_id) => {
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

  const openComment = () => {
    setIsCommentOpen(true);
  }

  const closeComment = () => {
    setIsCommentOpen(false);
  }

  const updateComment = (e) => {
    setComment(e.target.value);

  }

  const postComment = async() => {
    const{data, error} = await supabase
    .from("comment")
    .insert({
      commenter_id: user.id,
      message_id: pid,
      profile_id: uuid,
      comment_content: comment
    });
    console.log((await comments).data);
  }

  const comments = supabase
    .from('comment')
    .select('comment_content')
    .eq('message_id',pid);

  const commentsSection = 


  useEffect(() => {
    getData();

    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    });
  }, [])

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
        <Modal open={isCommentOpen} onCancel={closeComment} footer={null}>
        <Image
            height={45}
            width={45}
            className="rounded-full"
            preview={false}
            src={avatarUrl}
          />
          <p className="text-lg font-bold">{username}</p>
          <br/>
          <div style={{fontSize:'30px'}}>{message}</div>
          <br/>
          <br/>
          <Input onChange={updateComment} placeholder="Leave your thoughts!"/>
          <br/>
          <br/>
          <Button style={{padding:'0px 10px', border:"solid", borderWidth:'1px'}} onClick={postComment} className="font-bold text-[#4096ff]" type='text'>Comment</Button>
          <List>
            <List.Item>
              <List.Item.Meta
              avatar={<Avatar src={avatarUrl}/>}
              title={<div style={{fontWeight:'bold'}}>rafid</div>}
              description='ur mom'
              />
            </List.Item>
          </List>
        </Modal>
        </div>
    </div>
  );
}
export default Post;
