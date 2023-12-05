// ViewJobsAdsPage.js
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import JobCard from '../components/JobCard';
import AdCard from '../components/AdCard';
import { supabase } from "../utils/supabaseClient";

function ViewJobsAdsPage() {
  // Use state to manage your feed data
  const [jobData, setJobData] = useState([]);
  const [adData, setAdData] = useState([]);

  // Simulate fetching job and ad data (replace this with your actual data fetching logic)
  useEffect(() => {
    // Simulate fetching job data (replace this with your actual data fetching logic)
    const fetchJobData = async () => {
      // Fetch job data from your database
      try {
        let { data: post, error } = await supabase
          .from('post')
          .select();
        if (error) {
          throw error;
        } else if (post) {
          setJobData(post);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Simulate fetching ad data (replace this with your actual data fetching logic)
    const fetchAdData = async () => {
      // Fetch ad data from your database
      try {
        let { data: post, error } = await supabase
          .from('ad')
          .select();
        if (error) {
          throw error;
        } else if (post) {
          setAdData(post);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobData();
    fetchAdData();
  }, []);

  return (
    <div className="grid w-11/12 grid-cols-2 gap-6 mt-5 mb-5 mx-auto">
      {/* Column for job cards */}
      <div className="flex flex-col gap-5">
        <p className="text-xl font-bold">Jobs</p>
        <Card className="w-11/12 border border-slate-200 drop-shadow">
          <div className="w-full flex flex-col gap-4">
            {jobData.map(item => (
              <JobCard key={item.id} job={item} />
            ))}
          </div>
        </Card>
      </div>

      {/* Column for ad cards */}
      <div className="flex flex-col gap-5">
        <p className="text-xl font-bold">Ads</p>
        <Card className="w-11/12 border border-slate-200 drop-shadow">
          <div className="w-full flex flex-col gap-4">
            {adData.map(item => (
              <AdCard key={item.id} ad={item} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ViewJobsAdsPage;
