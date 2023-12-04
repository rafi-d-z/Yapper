import { Badge,  Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { LikeOutlined, LikeFilled, DislikeOutlined, MoneyCollectOutlined, CommentOutlined, DislikeFilled } from "@ant-design/icons";

function Feedback(props){
    const [countLikes, setCountLikes] = useState(0);
    const [countDislikes, setCountDislikes] = useState(0)
    const [countComments, setCountComments] = useState(0)
    const [tipAmount, setTipAmount] = useState('');
    const {pid, uuid} = props;
    // pid is the post id of this post
    const [isLikeActive, setIsLikeActive] = useState(false);
    const [isDislikeActive, setIsDislikeActive] = useState(false);
    const [isTipActive, setIsTipActive] = useState(false);
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState();
    const [recipientBalance, setRecipientBalance] = useState();
    const [recipientTip, setRecipientTip] = useState();

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

    const getPoster = async () =>{
        try{
            let { data: post, error } = await supabase
            .from('user')
            .select()
            .eq('id', uuid)
            if(error){
                throw error;
            }
            console.log(post[0].account_balance)
            setRecipientBalance(post[0].account_balance)
            console.log(recipientBalance)
            setRecipientTip(post[0].tips)
        } catch (error) {
            console.log(error)
        }
    }

    const openTipPanel = () => {
        setIsTipActive(true);
    };

    const closeTipPanel = () => {
        setIsTipActive(false);
        setTipAmount()
    };
    const handleTipAmountChange = (e) => {
        setTipAmount(e.target.value);
      };

    const tipUser = async () => {
        const parsedTipAmount = parseFloat(tipAmount);
        if (!isNaN(parsedTipAmount)) {
        if (balance  >= tipAmount){
           // Decrement user balance 

            try{
                let { data: post, error } = await supabase
                .from('user')
                .update({ account_balance: (balance - parsedTipAmount) })
                .eq('id', user.id);
                if(error){
                    throw error;
                } else {
                    setBalance(balance - parsedTipAmount)
                }
            } catch (error) {
                console.log(error)
            }

        
        // increment the new user's balance and their tips
        try{
            let { data: post, error } = await supabase
            .from('user')
            .update({ account_balance: (recipientBalance + parsedTipAmount), tips: (recipientTip + parsedTipAmount) })
            .eq('id', uuid);
            if(error){
                throw error;
            } else {
                setBalance(balance - parsedTipAmount)
                setRecipientBalance(recipientBalance + parsedTipAmount)
                setRecipientTip(recipientTip + parsedTipAmount)
            }
        } catch (error) {
            console.log(error)
        }
        }    
        else{
            alert("Warning: Insufficent Balance")
        }
    }
    else{
        alert("Invalid Tip Amount. Please enter a valid number.");
    }

    // send to the users tip jar
    // using the pid find the uuid of posting user

    closeTipPanel();
    };
    // add function here, if a user clicks on tip it will use the pid to search for the 
    // in the post table, then grab that users id.
    // from that users id i can find his table on users
    // update the tables as needed dec user balance inc recivers balance and tip 

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
                // set like active for UI
                setIsLikeActive(true);
                // increase like counter for UI
                setCountLikes(countLikes + 1)
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
                setIsDislikeActive(false);
                setCountDislikes(countDislikes - 1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const {countComments} = props;
        // setCountLikes(countLikes);
        setCountComments(countComments);
        // check if post is liked
        checkIfLiked()
        checkIfDisliked()
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              getUser(session?.user.id);
            }
            setUser(session?.user ?? null);
          })
        getPoster()
        //setrecipientBalance(post.account_balance)
        //setrecipientTip(post.tips)

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
    <div className="flex gap-1 items-center p-1 hover:text-[#4096FF] hover:bg-[#F5F5F5] " onClick={openTipPanel}>
      <MoneyCollectOutlined className="text-xl text-[#FADB14] " />
      <p className="text-sm font-bold text-[#FADB14]">Tip</p>
      
    </div>
{/* Ant Design Modal for Tip */}
        <Modal
        title="Tip This Post!"
        visible={isTipActive}
        onCancel={closeTipPanel}
        footer={null} // You can customize the footer if needed
      >
        {/* Add your tip panel content here */}
        <p className="text-lg font-bold"></p>
          <p>Remember to be generous!</p>
          <Input className= "w-1/6" size="small"  placeholder="$0.00" value={tipAmount}
          onChange={handleTipAmountChange}/>
          <button className="font-bold text-[#4096ff] p-2" type='text' onClick={tipUser}>Tip</button>
      </Modal>

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