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
        <Card className="w-full h-fit border border-slate-200 drop-shadow mt-7">
          <div className="w-full h-full flex flex-col gap-5 justify-center">
            <Search 
              className="w-full h-fit resize-none"
              placeholder="Search keywords"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size='large'
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
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

}

export default SearchPage;