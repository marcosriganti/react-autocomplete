import {useEffect, useState} from 'react';
import './App.css';
import Autocomplete, {AutoCompleteOption} from './components/Autocomplete';
import Logo from './assets/logo.svg';

const THRESHOLD_SEARCH = 1500;
const API_URL = 'https://api.jikan.moe/v4/anime';
type Anime = {
  id: string;
  title: string;
  score: number;
};



const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
};

// Format the data to be used in the autocomplete
const parseData = (data: Anime[]) => {
  const list = data.map(item => ({
    label: `${item.title} ${item.score ? `- ${item.score}/10` : ''} `,
    value: item.id
  }));
  return list;
};



function App() {
  // Fetch Data - Copy of Deel response from https://www.deel.com/es/global-hiring-guide
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<AutoCompleteOption | null>(null);
  const [value, setValue] = useState('');
  const debounceValue = useDebounce(value, THRESHOLD_SEARCH);

  // Cache the data to avoid making requests for the same value
  const [cache, setCache] = useState<{[key: string]: Anime[];}>({});
  useEffect(() => {
    // This way we avoid making a request for every key stroke
    if (value.length < 3 || debounceValue.length < 3) return;

    // If we already have this partial, we can avoid the debounce wait
    if (cache[value]) {
      setOptions(parseData(cache[value]));
      return;
    }
    // If debounce is completed we check if we have the data in the cache
    if (cache[debounceValue]) {
      setOptions(parseData(cache[debounceValue]));
      return;
    }
    // In case of not having the data we fetch it
    fetchData(debounceValue).then((response) => {
      setCache({...cache, [debounceValue]: response.data});
      setOptions(parseData(response.data));
    });

  }, [debounceValue, value]);

  const fetchData = async (q: string) => {
    let response;
    try {
      response = await fetch(`${API_URL}?q=${q}`);
    } catch (error) {
      console.log('something went wrong', error);
    }
    return response?.json();
  };

  const handleChange = async (val: string) => {
    await setValue(val.trim());
    // Clear the options if the input is empty
    if (val.length === 0) {
      setOptions([]);
    }
  };
  const isLoading = value !== debounceValue;
  return (
    <div className="wrapper">
      <div className='container'>
        <img src={Logo} alt='Deel Company logo' width={50} />
        <h3>Data Fetch Async from Real API</h3>
        <h2>Would you like to watch anime? Let's find out whats out there</h2>
        <Autocomplete
          placeholder='Enter the amazing anime name'
          className='input'
          options={options}
          loading={isLoading}
          onOptionSelect={(option) => {
            setSelectedOption(option);
          }}
          onChange={handleChange}
        />
        {selectedOption && <p>You have selected <strong>{selectedOption.label}</strong></p>}
      </div>
    </div>
  );
}

export default App;
