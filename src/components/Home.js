import { Input, Card, Button } from "antd";
import { FileImageFilled, PlayCircleFilled } from "@ant-design/icons";
import Post from "./Post";
import User from "./User";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

const { TextArea } = Input; 

function Home() {
    const [topThreePosts, setTopThreePosts] = useState([]);
    const [topThreeUsers, setTopThreeUsers] = useState([]);

    const getTopThreePosts = (data) => {
        data.forEach(obj => {
            obj.difference = obj.likes - obj.dislikes;
          });
          // Sort the objects based on the difference in descending order
          data.sort((a, b) => b.difference - a.difference);
          // Get the top 3 objects with the highest differences
          const top3 = data.slice(0, 3);
          setTopThreePosts(top3);
    }

    const getTopThreeUsers = (data) => {
        // TO DO: Will have to change in the future for actual requirements of Trendy User
        data.forEach(obj => {
            obj.difference = obj.total_likes - obj.total_dislikes;
          });
          // Sort the objects based on the difference in descending order
          data.sort((a, b) => b.difference - a.difference);
          // Get the top 3 objects with the highest differences
          const top3 = data.slice(0, 3);
          setTopThreeUsers(top3);
    }

    const getData = async () => {
        try
        {
          // fetching all messages from supabase
          const resp = await supabase
            .from("message")
            .select();
          // fetching all users from supabase
          const resp2 = await supabase.from('user').select();
          // if either have an error, throw an error
          if(resp.error || resp2.error){
            throw resp.error ? resp.error : resp2.error
          } else {
            getTopThreePosts(resp.data);
            getTopThreeUsers(resp2.data);
          }
        } catch (error) {
          console.log(error)
        }
    };

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="w-8/12 h-full flex flex-col gap-7">
                <Card className="w-full h-52 border border-slate-200 drop-shadow mt-7">
                    <div className="w-full h-full flex flex-col gap-10 justify-center">
                        <TextArea className="w-full h-24 resize-none" placeholder="Whats happening?..." showCount maxLength={100} />
                        <div className="flex justify-between w-full">
                        <div className="flex w-2/12 gap-2">
                            <Button className="border-none" icon={<FileImageFilled />} />
                            <Button className="border-none" icon={<PlayCircleFilled />} />
                        </div>
                        {/* TODO: give condition if user is not signed in, pressing this button (and others) will redirect with login screen */}
                        <Button className="px-5 bg-[#4096FF] text-white font-bold">Post</Button>
                        </div>
                    </div>
                </Card>
                <div className="flex flex-col gap-3">
                    <p className="text-2xl font-bold text-[#4096FF]">Top Trendy Users</p>
                    {/* TO DO: Add Trendy Users here */}
                    <div className="flex flex-wrap gap-4 justify-between">
                        {topThreeUsers.map((user) => {
                            return (
                                <User uuid={user.id} username={user.user_name} subscribers={user.subscribers} />
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-2xl font-bold mb-5 text-[#4096FF]">Most Liked Messages</p>
                    {/* TO DO: Add Trendy posts here from DB */}
                    <div className="flex flex-col gap-4 mb-5">
                        {/* <Post message="I love Software Engineering!" likes={2} dislikes={4} uuid={'123'} /> */}
                        {topThreePosts.map((post) => {
                            return (
                                <Post message={post.message_content} likes={post.likes} dislikes={post.dislikes} pid={post.id} uuid={post.user_id} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;