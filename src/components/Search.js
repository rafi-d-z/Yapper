import React from 'react';
import { Button } from 'antd'; 
import { testSupabaseInsert } from '../App';
// Import the `testSupabaseInsert` function here

function Search() {
  // Define the function to handle the button click
  const handleInsertClick = () => {
    testSupabaseInsert(); // Call the `testSupabaseInsert` function when the button is clicked
  };

  return (
    <div>
      <h1>Search Component</h1>
      <Button onClick={handleInsertClick}>Insert Data into Supabase</Button>
    </div>
  );
}

export default Search;
