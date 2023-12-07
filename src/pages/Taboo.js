import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { supabase } from "../utils/supabaseClient";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";


function Taboo(){
    const [loading, setLoading] = useState(true)
    const [tabooWords, setTabooWords] = useState([]);
    const [newWord, setNewWord] = useState('');
    const navigate = useNavigate();

    const getTabooWords = async () => {
        try{
            const { data, error } = await supabase.from("taboo_word").select();
            if(error){
                throw error
            } else if (data){
                setTabooWords(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTabooWord = async (id) => {
        try{
            const { error } = await supabase.from("taboo_word").delete().eq("id", id);
            if(error){
                throw error
            } else {
                navigate("/loading");
                setTimeout(() => {
                  navigate("/rules");
                }, 500);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addTabooWord = async (id) => {
        try{
            const { error } = await supabase.from("taboo_word").insert([{ word: newWord}]);
            if(error){
                throw error
            } else {
                setNewWord('');
                navigate("/loading");
                setTimeout(() => {
                  navigate("/rules");
                }, 500);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        getTabooWords().then(() => setTimeout(() => setLoading(false), 500))
    }, [])

    return loading ? <Loading /> : <div className="w-full min-h-[80vh] flex justify-center">
            <div className="w-5/12 flex flex-col gap-8 bg-white rounded-2xl mt-4">
                <p className="text-2xl w-11/12 mx-auto font-bold mt-4">Taboo Words</p>
                <div className="flex flex-col gap-4 justify-center w-11/12 mx-auto">
                    {tabooWords.map((taboo_word) => {
                        return (
                            <div className="flex gap-2 h-10 items-center">
                                {taboo_word.word}
                                <Button icon={<CloseOutlined />} onClick={() => deleteTabooWord(taboo_word.id)} />
                            </div>
                        )
                    })}
                    <div className="flex gap-2">
                        <Input value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="Add Taboo Word" />
                        <Button icon={<PlusOutlined />} onClick={addTabooWord} />
                    </div>
                </div>
            </div>
        </div>
}
export default Taboo;