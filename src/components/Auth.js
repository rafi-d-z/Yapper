import React, { useState } from 'react';
import { Input, Card, Button, Modal, Dropdown, Space } from "antd";
import { createClient } from '@supabase/supabase-js'
import { testSupabaseInsert } from '../App';
import  CreateAccount  from './CreateAccount'
// Import the `testSupabaseInsert` function here

const supabase = createClient('https://gopjsvqjoeoawvccsgax.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvcGpzdnFqb2VvYXd2Y2NzZ2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4OTQxNTQsImV4cCI6MjAxMjQ3MDE1NH0.1sT3E8bYnevWNP5VOpw7wExvzJa8SUSVm6AuFkL-BLQ')

function Auth() {

    // User logging In :
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // Define functions to handle input changes
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    // Define a function to handle the login button click
    const  handleLogin = async () => {
      // You can access the email and password values here
      console.log('Email: ', email);
      console.log('Password: ', password);
  
      // Perform your login logic here

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    }
    )
    if (error) {
      console.log(error)
  
    }
    if (data) {
      console.log(data)
    }
    setEmail('');
    setPassword('');
    };


  // Define the function to handle the button click
  const handleInsertClick = () => {
    testSupabaseInsert(); // Call the `testSupabaseInsert` function when the button is clicked
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-3/12 h-52 border border-slate-200 drop-shadow mt-7">
        <div className="w-11/12 h-full flex flex-col gap-4 justify-center border-slate-200 drop-shadow items-center">
          <input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            className="w-11/12 h-10 px-2"
            type="text"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button className="w-11/12 h-8 bg-[#52C41A] text-white font-bold" onClick={handleLogin}>
            Login
          </button>
          <p className='text-[#776BFF] font-italic'>Forgot Password?</p>
        </div>
      </div>
      <p className='text-black font-bold'>or</p>
      <CreateAccount />
      <p className='text-[#858585] font-normal'>
      By signing up, you agree to the
        <a href="https://twitter.com/en/tos" class='underline'> Terms of Service</a> and 
        <a href="https://twitter.com/en/privacy" class='underline'> Privacy Policy</a>, including
        <a href="https://help.twitter.com/en/rules-and-policies/x-cookies" class='underline'> Cookie Use.</a>
      </p>
    </div>
  );
  
}

export default Auth;
