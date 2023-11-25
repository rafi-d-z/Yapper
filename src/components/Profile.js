import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { Avatar, Button, Card } from "antd";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const { Meta } = Card;

function Profile() {
  const [user, setUser] = useState(null);
  const session = useSession();
  const pfp =
    "https://i.pinimg.com/originals/d8/f5/2c/d8f52ce52985768ccac65f9550baf49e.jpg";

  useEffect(() => {
    if (session) {
      console.log(session);
      console.log("user is signed in");
    }
  }, []);

  return user ? (
    // if the user is signed in then the following code shows
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-8/12 h-full">
        <Card
          className="w-full h-fit mt-7"
          style={{ boxShadow: "0 0 #0000" }}
          bordered={false}
        >
          <Meta
            avatar={<Avatar src={pfp} size={75} />}
            title="User Name"
            description={
              <div id="user-info">
                <p>420 followers</p>
                <p>69 following</p>
              </div>
            }
          />
          <br />
          <p>Profile Bio</p>
        </Card>

        {/* <Card className="w-2/5 h-fit mt-7" style={{border:"0.05rem solid rgb(229, 229, 229)"}}>
                    <Meta
                    avatar={<Avatar src={pfp} size={50}/>}
                    title="User Name"
                    description={
                        <div>
                            <p>420 followers</p>
                        </div>
                    }
                    />
                    <br/>
                    <p>wealth fame power, gol d roger, the king of pirates, has obtained these and everything else the world has to offer</p>
                    <br/>
                    <div style={{paddingLeft: '80%'}}>
                        <Button type='text' icon={<LikeOutlined/>}/> {likes} <Button type='text' icon={<DislikeOutlined/>}/>
                    </div>
                </Card> */}
      </div>
    </div>
  ) : (
    /* if user is not signed in, the following code shows (keep line in between this comment and code for some reason) */

    <div className="h-96 w-full">
      <div className="flex w-full h-full flex-col gap-3 justify-center items-center">
        <p className="text-lg">No account found!</p>
        {/* TO DO: Make text stay white when hovering */}
        <Link className="w-10/12" to={"/auth"}>
          <Button className="w-full bg-[#4096FF] text-white hover:text-white font-bold">
            Login
          </Button>
        </Link>
        <p className="text-base">or</p>
        {/* TO DO: Make text stay white when hovering */}
        <Link className="w-10/12" to={"/auth"}>
          <Button className="w-full bg-[#44D65B] text-white hover:text-white font-bold">
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
