import { useEffect, useState } from "react";
import Profile_Nav from "../components/Profile_Nav";
import { useNavigate } from "react-router-dom";
import { getItem } from "../utils/helper_functions";
import {
  HomeFilled,
  FolderOutlined,
  RiseOutlined,
  SearchOutlined,
  AppstoreOutlined,
  PaperClipOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import logo from "../images/YapperLogo7.png";
import { ConfigProvider, Layout, Menu, Image, Input, Dropdown } from "antd";
import { supabase } from "../utils/supabaseClient";
import { Outlet, Link } from "react-router-dom";
import PostScheduled from "../components/ScheduleSendBackend";

const { Header, Content } = Layout;

function LayoutPage() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [searchDropDown, setSearchDropDown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);
  // routing navigate function
  const navigate = useNavigate();

  let items =
    searchTerm.length === 0
      ? [
          {
            label: <p className="font-semibold">CCNY</p>,
            key: "CCNY",
            icon: <HistoryOutlined className="text-lg" />,
          },
          {
            label: <p className="font-semibold">Software Engineering</p>,
            key: "Software Engineering",
            icon: <HistoryOutlined className="text-lg" />,
          },
          {
            label: <p className="font-semibold">Jie Wei</p>,
            key: "Jie Wei",
            icon: <HistoryOutlined className="text-lg" />,
          },
        ]
      : searchUserResults;

  const handleDropdownItemClick = (e) => {
    navigate('/loading', { state: e.key });
    /* After navigating to a different route temporarily, redirect to the desired route (we must do this because of a limitation of react routing
      in which if in the same url aka '/searchResults' you cannot navigate to the same url meaning if a user tries to search in the search result page, 
      it would do nothing)
    */
    setTimeout(() => {
      navigate('/searchResults', { state: e.key });
    }, 0); // Use setTimeout to ensure redirect after current stack
  };
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

  const searchUsers = async (search) => {
    setSearchTerm(search);
    const results = [];
    try {
      const { data, error } = await supabase.from("user").select();
      if (error) {
        throw error;
      } else if (data) {
        data.forEach((obj) => {
          const username = String(obj.user_name);
          if (username.startsWith(search) || username.includes(search)) {
            const user = {
              label: (
                <div className="flex gap-2 ml-2">
                  <p className="font-semibold">{obj.user_name}</p>
                  <p className="font-normal text-[#8C8C8C]">
                    {obj.subscribers} subscribers
                  </p>
                </div>
              ),
              icon: (
                <Image
                  width={30}
                  height={30}
                  className="rounded-full mr-2"
                  preview={false}
                  src={obj.avatar_url}
                />
              ),
              key: String(obj.id),
            };
            results.push(user);
          }
        });
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
    if (results.length === 0) {
      results.push({
        label: (
          <p className="text-[#8C8C8C] text-base font-normal text-center">
            No users found
          </p>
        ),
        key: "1",
        disabled: true,
      });
    }
    results.push({
      type: "divider",
    });
    results.push({
      label: (
        <p className="text-[#4096FF] text-base font-bold text-center">
          See all message results
        </p>
      ),
      key: `${search}`,
    });
    setSearchUserResults(results);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    });
    setSearchTerm('');
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
              <div className="flex gap-2 items-center w-full">
                {/* TO DO: When users click on logo, they go back to homepage (feed) */}
                <Image width={50} height={50} src={logo} className="cursor-pointer" preview={false} onClick={() => {
                  setSearchTerm('')
                  navigate('/')
                  PostScheduled()
                }} />
                <Dropdown
                  className="w-8/12"
                  menu={{ items: items, onClick: handleDropdownItemClick }}
                  trigger={["click"]}
                >
                  <Input
                    className="w-8/12"
                    onFocus={() => setSearchDropDown(true)}
                    onBlur={() => setSearchDropDown(false)}
                    onChange={(e) => searchUsers(e.target.value)}
                    placeholder="Search"
                    value={searchTerm}
                    prefix={<SearchOutlined className="text-[#8C8C8C]" />}
                  />
                </Dropdown>
              </div>
              {/* TODO: Filter icon would go here */}
            </div>
            <div className="border-l-2 h-7 bg-[#F0F0F0] rounded-lg"></div>
            <Menu
              defaultSelectedKeys={["1"]}
              theme="light"
              mode="horizontal"
              items={[
                user == null
                  ? getItem("Home", "1", <HomeFilled />)
                  : getItem("Feed", "1", <AppstoreOutlined />),
                // TO DO: When supabase is connected, make the following items appear if the user has permission for them (Ex: for Corporate user, item 4 should appear in nav)
                user == null
                  ? null
                  : getItem("Jobs", "2", <PaperClipOutlined />),
                user !== null && user.user_type === "corporate"
                  ? getItem("Ads / Jobs", "3", <FolderOutlined />)
                  : null,
                  getItem("Trending", "4", <RiseOutlined />)
                // getItem("Sign in", "3", <LoginOutlined />),
              ]}
              className="w-5/12"
              // When a tab is selected, we change the state variable so that we can keep track of which page to be on
              onSelect={(item) => {
                if (item.key === "1") {
                  navigate("/");
                } else if (item.key === "2") {
                  navigate("/jobs");
                } else if (item.key === "3") {
                  navigate("/corp");
                } else if (item.key === "4") {
                  navigate("/Trending");
                }
              }}
            />
            <div className="border-l-2 h-7 bg-[#F0F0F0] rounded-lg"></div>
            <div className="w-3/12 px-4">
              {user ? <Profile_Nav user={user} /> : <></>}
            </div>
          </div>
        </Header>
        <Content
          className={
            searchDropDown
              ? "overflow-hidden opacity-50 transition-opacity duration-1000`"
              : "overflow-hidden"
          }
        >
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LayoutPage;
