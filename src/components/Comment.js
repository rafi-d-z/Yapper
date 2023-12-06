import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Image } from "antd";

function Comment(props){
    const [user, setUser] = useState(null)
    const [comment, setComment] = useState('');

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
        const { commenterID, comment_content } = props;
        setComment(comment_content);
        getUser(commenterID);
    }, [])

    return user ?
        <div className="w-full flex gap-3 items-center">
            <Image className="rounded-full" width={40} height={40} src={user.avatar_url} preview={false} />
            <div className="flex-col">
                <p className="text-lg font-bold">{user.user_name}</p>
                <p>{comment}</p>
            </div>
        </div>
    :
    <></>
}
export default Comment;