import { Input, Select, Button } from 'antd';
//This is only the fuctionality, styling still needs to be done. Hence it is still incomplete
const { Search } = Input;

function Search() {

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
        <Option value="all">All</Option>  
        <Option value="text">Text Only</Option>
        <Option value="images">With Images</Option>
        <Option value="videos">With Videos</Option>
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

export default Search;
