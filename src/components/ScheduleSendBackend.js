import { supabase } from "../utils/supabaseClient";
import { useState } from "react";

async function PostScheduled() {
    try{
        const{data: scheduledPosts, error: sourceError} = await supabase
        .from('scheduled')
        .select()
        .lte('post_at', new Date().toISOString())
        
        if(sourceError){
            throw sourceError;
        }


        const postScheduledPosts = scheduledPosts.map((post) => ({
            id: post.id,
            user_id: post.user_id,
            message_type: 'message',
            message_content: post.message_content,
            keywords: post.keywords,
            created_at: post.post_at
        }));
    
        const{error: insertError} = await supabase
        .from('message')
        .upsert(postScheduledPosts)

        if(insertError){
            throw insertError;
        }
    } catch(error){
        console.log(error.message);
    }
}

export default PostScheduled;