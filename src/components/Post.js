import { Button, Card, Popover } from "antd";
import { EllipsisOutlined, LikeOutlined, DislikeOutlined, WarningFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

function Post(props){
    const { message, likes, dislikes, uuid } = props;
    const [username, setUsername] = useState(null)
    const [subscribers, setSubscribers] = useState(null)
    const content = () => {
        return (
            <div className="flex flex-col w-40 m-0">
                <div className="w-full m-0">
                    <Button type="text" className="w-full flex justify-center items-center" icon={<WarningFilled className="text-[#F24E1E] text-lg" />}>Report Message</Button>
                </div>
            </div>
        )
    }

    const getData = async () => {
        try {
            const resp = await supabase
            .from("user")
            .select()
            .eq("id", uuid);
            setUsername(resp.data[0].user_name)
            setSubscribers(resp.data[0].subscribers)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <Card className="w-9/12 h-fit px-5">
            <div className="flex flex-col justify-around gap-4">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-0">
                        {/* Rn, user name will go here */}
                        <p className="text-lg m-0 font-bold">{username ? username : 'Not Found'}</p>
                        <p className="m-0 text-[#8C8C8C]">{subscribers ? subscribers : 0} subscribers</p>
                    </div>
                    <div>
                        <Popover placement="bottomRight" content={content} className="p-0 m-0">
                            <EllipsisOutlined className="text-xl" />
                        </Popover>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        <p className="text-lg">{message}</p>
                    </div>
                    <div className="flex gap-2 text-lg items-center">
                        <LikeOutlined />
                        <p>{likes-dislikes}</p>
                        <DislikeOutlined />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default Post;