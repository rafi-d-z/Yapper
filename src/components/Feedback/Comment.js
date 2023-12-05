import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Modal, Button, Input } from "antd";
import { supabase } from "../../utils/supabaseClient";
import { CommentOutlined } from "@ant-design/icons";

function Comment() {
  const [countComments, setCountComments] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const openComment = () => {
    setIsCommentOpen(true);
  };

  const closeComment = () => {
    setIsCommentOpen(false);
  };

  const updateComment = (e) => {
    setComment(e.target.value);
  };

  const postComment = () => {
    console.log(comment);
    const commentResp = supabase.from("comment");
    commentResp.insert([
      {
        comment_content: comment,
      },
    ]);
  };

  return (
    <div>
      <Badge
        // TO DO: Update to show the number of comments under post
        count={countComments}
        showZero={true}
        offset={[8, 0]}
        size="small"
        color="#F0F0F0"
        onClick={user ? () => openComment : () => navigate("/auth")}
        style={{ color: "#8C8C8C", fontSize: "8px", fontWeight: "bold" }}
        className="flex gap-1 p-1 items-center rounded-md cursor-pointer text-[#8C8C8C] hover:text-[#4096FF] hover:bg-[#F5F5F5]"
      >
        <CommentOutlined className="text-xl" />
        <p className="text-sm font-bold">Comments</p>
      </Badge>
      <Modal
        open={isCommentOpen}
        onCancel={closeComment}
        footer={
          <Button
            onClick={postComment}
            className="font-bold text-[#4096ff]"
            type="text"
          >
            Comment
          </Button>
        }
      >
        {/* <Image
                height={45}
                width={45}
                className="rounded-full"
                preview={false}
                src={user.avatarUrl}
            />
            <p className="text-lg font-bold">{user.username}</p>
            <p>{message}</p>
            <br/>
            <br/> */}
        <Input onChange={updateComment} placeholder="Leave your thoughts!" />
      </Modal>
    </div>
  );
}

export default Comment;
