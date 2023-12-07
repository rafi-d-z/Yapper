import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Image, Divider, Button } from "antd";
import Loading from "../components/Loading";
import Post from "../components/Post";

function SearchResults() {
  const location = useLocation();
  const searchData = location.state;
  const [user, setUser] = useState(null);
  const [isUserSearch, setIsUserSearch] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [myUser, setMyUser] = useState(null);

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

  const getMyUser = async (user_id) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select()
        .eq("id", user_id);
      if (error) {
        throw error;
      } else if (data) {
        setMyUser(data[0]);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
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
            if(data.session === null){
                setIsLoggedIn(false)
            } else {
                setIsLoggedIn(true);
            }
        }
    } catch (error){
        console.log(error);
    }
}

const handleSubscribe = async () => {

  try {
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscribers')
      .select()
      .match({user_i : myUser.id ,follow_id : user.id})

      
      if (subscriptionData.length > 0) {
        alert("You're Already Subscribed")
      }
      else {
        // we add the row and col
        
      const { error } = await supabase
      .from('subscribers')
      .insert({ user_id: myUser.id, follow_id: user.id })

      }
  } catch (error) {
    console.error('Error subscribing:', error);
    // Handle the error, show a message, etc.
    
  }; 

  
/*
  try {
    // if the fetch didnt find anything then we are good to add ti
  } catch (error) {
    console.error('Error subscribing:', error);
    // Handle the error, show a message, etc.
  }
  */
};

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
    if (setIsLoggedIn){
      console.log("logged in")
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          getMyUser(session?.user.id);
        }
        setMyUser(session?.user ?? null);
      })

    }
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
              <p className="text-2xl font-bold">{user.user_name}</p>
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
                  onClick={() => {
                    if (isLoggedIn) {
                      // Run the function for logged-in users
                      handleSubscribe();
                    } else {
                      // Redirect to the login page for non-logged-in users
                      navigate('/auth');
                    }
                  }}
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
                likes={post.likes}
                dislikes={post.dislikes}
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
