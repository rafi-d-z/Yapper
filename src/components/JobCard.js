// JobCard.js
// JobCard.js
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const [corpBalanace, setCorpBalanace] = useState(0);

  const getCorpBalance = async (user_id) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select()
        .eq("id", user_id);
  
      if (error) {
        throw error;
      } else if (data) {
        setCorpBalanace(data[0].account_balance);
      } else {
        console.log("found nothing");
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const updateCorpBalance= async (user_id) => {
    try {
      const { error } = await supabase
        .from("user")
        .update({ account_balance: (corpBalanace - 0.10) })
        .eq("id", user_id);

      if (error) {
        throw error;
      } else {
        // If the update is successful, update the local state
        const newbal = (corpBalanace - 0.01);
        setCorpBalanace(newbal);
        console.log(newbal);
      }
    } catch (error) {
      console.error('Error updating corp balance:', error);
    }
  };
  const handleApplyClick = async () => {
    getCorpBalance(job.user_id);
    updateCorpBalance(job.user_id); // Wait for updateCorpBalance to complete
    
    setApplied(true);
  };

  useEffect(() => {
    getCorpBalance(job.user_id);
    }, []);
  
  return (
    <div className="mb-4 flex justify-between items-start">
      <div>
        <p className="font-bold">Job Posting</p>
        <p>Title: {job.jobTitle}</p>
        <p>Location: {job.location}</p>
        <p>Company: {job.company}</p>
        <p>Type: {job.type}</p>
        {/* Additional job details */}
      </div>
      <button
         className={`bg-blue-500 text-white font-bold py-2 px-4 rounded`}
         onClick={handleApplyClick}
         disabled={applied}
 
      >
        {applied ? 'Applied' : 'Apply'}
      </button>
    </div>
  );
}

export default JobCard;
