import { VerticalAlignMiddleOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, } from "antd";

function Profile(){
    const {Meta} = Card;

    return(
        <div className="h-full w-full flex justify-center items-center">
            <div className="w-8/12 h-full">
                <Card className="w-full h-fit mt-10">
                    <Meta
                    avatar={<Avatar src="https://i.pinimg.com/originals/d8/f5/2c/d8f52ce52985768ccac65f9550baf49e.jpg" size={75}/>}
                    title="Profile Page"
                    description={
                        <div id="user-info">
                            <p>420 followers</p>
                            <p>69 following</p>
                        </div>}
                    />
                </Card>
            </div>
        </div>
    )
};

export default Profile;