import Request from "../components/Request";

function Requests(){
    return(
        <div className="w-full min-h-[80vh] flex justify-center">
            <div className="w-5/12 flex flex-col gap-8 bg-white rounded-2xl mt-4">
                <p className="text-2xl w-11/12 mx-auto font-bold mt-4">Account Requests</p>
                <div className="flex flex-col gap-4 justify-center w-11/12 mx-auto">
                    <Request uuid={'5d97b683-6990-41ec-b9a1-f12eeb01e779'} requestID={null} />
                </div>
            </div>
        </div>
    )
}
export default Requests;