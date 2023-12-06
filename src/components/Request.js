import { useEffect, useState } from "react";
import { supabase, supabaseAdmin } from "../utils/supabaseClient";
import { Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function Request(props){
    const [user, setUser] = useState(null);
    const [userEmail, setUserEmail] = useState(null)
    const [requestID, setRequestID] = useState(null)

    const getUser = async (user_id) => {
        try {
            const { data, error } = await supabaseAdmin.auth.admin.getUserById(user_id)
          if (error) {
            throw error;
          } else if (data) {
            console.log(data)
            setUserEmail(data.user.email);
            const resp = await supabase.from("user").select().eq("id", user_id)
            if (resp.error){
                throw error;
            } else if (resp.data){
                setUser(resp.data[0]);
            }
          } else {
            console.log("found nothing");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
    useEffect(() => {
       const { uuid, requestID } = props;
       getUser(uuid).then(() => setRequestID(requestID))
    }, [])

    return user ? <div className="w-full h-16 flex rounded-xl justify-between px-4 bg-[#F0F0F0] items-center">
            <div className="flex flex-col">
                <p className="text-xl font-bold">{user.user_name}</p>
                <p className="#7C7C7C">{userEmail}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-xl font-bold">Type</p>
                <p className="text-[#7C7C7C]">{user.user_type}</p>
            </div>
            <div className="flex gap-2">
                <Button icon={<CheckOutlined />} />
                <Button icon={<CloseOutlined />} />
            </div>
        </div>
 : <></>
}
export default Request;