import { useEffect, useState } from "react";
import Request from "../components/Request";
import Loading from "../components/Loading";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

function Requests(){
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getRequests(){
        try{
            const { data, error } = await supabase.from("requests").select();
            if(error){
                throw error
            } else if (data){
                console.log(data)
                setRequests(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        getRequests().then(() => setTimeout(() => setLoading(false), 500))
    }, [])

    return loading ? <Loading /> : <div className="w-full min-h-[80vh] flex justify-center">
            <div className="w-5/12 flex flex-col gap-8 bg-white rounded-2xl mt-4">
                <p className="text-2xl w-11/12 mx-auto font-bold mt-4">Account Requests</p>
                <div className="flex flex-col gap-4 justify-center w-11/12 mx-auto">
                    {requests.map((request) => {
                        return <Request uuid={request.uuid} requestID={request.id} />
                    })}
                </div>
            </div>
        </div>
}
export default Requests;