import { useEffect, useState } from "react";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
} from "@ant-design/icons";
import { Badge } from "antd";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

function LikesDislikes(props) {
  const [curUser, setCurUser] = useState(null);
  const [pid, setPid] = useState(null);
  const [posterID, setPosterID] = useState(null);

  const [countLikes, setCountLikes] = useState(0);
  const [isLikeActive, setIsLikeActive] = useState(false);

  const [countDislikes, setCountDislikes] = useState(0);
  const [isDislikeActive, setIsDislikeActive] = useState(false);

  const navigate = useNavigate();

  // Supabase like-related functions
  async function getTotalLikes(pid) {
    try {
      const { data, error } = await supabase
        .from("likes")
        .select()
        .eq("pid", pid);
      // set the amount of likes the post has to state variable
      if (error) {
        throw error;
      } else if (data) {
        setCountLikes(data.length);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkIfLiked(curUserID, pid) {
    try {
      // Check if the current user has liked this post
      const {data, error} = await supabase
        .from("likes")
        .select()
        .eq("user_id", curUserID)
        .eq("pid", pid);
      // Acquire the amount of likes this current post has
      if (error) {
        throw error;
      } else if (data) {
        // This means that the user has liked the post
        if (data.length > 0) {
          setIsLikeActive(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function like(curUserID, pid) {
    try {
      const { error } = await supabase
        .from("likes")
        .insert([{ user_id: curUserID, pid: pid }]);
      if (error) {
        throw error;
      } else {
        const { error } = await supabase
          .from("message")
          .update({ likes: parseInt(countLikes + 1) })
          .eq("id", pid);
        const totalLikeResp = await supabase
          .from("user")
          .select("total_likes")
          .eq("id", posterID);
        const resp = await supabase
          .from("user")
          .update({ total_likes: totalLikeResp.data[0].total_likes + 1 })
          .eq("id", posterID);
        if (error || resp.error || totalLikeResp.error) {
          throw error;
        }
        // increase like counter for UI
        setCountLikes(countLikes + 1);
        // set like active for UI
        setIsLikeActive(true);
        // if post is already disliked, we cant have the user liked and disliked the same post so we call helper undislike function
        if (isDislikeActive === true) {
          console.log("here");
          undislike(curUserID, pid);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function unlike(curUserID, pid) {
    try {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", curUserID)
        .eq("pid", pid);
      if (error) {
        throw error;
      } else {
        const { error } = await supabase
          .from("message")
          .update({ likes: parseInt(countLikes - 1) })
          .eq("id", pid);
        const totalLikeResp = await supabase
          .from("user")
          .select("total_likes")
          .eq("id", posterID);
        const resp = await supabase
          .from("user")
          .update({ total_likes: totalLikeResp.data[0].total_likes - 1 })
          .eq("id", posterID);
        if (error || resp.error || totalLikeResp.error) {
          throw error;
        }
        setIsLikeActive(false);
        setCountLikes(countLikes - 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Supabase dislike-related function
  async function getTotalDislikes(pid) {
    try {
      // Check how many dislikes the post has
      const { data, error } = await supabase
        .from("dislikes")
        .select()
        .eq("pid", pid);
      if (error) {
        throw error;
      } else if (data) {
        // set the amount of dislikes post has to state variable
        setCountDislikes(data.length);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkIfDisliked(curUserID, pid) {
    try {
      // Check if the user has disliked this post
      const { data, error } = await supabase
        .from("dislikes")
        .select()
        .eq("user_id", curUserID)
        .eq("pid", pid);

      if (error) {
        throw error;
      } else if (data) {
        // If this condition is true then the user has disliked the post
        if (data.length > 0) {
          setIsDislikeActive(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function dislike(curUserID, pid) {
    try {
      const { error } = await supabase
        .from("dislikes")
        .insert([{ user_id: curUserID, pid: pid }]);
      if (error) {
        throw error;
      } else {
        const { error } = await supabase
          .from("message")
          .update({ dislikes: parseInt(countDislikes + 1) })
          .eq("id", pid);
        const totalDislikeResp = await supabase
          .from("user")
          .select("total_dislikes")
          .eq("id", posterID);
        const resp = await supabase
          .from("user")
          .update({
            total_dislikes: totalDislikeResp.data[0].total_dislikes + 1,
          })
          .eq("id", posterID);
        if (error || resp.error || totalDislikeResp.error) {
          throw error;
        }
        setIsDislikeActive(true);
        setCountDislikes(countDislikes + 1);
        // If user has already liked post, must unlike it due to the constriction that user can't like and dislike same post
        if (isLikeActive === true) {
          unlike(curUserID, pid);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function undislike(curUserID, pid) {
    try {
      const { data, error } = await supabase
        .from("dislikes")
        .delete()
        .eq("user_id", curUserID)
        .eq("pid", pid);
      if (error) {
        throw error;
      } else {
        const { error } = await supabase
          .from("message")
          .update({ dislikes: parseInt(countDislikes - 1) })
          .eq("id", pid);
        const totalDislikeResp = await supabase
          .from("user")
          .select("total_dislikes")
          .eq("id", posterID);
        const resp = await supabase
          .from("user")
          .update({
            total_dislikes: totalDislikeResp.data[0].total_dislikes - 1,
          })
          .eq("id", posterID);
        if (error || resp.error || totalDislikeResp.error) {
          throw error;
        }
        setIsDislikeActive(false);
        setCountDislikes(countDislikes - 1);
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
        setCurUser(data[0]);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // curUser is user logged in, uuid is the id of the user who posted the post
    const { isUserLoggedIn, curUser, pid, uuid } = props;
    setPid(pid);
    setPosterID(uuid);
    getTotalLikes(pid)
    getTotalDislikes(pid);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
        return session?.user.id;
      } else {
        return null;
      }
    }).then(( promise ) => {
      console.log('promise:' + promise)
      if(promise !== null){
        // Error occurs here
        checkIfLiked(promise, pid);
        checkIfDisliked(promise, pid);
      }
    })
  }, []);

  return <div className="flex gap-12">
      <Badge
        count={countLikes}
        showZero={true}
        offset={[8, 0]}
        size="small"
        color="#F0F0F0"
        onClick={
          curUser !== null
            ? !isLikeActive
              ? () => like(curUser.id, pid)
              : () => unlike(curUser.id, pid)
            : () => {
              console.log(curUser)
              navigate("/auth")}
        }
        style={{
          color: isLikeActive ? "#4096FF" : "#8C8C8C",
          fontSize: "8px",
          fontWeight: "bold",
        }}
        className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
      >
        {isLikeActive ? (
          <LikeFilled className="text-xl text-[#4096FF]" />
        ) : (
          <LikeOutlined className="text-xl" />
        )}
        <p
          className={
            isLikeActive
              ? "text-sm font-bold text-[#4096FF]"
              : "text-sm font-bold"
          }
        >
          Likes
        </p>
      </Badge>
      <Badge
        count={countDislikes}
        showZero={true}
        offset={[8, 0]}
        size="small"
        color="#F0F0F0"
        onClick={
          curUser
            ? !isDislikeActive
              ? () => dislike(curUser.id, pid)
              : () => undislike(curUser.id, pid)
            : () => navigate("/auth")
        }
        style={{
          color: isDislikeActive ? "#ff7a45" : "#8C8C8C",
          fontSize: "8px",
          fontWeight: "bold",
        }}
        className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#ff7a45] hover:bg-[#F5F5F5]"
      >
        {isDislikeActive ? (
          <DislikeFilled className="text-xl text-[#ff7a45]" />
        ) : (
          <DislikeOutlined className="text-xl" />
        )}
        <p
          className={
            isDislikeActive
              ? "text-sm font-bold text-[#ff7a45]"
              : "text-sm font-bold"
          }
        >
          Dislikes
        </p>
      </Badge>
    </div>
  ;
}
export default LikesDislikes;
