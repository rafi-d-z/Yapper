import { useState } from "react";
import Home from "./components/Home";
import Search from "./components/Search";
import Settings from "./components/Settings";
import {
  SearchOutlined,
  HomeFilled,
  UserOutlined,
  FolderOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Layout, Menu } from "antd";
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
  // getItem('Profile', '3', <UserOutlined />),
  // getItem('Ads / Jobs', '4', <FolderOutlined />)
  getItem("Settings", "5", <SettingOutlined />),
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
          <Content className="bg-white max-h-screen overflow-scroll">
            {/* Depending on what tab of side nav is selected, the main content will change to its corresponding component */}
            {keyIndex === '2' ? <Search /> : keyIndex === '5' ? <Settings /> : <Home />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
