import { Input, Button, Image, Upload, Dropdown, Badge } from "antd";
import {
  PictureOutlined,
  FileGifOutlined,
  DownOutlined,
  SendOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Profile from "./Profile";
import Post from "./Post";
import User from "./User";
import { getItem } from "../utils/helper_functions";
import Loading from "./Loading";

function Trending() {
  const [loading, setLoading] = useState(true);

  const [topThreePosts, setTopThreePosts] = useState([]); // Added state to store the top three messages
  const [trendyPosts, setTrendyPosts] = useState([]); // Added state to store the top three messages
  const [topThreeUsers, setTopThreeUsers] = useState([]); // Added state to store the top three followed users
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [newBalance, setBalance] = useState();
  
  // items for dropdown on post creation button
  const items = [
    getItem(
      "Schedule Send",
      "schedule",
      <Badge
        offset={[0, 12]}
        count={
          <ClockCircleOutlined className="text-[#4096FF] text-xs overflow-hidden font-bold" />
        }
      >
        <SendOutlined className="text-[#4096FF] text-sm overflow-hidden" />
      </Badge>
    ),
  ];
  // following functions are for getting the top 3 of messages and user data
  const getTopThreePosts = (data) => {
    data.forEach((obj) => {
      obj.difference = obj.likes - obj.dislikes;
    });
    // Sort the objects based on the difference in descending order
    data.sort((a, b) => b.difference - a.difference);
    // Get the top 3 objects with the highest differences
    const top3 = data.slice(0, 3);
    setTopThreePosts(top3);
  };

  // function to get the trendy posts in desc order (likes - dislikes > 3 and views > 10)
  const getTrendyPosts = (data, minDifference = 3, minViews = 10, count = 10) => {
    data.forEach((obj) => {
      obj.difference = obj.likes - obj.dislikes;
    });
    const trendyPosts = data.filter((obj) => obj.difference > minDifference && obj.views > minViews);
    trendyPosts.sort((a, b) => b.difference - a.difference); // Sort the objects based on the difference in descending order
    const topTrendy = trendyPosts.slice(0, count);
  
    topTrendy.forEach((obj) => delete obj.difference);
  
    setTrendyPosts(topTrendy);
  };

  const getTopThreeUsers = (data) => {
    // TO DO: Will have to change in the future for actual requirements of Trendy User
    data.forEach((obj) => {
      obj.difference = obj.total_likes - obj.total_dislikes;
    });
    // Sort the objects based on the difference in descending order
    data.sort((a, b) => b.difference - a.difference);
    // Get the top 3 objects with the highest differences
    const top3 = data.slice(0, 3);
    setTopThreeUsers(top3);
  };

  // create a trendy posts function for selecting posts that :  >10 reads, #likes -#dislikes>3
  // implement logic to keep track of trendy user in db, and update 

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
        setBalance(data[0].account_balance)
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from("message").select();

      if (error) {
        throw error;
      } else if (data) {
        getTrendyPosts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("user").select();
      if (error) {
        throw error;
      } else if (data) {
        getTopThreeUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setUp = async () => {
    fetchMessages();
    fetchUsers();
    setUser(getUser());
  }

  // This use Effect will fetch messages when the page loads, this will grab everything thats currently in the messages db and console log it for now
  useEffect(() => {
    setLoading(true);
    // Redundant code used in other components
    // TODO: put this code in helper_functions.js to reduce overall code and readability
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getUser(session?.user.id);
      }
      setUser(session?.user ?? null);
    });
    setUp().then(() => {
      // give loading animation time to actually display by displaying it for 2 seconds after the data is fetched
      setTimeout(() => setLoading(false), 2000);
    })
  }, []);


  return (!loading ?
    <div className="min-h-[80vh] w-full flex justify-center">
      <div className="h-full mt-5 w-full flex justify-around">
        {/* middle section (messages + create messages) */}
        <div className="w-5/12 max-h-[85vh] pr-3 overflow-y-scroll rounded-2xl">
          {/* {user !== null ? <div></div> : <div />} */}
          <div className="flex flex-col gap-5">
            {/* where messages will go */}
            {trendyPosts.map((post) => {
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
        </div>
        {/* right section (top followed users + ads) */}
      </div>
    </div> : <Loading />
  );
}
export default Trending;
