import { Input, Card, Button } from "antd";
import { FileImageFilled, PlayCircleFilled } from "@ant-design/icons";

const { TextArea } = Input; 

function Home() {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="w-8/12 h-full">
                <Card className="w-full h-52 border border-slate-200 drop-shadow mt-7">
                <div className="w-full h-full flex flex-col gap-10 justify-center">
                    <TextArea className="w-full h-24 resize-none" placeholder="Whats happening?..." showCount maxLength={100} />
                    <div className="flex justify-between w-full">
                    <div className="flex w-2/12 gap-2">
                        <Button className="border-none" icon={<FileImageFilled />} />
                        <Button className="border-none" icon={<PlayCircleFilled />} />
                    </div>
                    <Button className="px-5 bg-[#4096FF] text-white font-bold">Post</Button>
                    </div>
                </div>
                </Card>
            </div>
        </div>
    )
}
export default Home;