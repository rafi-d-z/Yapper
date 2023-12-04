import { Badge } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { LikeOutlined, LikeFilled, DislikeOutlined, MoneyCollectOutlined, CommentOutlined, DislikeFilled } from "@ant-design/icons";

function Feedback(props){
    const [countLikes, setCountLikes] = useState(0);
    const [countDislikes, setCountDislikes] = useState(0)
    const [countComments, setCountComments] = useState(0)
    const {pid, uuid} = props;
    const [isLikeActive, setIsLikeActive] = useState(false);
    const [isDislikeActive, setIsDislikeActive] = useState(false);
    
    // TO DO: When liking, update total_likes of user
    // ^ same with disliking

    async function checkIfLiked(){
        try{
            // Check if the current user has liked this post
            const resp1 = await supabase
            .from("likes")
            .select()
            .eq("user_id", uuid)
            .eq("pid", pid);
            // Acquire the amount of likes this current post has
            const resp2 = await supabase
            .from("likes")
            .select()
            .eq("pid", pid);
            if(resp1.error){
                throw resp1.error;
            } else if (resp2.error) {
                throw resp2.error;
            } else if(resp1.data && resp2.data) {
                // This means that the user has liked the post
                if(resp1.data.length > 0){
                    setIsLikeActive(true)
                }
                // set the amount of likes the post has to state variable
                setCountLikes(resp2.data.length);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function like(){
        try{
            const { error } = await supabase
            .from("likes")
            .insert([{user_id: uuid, pid: pid}])
            if(error){
                throw error;
            } else {
                const { error } = await supabase
                .from('message')
                .update({likes: parseInt(countLikes + 1)})
                .eq('id', pid)
                if( error ) {
                    throw error;
                }
                // increase like counter for UI
                setCountLikes(countLikes + 1)
                // set like active for UI
                setIsLikeActive(true);
                // if post is already disliked, we cant have the user liked and disliked the same post so we call helper undislike function
                if(isDislikeActive === true){
                    undislike();
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function unlike(){
        try{
            const { error } = await supabase
            .from("likes")
            .delete()
            .eq("user_id", uuid)
            .eq("pid", pid);
            if(error){
                throw error;
            } else {          
                const { error } = await supabase
                .from('message')
                .update({likes: parseInt(countLikes - 1)})
                .eq('id', pid)
                if (error){
                    throw error
                }
                setIsLikeActive(false);
                setCountLikes(countLikes - 1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function checkIfDisliked(){
        try{
            // Check if the user has disliked this post
            const resp1 = await supabase
            .from("dislikes")
            .select()
            .eq("user_id", uuid)
            .eq("pid", pid);
            // Check how many dislikes the post has
            const resp2 = await supabase
            .from("dislikes")
            .select()
            .eq("pid", pid);
            if(resp1.error){
                throw resp1.error;
            } else if (resp2.error) {
                throw resp2.error;
            } else if(resp1.data && resp2.data) {
                // If this condition is true then the user has disliked the post
                if(resp1.data.length > 0){
                    setIsDislikeActive(true)
                }
                // set the amount of dislikes post has to state variable
                setCountDislikes(resp2.data.length);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function dislike(){
        try{
            const { error } = await supabase
            .from("dislikes")
            .insert([{user_id: uuid, pid: pid}])
            if(error){
                throw error;
            } else {
                const { error } = await supabase
                .from('message')
                .update({dislikes: parseInt(countDislikes + 1)})
                .eq('id', pid)
                if( error ) {
                    throw error;
                }
                setIsDislikeActive(true);
                setCountDislikes(countDislikes + 1)
                // If user has already liked post, must unlike it due to the constriction that user can't like and dislike same post
                if(isLikeActive === true){
                    unlike();
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function undislike(){
        try{
            const { data, error } = await supabase
            .from("dislikes")
            .delete()
            .eq("user_id", uuid)
            .eq("pid", pid);
            if(error){
                throw error;
            } else {
                const { error } = await supabase
                .from('message')
                .update({dislikes: parseInt(countDislikes - 1)})
                .eq('id', pid)
                if( error ) {
                    throw error;
                }
                setIsDislikeActive(false);
                setCountDislikes(countDislikes - 1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function checkIfUserLoggedIn(){
        try {
            const { data, error } = await supabase.auth.getSession()
            if(error){
                throw error;
            } else if (data){
                if(data.session === null){
                    return false;
                } else {
                    return true;
                }
            }
        } catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        // check if user is logged in before performing these
        checkIfUserLoggedIn().then((promise) => {
            if(promise === true){
                const {countComments} = props;
                // setCountLikes(countLikes);
                setCountComments(countComments);
                // check if post is liked
                checkIfLiked()
                checkIfDisliked()
            } else {
                const {countComments} = props;
                setCountComments(countComments);
            }
        })
       
    }, [])

    return (
        <div className="flex w-11/12 mx-auto items-center gap-12">
        <Badge
            count={countLikes}
            showZero={true}
            offset={[8, 0]}
            size="small"
            color="#F0F0F0"
            onClick={!isLikeActive ? like : unlike}
            style={{ color: isLikeActive ? "#4096FF" : "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
            className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
          >
            {isLikeActive ? <LikeFilled className="text-xl text-[#4096FF]" /> : <LikeOutlined className="text-xl" />}
            <p className={isLikeActive ? "text-sm font-bold text-[#4096FF]" : "text-sm font-bold"}>Likes</p>
        </Badge>
        <Badge
        count={countDislikes}
        showZero={true}
        offset={[8, 0]}
        size="small"
        color="#F0F0F0"
        onClick={!isDislikeActive ? dislike : undislike}
        style={{ color: isDislikeActive ? "#ff7a45" : "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
        className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#ff7a45] hover:bg-[#F5F5F5]"
      >
        {isDislikeActive ? <DislikeFilled className="text-xl text-[#ff7a45]" /> : <DislikeOutlined className="text-xl" />}
        <p className={isDislikeActive ? "text-sm font-bold text-[#ff7a45]" : "text-sm font-bold"}>Dislikes</p>
      </Badge>
    <div className="flex gap-1 items-center p-1">
      <MoneyCollectOutlined className="text-xl text-[#FADB14]" />
      <p className="text-sm font-bold text-[#FADB14]">Tip</p>
    </div>
    <Badge
      // TO DO: Update to show the number of comments under post 
      count={countComments}
      showZero={true}
      offset={[8, 0]}
      size="small"
      color="#F0F0F0"
      style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
      className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
    >
      <CommentOutlined className="text-xl" />
      <p className="text-sm font-bold">Comments</p>
    </Badge>
    </div>
    )
}

export default Feedback;