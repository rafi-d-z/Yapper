import { Image } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

function User(props) {
  const { username, subscribers, uuid, avatar } = props;
  return (
    <div className="w-11/12 shadow-none drop-shadow-none" bordered={false}>
      <div className="flex justify-between" id={uuid}>
        <div className="flex gap-4">
          <Image
            height={45}
            width={45}
            className="rounded-full"
            preview={false}
            src={avatar}
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
