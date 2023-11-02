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
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://gopjsvqjoeoawvccsgax.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvcGpzdnFqb2VvYXd2Y2NzZ2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4OTQxNTQsImV4cCI6MjAxMjQ3MDE1NH0.1sT3E8bYnevWNP5VOpw7wExvzJa8SUSVm6AuFkL-BLQ')
const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export async function testSupabaseInsert() {
  try {
    const currentTime = new Date(); 
    const formattedValue = `Current time : ${currentTime}`; 
    const { data, error } = await supabase
      .from('testing_table')
      .insert([
        { value: formattedValue }, 
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
    } else {
      console.log('Supabase insert successful:', data);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
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
          <Content className="bg-white">
            {/* Depending on what tab of side nav is selected, the main content will change to its corresponding component */}
            {keyIndex === '2' ? <Search /> : keyIndex === '5' ? <Settings /> : <Home />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
