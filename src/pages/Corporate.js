import { Card, Input, Select, Button, Form, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";const { TextArea } = Input; 


// need to get the users balance off of rip, i think it might already be held in another page but im unsure if its saved


function CorporatePage(){
    const [posting, setPosting] = useState({jobTitle: '', company: '', location: '', type: 'Full-time', attachment: null});
    const [ad, setAd] = useState({headline: '', adText: '', attachment: null});
    const [Balance, setBalance] = useState(0)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    
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

      const postJob = async () =>{
        
        // todo send to new table
        const { data: insertData, error: insertError } = await supabase
          .from("post")
          .insert([
            {
              user_id: user.id,
              jobTitle: posting.jobTitle,
              company: posting.company,
              location: posting.location,
              type: posting.type,
            },


          ]);
          if (insertError) {
            throw insertError;
          }
          setPosting({ jobTitle: '', company: '', location: '', type: 'Full-time', attachment: null }); 
    }

    const postAd = async () =>{      
        const { data: insertData, error: insertError } = await supabase
          .from("ad")
          .insert([
            {
              user_id: user.id,
              headline: ad.headline,
              adText: ad.adText,
            },

          ]);
          if (insertError) {
            throw insertError;
          }
          setAd({headline: '', adText: '', attachment: null}) 

    }
    // props for upload file
    const props = {
        name: 'file',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };

      const setUp = async () => {
        setUser(getUser());
      }

      useEffect(() => {
        setLoading(true);
        // Redundant code used in other components
        // TODO: put this code in helper_functions.js to reduce overall code and readability
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          if (session?.user) {
            getUser(session?.user.id);
          }
          setUser(session?.user ?? null);
        });
        setUp().then(() => {
          // give loading animation time to actually display by displaying it for 2 seconds after the data is fetched
          setTimeout(() => setLoading(false), 2000);
        })
      }, []);

    return (
        <div className="grid w-11/12 h-fit mx-auto grid-cols-2 mt-5 mb-5">
            <div className="col-span-1 flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                    <p className="text-xl font-bold">Create Job Posting</p>
                    <Card className="w-11/12 border border-slate-200 drop-shadow">
                        <div className="w-full flex flex-col gap-4">
                            <Form className="flex flex-col font-medium" layout="vertical">
                                <Form.Item className="flex flex-col gap-1" label={'Job Title'}>
                                    <Input placeholder="Add the title you are hiring for"  value={posting.jobTitle} onChange={(e) => setPosting({...posting, jobTitle: e.target.value})} />
                                </Form.Item>
                                <Form.Item className="flex flex-col gap-1" label={'Company'}>
                                    <Input placeholder="Enter Company name" value={posting.company} onChange={(e) => setPosting({...posting, company: e.target.value})} />
                                </Form.Item>
                                <Form.Item className="flex flex-col gap-1" label={'Job Location'}>
                                    <Input placeholder="Add the location"  value={posting.location} onChange={(e) => setPosting({...posting, location: e.target.value})} />
                                </Form.Item>
                                <Form.Item className="flex flex-col gap-1 w-48" label={'Job Type'}>
                                    <Select defaultValue={'Full-time'} value={posting.type} onSelect={(value) => setPosting({...posting, type: value})} options={[
                                        { value: 'full-time', label: 'Full-time' },
                                        { value: 'part-time', label: 'Part-time' },
                                        { value: 'contract', label: 'Contract' },
                                        { value: 'internship', label: 'Internship' },
                                    ]} />
                                </Form.Item>
                                <div className="flex justify-between">
                                    {/* TO DO: Workout the logic of the upload feature once DB is setup */}
                                    <Upload {...props}>
                                        <Button className="px-2" icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                    <Button type="primary" className="px-5 bg-[#4096FF] text-white font-bold" onClick={postJob}>Post</Button>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </div>
                <div className="flex flex-col gap-5">
                    <p className="text-xl font-bold">Create Ad</p>
                    <Card className="w-11/12 border border-slate-200 drop-shadow">
                        <div className="w-full flex flex-col gap-4">
                            <Form className="flex flex-col font-medium" layout="vertical">
                                <Form.Item className="flex flex-col gap-1" label={'Headline'}>
                                    <Input placeholder="Add the headline of your ad" value={ad.headline} onChange={(e) => setAd({...ad, headline: e.target.value})} />
                                </Form.Item>
                                <Form.Item className="flex flex-col gap-1" label={'Primary Text'}>
                                    <TextArea placeholder="Add the primary text of your ad..." value={ad.adText} onChange={(e) => setAd({...ad, adText: e.target.value})} />
                                </Form.Item>
                                <div className="flex justify-between">
                                    {/* TO DO: Workout the logic of the upload feature once DB is setup */}
                                    <Upload {...props}>
                                        <Button className="px-2" icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                    <Button className="px-5 bg-[#4096FF] text-white font-bold" onClick={postAd}>Post</Button>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="col-span-1">
                <p className="text-xl font-bold">Past Job Postings</p>
                {/* Once DB is setup, get Job Postings of specific corporate user and display */}
            </div>
        </div>
    )
}
export default CorporatePage;