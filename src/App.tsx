import {useEffect, useState} from 'react';
import './App.css';
import Autocomplete, {AutoCompleteOption} from './components/Autocomplete';
import useDebounce from './hooks/useDebounce';
import Logo from './assets/logo.svg';
import useQuery from './hooks/useQuery';

const THRESHOLD_SEARCH = 1500;
const API_URL = 'https://api.jikan.moe/v4/anime';

type Anime = {
  id: string;
  title: string;
  score: number;
};
type AnimeResponse = {
  data: Anime[];
};

// Format the data to be used in the autocomplete

const parseData = (data: Anime[]) => {
  if (!data) return [];
  const list = data.map((item) => ({
    label: `${item.title} ${item.score ? `- ${item.score}/10` : ''} `,
    value: item.id,
  }));
  return list;
};

function App() {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<AutoCompleteOption | null>(null);
  const [value, setValue] = useState('');
  const debounceValue = useDebounce(value, THRESHOLD_SEARCH);
  const {data, loading, error} = useQuery<AnimeResponse>(`${API_URL}?q=`, debounceValue);
  useEffect(() => {
    if (data) {
      setOptions(parseData(data.data));
    }
  }, [data]);

  const handleChange = async (val: string) => {
    await setValue(val.trim());
    // Clear the options if the input is empty
    if (val.length === 0) {
      setOptions([]);
    }
  };
  return (
    <div className='wrapper'>
      <div className='container'>
        <img src={Logo} alt='Deel Company logo' width={50} />
        <h3>Data Fetch Async from Real API</h3>
        <h2>Would you like to watch anime? Let's find out whats out there</h2>
        <Autocomplete
          placeholder='Enter the amazing anime name'
          className='input'
          options={options}
          loading={loading || value !== debounceValue}
          onOptionSelect={(option) => {
            setSelectedOption(option);
          }}
          onChange={handleChange}
        />
        {error && <p>{error}</p>}
        {selectedOption && (
          <p>
            You have selected <strong>{selectedOption.label}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
