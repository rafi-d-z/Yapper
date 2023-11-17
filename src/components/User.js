import { Card } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

function User(props){
    const { username, subscribers, uuid } = props;
    return (
        <Card className="w-96">
            <div className="flex justify-between" id={uuid}>
                <div className="flex flex-col">
                    <p className="text-lg m-0 font-bold">{username}</p>
                    <p className="m-0 text-[#8C8C8C]">{subscribers} subscribers</p>
                </div>
                <PlusCircleFilled className="text-lg text-[#4096FF]" />
            </div>
        </Card>
    )
}

export default User;