import { SettingOutlined } from "@ant-design/icons";
import { Image, Button, Card } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  // setLoading(false);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    });
  }, []);

  return user ? (
    // if the user is signed in then the following code shows
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-10/12 h-full flex flex-col mt-3 mb-5 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image width={60} height={60} className="rounded-full" src={user.avatar_url} />
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold">{user.user_name}</p>
            </div>
          </div>
          <SettingOutlined className="text-2xl hover:text-[#4096FF] cursor-pointer" />
        </div>
        <hr className="w-full"  />
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">{user.subscribers}</p>
          <p className="text-base font-bold text-[#7C7C7C]">Total Subscribers</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">{user.total_likes}</p>
          <p className="text-base font-bold text-[#7C7C7C]">Total Likes</p>
        </div>
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
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
