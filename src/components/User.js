import { Image } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

function User(props) {
  const { username, subscribers, uuid } = props;
  return (
    <div className="w-11/12 shadow-none drop-shadow-none" bordered={false}>
      <div className="flex justify-between" id={uuid}>
        <div className="flex gap-4">
          <Image
            height={45}
            width={45}
            className="rounded-full"
            preview={false}
            src="https://i.pinimg.com/originals/d8/f5/2c/d8f52ce52985768ccac65f9550baf49e.jpg"
          />
          <div className="flex flex-col">
            <p className="text-lg m-0 font-bold">{username}</p>
            <p className="m-0 text-xs text-[#8C8C8C]">
              {subscribers} subscribers
            </p>
          </div>
        </div>
        <PlusCircleFilled className="text-lg text-[#4096FF]" />
      </div>
    </div>
  );
}

export default User;
