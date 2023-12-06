import { useLocation, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button, Image, Input, Divider } from "antd";
import { SendOutlined } from "@ant-design/icons";
import Loading from "../components/Loading";
import Comment from "../components/Comment";

function PostPage() {
  const location = useLocation();
  const searchData = location.state;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  async function getPost(pid) {
    try {
      const { data, error } = await supabase
        .from("message")
        .select()
        .eq("id", pid);
      if (error) {
        throw error;
      } else if (data) {
        setPost(data[0]);
        getComments(pid);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getComments(pid) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comment")
        .select()
        .eq("message_id", pid);
      if (error) {
        throw error;
      } else if (data) {
        setComments(data);
        setTimeout(() => setLoading(false), 500);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function postComment() {
    try {
      const { error } = await supabase.from("comment").insert([
        {
          commenter_id: user.id,
          comment_content: commentText,
          message_id: post.id,
        },
      ]);
      if (error) {
        throw error;
      }
      setCommentText("");
      getComments(post.id);
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
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost(searchData);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUser(session?.user.id);
      }
    });
  }, []);

  return post ? (
    <div className="flex flex-col w-full min-h-[80vh] items-center gap-8">
      <div className="w-5/12 bg-white rounded-2xl h-48 mt-5">
        <Post
          message={post.message_content}
          pid={post.id}
          uuid={post.user_id}
        />
      </div>
      <div className="w-5/12 bg-white rounded-2xl h-fit gap-4 py-4">
       {user ? <div className="flex w-11/12 mx-auto justify-between">
          <Image
            className="w-1/12 rounded-full"
            src={user.avatar_url}
            height={40}
            width={40}
            preview={false}
          />
          <Input
            className="w-10/12"
            placeholder="Type your comment here..."
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
          />
          <Button
            className="bg-[#4096FF] w-1/12 rounded-full flex items-center justify-center"
            style={{ width: "40px", height: "40px" }}
            icon={<SendOutlined className="text-white" />}
            onClick={postComment}
          />
        </div> : <></>}
        <Divider className="w-11/12 mx-auto" />
        <div className="w-11/12 mx-auto flex flex-col gap-4">
          {loading ? (
            <Loading />
          ) : (
            comments.map((comment) => {
              return (
                <Comment
                  commenterID={comment.commenter_id}
                  comment_content={comment.comment_content}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
export default PostPage;
