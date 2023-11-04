import { Input, Select, Button, Card } from 'antd';
import { useState } from 'react';
const { Search } = Input;

function SearchPage () {

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = () => {
    // put search API here
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-8/12 h-full">
        <Card className="w-full h-52 border border-slate-200 drop-shadow mt-7">
          <div className="w-full h-full flex flex-col gap-10 justify-center">
            <Search 
              className="w-full h-24 resize-none"
              placeholder="Search keywords"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex justify-between w-full">
            <Select 
              className="flex w-2/12 gap-2"
              defaultValue="all" 
              onChange={value => setFilter(value)}
            >
              <option value="all">All</option>  
              <option value="text">Text Only</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
            </Select>

            <Button 
              className="px-5 bg-[#4096FF] text-white font-bold"
              onClick={handleSearch}  
            >
              Search
            </Button>
            </div>
            
          </div>
        </Card>
      </div>
    </div>
  )

}

export default SearchPage;
