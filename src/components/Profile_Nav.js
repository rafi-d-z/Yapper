import { Image, Dropdown } from "antd";
import { DownOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { supabase } from "../utils/supabaseClient";
import { getItem } from "../utils/helper_functions";

function Profile_Nav(props) {
  const items = [
    getItem("Settings", "1", <SettingOutlined />),
    getItem("Logout", "2", <LogoutOutlined />),
  ];

  const handleDropdownItemClick = (e) => {
    // user clicked logout from dropdown
    if(e.key === '2'){
        logout();
    }
  };

  const reloadPage = () => {
    window.location.reload();
};

  const logout = async () => {
    try{
        const { error } = await supabase.auth.signOut()
        if(error){
            throw error
        }
        reloadPage();
    } catch (error) {
        console.log(error)
    }
 }
  
  return (
    <Dropdown
    placement="bottomCenter"
    className="w-8/12"
    trigger={'click'}
    menu={{ 
        onClick: handleDropdownItemClick,
        items: items }}
    arrow={true}
  >
    <div className="flex items-center gap-4 cursor-pointer p-1 px-3 w-fit rounded-xl hover:bg-[#F5F5F5]">
      <Image
        width={40}
        height={40}
        className="rounded-full"
        preview={false}
        src={
          props.user.avatar_url
            ? props.user.avatar_url
            : "https://gopjsvqjoeoawvccsgax.supabase.co/storage/v1/object/public/avatars/default.jpg"
        }
      />
      <div className="flex flex-col">
        <p className="text-lg font-bold">{props.user.user_name}</p>
        <p className="text-xs text-[#7C7C7C]">
          {props.user.subscribers} subscribers
        </p>
      </div>
        <DownOutlined className="text-xs" />
    </div>
    </Dropdown>
  );
}

export default Profile_Nav;