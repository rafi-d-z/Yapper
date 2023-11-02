import { Input, Select, Button } from 'antd';
import { useState } from 'react';
//This is only the fuctionality, styling still needs to be done. Hence it is still incomplete
const { Search } = Input;

function SearchPage () {

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = () => {
    // put search API here
  }

  return (
    <div>
      <Search 
        placeholder="Search keywords"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Select 
        defaultValue="all" 
        onChange={value => setFilter(value)}
      >
        <option value="all">All</option>  
        <option value="text">Text Only</option>
        <option value="images">With Images</option>
        <option value="videos">With Videos</option>
      </Select>

      <Button 
        type="primary"
        onClick={handleSearch}  
      >
        Search
      </Button>
    </div>
  )

}

export default SearchPage;
