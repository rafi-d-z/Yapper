import { useEffect, useState } from "react";
import Home from "../components/Home";
import CorporatePage from "../components/Corporate";
import Profile_Nav from "../components/Profile_Nav";
import { getItem } from "../utils/helper_functions";
import {
  HomeFilled,
  FolderOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "../images/YapperLogo7.png";
import {
  ConfigProvider,
  Layout,
  Menu,
  Image,
  Input,
} from "antd";
import { supabase } from "../utils/supabaseClient";

const { Header, Content } = Layout;
const { Search } = Input;

function LayoutPage() {
  const [keyIndex, setKeyIndex] = useState("1");
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const items = [
    getItem("Home", "1", <HomeFilled />),
    // TO DO: When supabase is connected, make the following items appear if the user has permission for them (Ex: for Corporate user, item 4 should appear in nav)
    // getItem('Profile', '3', <UserOutlined />),
    user !== null && user.user_type === 'corporate' ? getItem("Ads / Jobs", "2", <FolderOutlined />) : null,
    // getItem("Sign in", "3", <LoginOutlined />),
  ];

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
      setSession(session);
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    });
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
            <div className="flex items-center gap-5 w-4/12">
              <div className="flex xl:w-2/12">
                <Image width={50} height={50} src={logo} preview={false} />
              </div>
              <div className="w-full flex items-center gap-2">
                <Input className="w-10/12" placeholder="Search" prefix={<SearchOutlined className="text-[#8C8C8C]" />}  />
                {/* TODO: Filter icon would go here */}
              </div>
            </div>
            <div className="border-l-2 h-7 bg-[#F0F0F0] rounded-lg"></div>
            <Menu
              defaultSelectedKeys={["1"]}
              theme="light"
              mode="horizontal"
              items={items}
              className="w-5/12"
              // When a tab is selected, we change the state variable so that we can keep track of which page to be on
              onSelect={(item) => {
                setKeyIndex(item.key);
              }}
            />
            <div className="border-l-2 h-7 bg-[#F0F0F0] rounded-lg"></div>
            <div className="w-3/12 px-4">
              {user ? (
                <Profile_Nav user={user} />
              ) : (
                <></>
              )}
            </div>
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
