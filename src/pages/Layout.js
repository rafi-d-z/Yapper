import { useEffect, useState } from "react";
import Home from "../components/Home";
// import SearchPage from "./components/Search";
// import Settings from "./components/Settings";
import CorporatePage from "../components/Corporate";
// import Auth from "./components/Auth";
// import Profile from "./components/Profile";
import {
  SearchOutlined,
  HomeFilled,
  UserOutlined,
  FolderOutlined,
  SettingOutlined,
  LoginOutlined,
  FilterOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import logo from "../images/YapperLogo7.png";
import { ConfigProvider, Layout, Menu, Image, Input, Button } from "antd";
// import { supabase } from "../utils/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";

const { Header, Content, Sider } = Layout;
const { Search } = Input;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function LayoutPage() {
  const [keyIndex, setKeyIndex] = useState("1");
  const [user, setUser] = useState(null);
  const session = useSession();

  const items = [
    getItem("Home", "1", <HomeFilled />),
    // TO DO: When supabase is connected, make the following items appear if the user has permission for them (Ex: for Corporate user, item 4 should appear in nav)
    // getItem('Profile', '3', <UserOutlined />),
    user !== null ? getItem("Ads / Jobs", "2", <FolderOutlined />) : null,
    // getItem("Sign in", "3", <LoginOutlined />),
  ];

  useEffect(() => {
    if (session) {
      console.log(session);
      console.log("user is signed in");
    }
  }, []);

  return (
    // Config Provider allows us to customize the properties of certain components default styling
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            lightSiderBg: "#4096FF",
            headerBg: "#FFFFFF",
          },
          Menu: {
            itemColor: "#000c17",
            itemHoverColor: "#000c17",
          },
          Button: {
            paddingInline: "0",
            onlyIconSize: 24,
            defaultColor: "#4096FF",
            primaryColor: "#4096FF",
          },
        },
      }}
    >
      <Layout theme={"light"} style={{ minHeight: "100vh" }}>
        <Header
          theme={"light"}
          className="w-full sticky top-0 z-[1] flex items-center"
        >
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-5">
              <Image width={50} height={50} src={logo} preview={false} />
              <div className="flex items-center justify-center gap-2">
                <Search
                  theme="light"
                  placeholder={"Search"}
                  enterButton={false}
                  style={{ width: 350 }}
                />
                <UnorderedListOutlined className="text-xl text-[#4096FF]" />
              </div>
            </div>
            <div className="border-l-2 h-7 bg-[#F0F0F0] rounded-lg"></div>
            <Menu
              defaultSelectedKeys={["1"]}
              theme="light"
              mode="horizontal"
              items={items}
              style={{ width: "550px" }}
              // When a tab is selected, we change the state variable so that we can keep track of which page to be on
              onSelect={(item) => {
                setKeyIndex(item.key);
              }}
            />
            <div className="border-l-2 h-7 bg-[#F0F0F0] rounded-lg"></div>
            <div className="w-64"></div>
          </div>
        </Header>
        <Content className="overflow-hidden">
          {keyIndex === "2" ? <CorporatePage /> : <Home />}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LayoutPage;
