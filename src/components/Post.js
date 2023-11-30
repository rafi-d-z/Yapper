import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  EllipsisOutlined,
  LikeOutlined,
  DislikeOutlined,
  MoneyCollectOutlined,
  ExclamationCircleOutlined,
  CommentOutlined
} from "@ant-design/icons";
import { Image, Badge, Dropdown } from "antd";
import { getItem } from "../utils/helper_functions";

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
      <div className="flex w-11/12 mx-auto items-center gap-12">
          <Badge
            count={likes}
            showZero={true}
            offset={[8, 0]}
            size="small"
            color="#F0F0F0"
            style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
            className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
          >
            <LikeOutlined className="text-xl" />
            <p className="text-sm font-bold">Likes</p>
          </Badge>
          <Badge
            count={dislikes}
            showZero={true}
            offset={[8, 0]}
            size="small"
            color="#F0F0F0"
            style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
            className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
          >
            <DislikeOutlined className="text-xl" />
            <p className="text-sm font-bold">Dislikes</p>
          </Badge>
        <div className="flex gap-1 items-center p-1">
          <MoneyCollectOutlined className="text-xl text-[#FADB14]" />
          <p className="text-sm font-bold text-[#FADB14]">Tip</p>
        </div>
        <Badge
          // TO DO: Update to show the number of comments under post 
          count={dislikes}
          showZero={true}
          offset={[8, 0]}
          size="small"
          color="#F0F0F0"
          style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
          className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
        >
          <CommentOutlined className="text-xl" />
          <p className="text-sm font-bold">Comments</p>
      </div>
    </div>
  );
}
export default Post;
