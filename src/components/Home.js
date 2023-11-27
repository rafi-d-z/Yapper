import { Input, Card, Button, Image, Upload, Dropdown, Badge } from "antd";
import {
  FileImageFilled,
  PlayCircleFilled,
  PictureOutlined,
  FileGifOutlined,
  DownOutlined,
  SendOutlined,
  ClockCircleOutlined,
  ClockCircleFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Profile from "./Profile";
import Post from "./Post";
import User from "./User";
import getItem from "../utils/helper_functions";

const { TextArea } = Input;

function Home() {
  const [newMessage, setNewMessage] = useState(""); // Added state to store the text input value
  const [topThreePosts, setTopThreePosts] = useState([]); // Added state to store the top three messages
  const [topThreeUsers, setTopThreeUsers] = useState([]); // Added state to store the top three followed users
  const [newKeywords, setKeywords] = useState([]);
  const [newBalance, setBalance] = useState(0);
  // temp usuage
  const userId = "ed99729e-5d06-4717-8c8c-ada2f9df8df4"
  // props for upload for messages
  const props = {
    beforeUpload: (file) => {
      const isPNG = file.type === "image/png";
      if (!isPNG) {
        // message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const GIFprops = {
    beforeUpload: (file) => {
      // TO DO: check if this logic is correct bc pretty sure its not
      const isGIF = file.type === "image/gif";
      if (!isGIF) {
        // message.error(`${file.name} is not a GIF file`);
      }
      return isGIF || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };
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

  // This use Effect will fetch messages when the page loads, this will grab everything thats currently in the messages db and console log it for now
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase.from("message").select();

        if (error) {
          throw error;
        } else if (data) {
          getTopThreePosts(data);
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

    // Fetches the users balance based on userId at the top, sets it to new balance
    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
        .from('user')
        .select('account_balance')
        .eq('id', userId);
        if (error) {
          throw error;
        } else if (data) {
          setBalance(data[0].account_balance)
    
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
    fetchUsers();
    fetchBalance();
  }, []);
  
  // Handle post click, will first check the price of the message, then compare it to its balance
  // thats init at the beginning
  // if theres enough balance then it would post the message and update the users balance
  // as well as update the state variable so that the app also has the current balance

  const handlePostClick = async () => {
    console.log(newBalance)
    try{
      const message_total = (newMessage.split(' ').join('').length * 0.1).toFixed(2)

      if (newBalance- message_total > 0){

        const keyWordList = newKeywords.split(",").map((keyword) => keyword.trim())
        const { data: insertData, error: insertError } = await supabase
          .from("message")
          .insert([
            {
              user_id: userId,
              message_content: newMessage,
              message_type: "message",
              keywords: keyWordList,
            },


          ]);
          if (insertError) {
            throw insertError;
          } 

        const {data: updateData, data: updatError} = await supabase
          .from('user')
          .update({ account_balance: (newBalance - message_total).toFixed(2) })
          .eq('id', userId);
          if (updatError) {
            throw updatError;
          } 
          else  {
            setBalance((newBalance - message_total).toFixed(2))
          }
          
    }
      // If insufficent reroute, for now it warns the user
      else {
        alert('Warning: Insufficent Balance ')

      }

    // Clear the input field
    setNewMessage("");
    setKeywords("");
    }
    catch (error) {
      console.log(error)
    }
    };

  const handleInputChange  = (e) => {
    const value = e.target.value;
    setNewMessage(value);

  };
  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    // Split the input into an array of keywords (assuming they are comma-separated)
    const keywordsArray = value
    //console.log(keywordsArray.split(",").map((keyword) => keyword.trim()))
    setKeywords(keywordsArray)
  };

  return (
    <div className="min-h-[80vh] w-full flex justify-center">
      <div className="h-full mt-5 w-full flex justify-around">
        {/* left side (profile) */}
        <div className="w-3/12 h-fit bg-white rounded-2xl">
          <Profile />
        </div>
        {/* middle section (messages + create messages) */}
        <div className="w-5/12 max-h-[85vh] pr-3 overflow-y-scroll rounded-2xl">
          {/* {user !== null ? <div></div> : <div />} */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col justify-between py-4 items-center bg-white rounded-2xl h-33">
              <div className="flex justify-between w-11/12 gap-2">
                <Image
                  height={45}
                  width={45}
                  className="rounded-full"
                  preview={false}
                  src="https://i.pinimg.com/originals/d8/f5/2c/d8f52ce52985768ccac65f9550baf49e.jpg"
                />
                <Input
                  className="w-11/12"
                  placeholder="What do you want to share?"
                  value={newMessage}
                  onChange={handleInputChange}
                  
                />
                
              </div>

              <div className="flex justify-between py-2 w-11/12 gap-2 ">
                <p className="justify-center pt-1">Keywords:</p>
                <Input
                  className="w-11/12"
                  placeholder="Keywords: Fun, Operating Systems, Advanced FSM "
                  value={newKeywords}
                  onChange={handleKeywordsChange} // This will need to fire with the message above
                  
                />
                
              </div>

              <div className="flex justify-between w-11/12">
                <div className="flex justify-between w-3/12">
                  <Upload {...props}>
                    <Button
                      className="border-none shadow-none"
                      icon={<PictureOutlined />}
                    >
                      Photo
                    </Button>
                  </Upload>
                  <Upload {...GIFprops}>
                    <Button
                      className="border-none shadow-none"
                      icon={<FileGifOutlined />}
                    >
                      GIF
                    </Button>
                  </Upload>
                </div>
                <div className="w-fit">
                  <Dropdown.Button
                    icon={<DownOutlined />}
                    size="small"
                    menu={{ items }}
                    onClick={handlePostClick}
                  >
                    Submit
                  </Dropdown.Button>
                </div>
              </div>
            </div>
            {/* where messages will go */}
            {topThreePosts.map((post) => {
              //console.log(topThreePosts);
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
        <div className="w-3/12 flex flex-col gap-5 h-fit px-4 py-5 bg-white rounded-2xl">
          <p className="text-xl font-bold">Top Followed Users</p>
          <div className="flex w-full flex-col gap-5">
            {topThreeUsers.map((user) => {
              return (
                <User
                  uuid={user.id}
                  username={user.user_name}
                  subscribers={user.subscribers}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
