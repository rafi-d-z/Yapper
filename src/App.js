import { useState } from "react";
import Home from "./components/Home";
import SearchPage from "./components/Search";
import Settings from "./components/Settings";
import CorporatePage from "./components/Corporate";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import {
  SearchOutlined,
  HomeFilled,
  UserOutlined,
  FolderOutlined,
  SettingOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Layout, Menu } from "antd";
import { supabase } from "./utils/supabaseClient";

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Home", "1", <HomeFilled />),
  getItem("Search", "2", <SearchOutlined />),
  // TO DO: When supabase is connected, make the following items appear if the user has permission for them (Ex: for Corporate user, item 4 should appear in nav)
  getItem('Profile', '3', <UserOutlined />),
  getItem('Ads / Jobs', '4', <FolderOutlined />)
  getItem("Settings", "5", <SettingOutlined />),
  getItem("Sign in", "6", <LoginOutlined />),
];


function App() {
  const [keyIndex, setKeyIndex] = useState('1');

  return (
    // Config Provider allows us to customize the properties of certain components default styling
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            lightSiderBg: "#4096FF",
          },
          Menu: {
            itemBg: "#4096FF",
            itemColor: "#fff",
            itemHoverColor: "#fff",
          },
          Button: {
            paddingInline: "0",
            onlyIconSize: 24,
            defaultColor: "#4096FF",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sider theme="light">
            <Menu
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items}
              className="mt-10"
              // When a tab is selected, we change the state variable so that we can keep track of which page to be on
              onSelect={(item) => {
                setKeyIndex(item.key);
              }}
            />
          </Sider>
          <Content className="bg-white max-h-screen overflow-scroll border-0">
            {/* Depending on what tab of side nav is selected, the main content will change to its corresponding component */}
            {keyIndex === '2' ? <SearchPage /> : keyIndex === '4' ? <CorporatePage /> : keyIndex === '5' ? <Settings /> : keyIndex === '6' ? <Auth />: <Home />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
