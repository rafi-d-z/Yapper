import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Image, Divider, Button, Dropdown } from "antd";
import { EllipsisOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Loading from "../components/Loading";
import Post from "../components/Post";
import { getItem } from "../utils/helper_functions";
import { supabaseAdmin } from "../utils/supabaseClient";

function SearchResults() {
  const location = useLocation();
  const searchData = location.state;
  const [user, setUser] = useState(null);
  const [curUserSuper, setCurUserSuper] = useState(false)
  const [isUserSearch, setIsUserSearch] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const getDeleteItem = (label, key, onClick) => ({
    label,
    key,
    icon: <DeleteOutlined />,
    onClick,
  });

  const items = [
    getItem(
      "Report User", 
      "report", 
      <ExclamationCircleOutlined />),
    ...(user && (curUserSuper === true)
      ? [getDeleteItem(
        "Delete User", 
        "delete", 
        () => handleDeleteUser(user.id))]
      : []),
  ];

  const handleDeleteUser = async (user_id) => {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        user_id
      );
      if (error) {
        throw error;
      } else if (data) {
        console.log(data);
        navigate('/loading');
        setTimeout(() => {
          navigate('/');
        }, 0);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
        // getUserPosts(user_id)
        return true;
      } else {
        console.log("found nothing");
        return false;
      }
    } catch (error) {
      if (error.code === "22P02") {
        console.log("this isnt user");
        return false;
      } else {
        console.log(error);
        return false;
      }
    }
  };

  const getUserPosts = async (id) => {
    try {
      const { data, error } = await supabase
        .from("message")
        .select()
        .eq("user_id", id);
      if (error) {
        throw error;
      } else if (data) {
        console.log(data);
        setPosts(data);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async (search) => {
    try {
      const { data, error } = await supabase.from("message").select();
      if (error) {
        throw error;
      } else if (data) {
        const result = data.filter((message) => {
          let keywords = message.keywords;
          let startsWith = false;
          for (let i = 0; i < keywords.length; i++) {
            if (keywords[i].startsWith(search)) {
              startsWith = true;
            }
          }
          if (keywords.includes(search) === true || startsWith === true) {
            return true;
          } else {
            return false;
          }
        });
        console.log(result);
        console.log("here");
        setPosts(result);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function checkIfUserLoggedIn(){
    try {
        const { data, error } = await supabase.auth.getSession()
        if(error){
            throw error;
        } else if (data){
            console.log('post:')
            console.log(data)
            if(data.session === null){
                setIsLoggedIn(false)
            } else {
                setIsLoggedIn(true);
                const resp = await supabase.from('user').select('user_type').eq('id', data.session.user.id)
                if(resp.error){
                  throw resp.error
                } else if (resp.data){
                  console.log(resp.data[0].user_type)
                  if(resp.data[0].user_type === 'super'){
                    setCurUserSuper(true);
                  }
                }
            }
        }
    } catch (error){
        console.log(error);
    }
}

  useEffect(() => {
    // if not a user, then its a search term
    // const bool = getUser(searchData);
    setLoading(true);
    getUser(searchData).then((promise) => {
        if (promise === true) {
            setIsUserSearch(true);
            getUserPosts(searchData);
          } else if (promise === false) {
            console.log("we are here");
            getPosts(searchData);
          }
    }).then(() => {
        checkIfUserLoggedIn()
        setTimeout(() => setLoading(false), 500);
    });
    
  }, []);
  return !loading ? <div className="w-full min-h-[80vh] flex flex-col items-center mb-2">
      {user ? (
        <div className="w-5/12 h-fit rounded-lg mt-5 bg-white flex flex-col p-4">
          <div className="flex w-11/12">
            <div className="w-2/12">
              <Image
                width={70}
                height={70}
                className="rounded-full"
                src={user.avatar_url}
                preview={false}
              />
            </div>
            <div className="flex-col w-full">
              <div className="flex justify-between">
                <p className="text-2xl font-bold">{user.user_name}</p>
                <Dropdown menu={{ items }} >
                  <EllipsisOutlined className="text-2xl font-bold text-[#8C8C8C]" />
                </Dropdown>
              </div>
              <div className="flex gap-2 items-center text-[#7C7C7C]">
                <p className="text-base">{user.subscribers} subscribers</p>
                <Divider orientation="center" type="vertical" />
                <p className="text-base">{user.total_likes} likes</p>
                <Divider orientation="center" type="vertical" />
                <p className="text-base">{user.total_dislikes} dislikes</p>
              </div>
              <div className="w-full flex gap-4 mt-4">
                {/* Subscribe */}
                <Button
                  className="text-xl font-bold w-4/12 bg-[#4096FF] text-white flex justify-center items-center"
                  type="primary"
                  onClick={() => isLoggedIn === true ? console.log('logged') : navigate('/auth')}
                >
                  Subscribe
                </Button>
                {/* Report */}
                <Button
                  className="text-xl font-bold w-4/12 bg-[#F24E1E] text-white flex justify-center items-center"
                  type="primary"
                >
                  Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-5/12 mt-5 justify-center flex gap-3 flex-col">
        <p className="text-2xl font-bold">Messages</p>
        {posts.map((post) => {
          return (
            <div className="w-full h-48 min-h-full bg-white rounded-2xl">
              <Post
                message={post.message_content}
                pid={post.id}
                uuid={post.user_id}
              />
            </div>
          );
        })}
      </div>
    </div> : <Loading />
}
export default SearchResults;
