import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  EllipsisOutlined,
  LikeOutlined,
  DislikeOutlined,
  MoneyCollectOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Image, Badge, Dropdown } from "antd";
import getItem from "../utils/helper_functions";

function Post(props) {
  const { message, likes, dislikes, pid, uuid } = props;
  const [username, setUsername] = useState(null);
  const [subscribers, setSubscribers] = useState(null);

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
        <div className="flex justify-between w-4/12 items-center">
          <Image
            height={45}
            width={45}
            className="rounded-full"
            preview={false}
            src="https://i.pinimg.com/originals/d8/f5/2c/d8f52ce52985768ccac65f9550baf49e.jpg"
          />
          <div className="flex flex-col">
            <p className="text-lg font-bold">{username}</p>
            <p className="text-xs text-[#7C7C7C]">{subscribers} subscribers</p>
          </div>
        </div>
        <Dropdown menu={{ items }}>
          <EllipsisOutlined className="text-2xl font-bold text-[#8C8C8C]" />
        </Dropdown>
      </div>
      <div className="w-11/12 flex items-center mx-auto">
        <p className="text-base">{message}</p>
      </div>
      <div className="flex w-11/12 mx-auto items-center gap-12">
        <div className="flex gap-1 items-center">
          <LikeOutlined className="text-xl text-[#8C8C8C]" />
          <Badge
            count={likes}
            showZero={true}
            offset={[8, 0]}
            size="small"
            color="#F0F0F0"
            style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
            className="text-[#8C8C8C]"
          >
            <p className="text-sm font-bold text-[#8C8C8C]">Likes</p>
          </Badge>
        </div>
        <div className="flex gap-1 items-center">
          <DislikeOutlined className="text-xl text-[#8C8C8C]" />
          <Badge
            count={dislikes}
            showZero={true}
            offset={[8, 0]}
            size="small"
            color="#F0F0F0"
            style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
            className="text-[#8C8C8C]"
          >
            <p className="text-sm font-bold text-[#8C8C8C]">Dislikes</p>
          </Badge>
        </div>
        <div className="flex gap-1 items-center">
          <MoneyCollectOutlined className="text-xl text-[#FADB14]" />
          <p className="text-sm font-bold text-[#FADB14]">Tip</p>
        </div>
      </div>
    </div>
  );
}
export default Post;
