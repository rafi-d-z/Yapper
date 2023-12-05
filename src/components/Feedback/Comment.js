import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Modal, Button, Input } from "antd";
import { supabase } from "../../utils/supabaseClient";
import { CommentOutlined } from "@ant-design/icons";

function Comment(props) {
  const [countComments, setCountComments] = useState(0);
  const [postID, setPostID] = useState('')
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  async function getCommentCount(pid){
    try {
        const { data, error } = await supabase
          .from("comment")
          .select()
          .eq("message_id", pid);
        // set the amount of likes the post has to state variable
        if (error) {
          throw error;
        } else if (data) {
          setCountComments(data.length);
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    const { curUser, pid } = props;
    setUser(curUser);
    getCommentCount(pid);
    setPostID(pid);
  }, [])

  return (
    <div>
      <Badge
        // TO DO: Update to show the number of comments under post
        count={countComments}
        showZero={true}
        offset={[8, 0]}
        size="small"
        color="#F0F0F0"
        onClick={() => navigate("/post", {state: postID})}
        style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
        className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
      >
        <CommentOutlined className="text-xl" />
        <p className="text-sm font-bold">Comments</p>
      </Badge>
    </div>
  );
}

export default Comment;
