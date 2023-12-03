import React from "react";
import { Image, Input } from "antd";
import {
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import logo from "../images/YapperLogo7.png";

function Navbar() {
  return (
    <div className="bg-white"><div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-5">
        <Image width={50} height={50} src={logo} preview={false} />
        <div className="flex items-center justify-center gap-2">
            <Input
            theme="light"
            placeholder={"Search"}
            enterButton={false}
            style={{ width: 350 }}
            />
            <UnorderedListOutlined className="text-xl text-[#4096FF]" />
        </div>
        </div>
    </div>
 </div>
    
  );
}

export default Navbar;
