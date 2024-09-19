import React, {useState, useRef} from 'react';
import './Autocomplete.css';
import Loading from './loading.svg';

type AutoCompleteOption = {
    label: string;
    value: string;
};

interface AutocompleteProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
    placeholder?: string;
    options: AutoCompleteOption[];
    value?: string;
    onOptionSelect?: (option: AutoCompleteOption | null) => void;
    onChange: (val: string) => void;
    loading?: boolean;
}

const Autocomplete = (props: AutocompleteProps) => {
    const {placeholder, options, onOptionSelect, onChange, loading, ...rest} = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const [suggestionsVisible, setSuggestionVisible] = useState<Boolean>(false);
    const [value, setValue] = useState<string>('');
    const [optionSelected, setOptionSelected] = useState<AutoCompleteOption | null>(null);

    const handleOnChange = (ev: React.FormEvent<HTMLInputElement>) => {
        setValue(ev.currentTarget.value);
        onChange && onChange(ev.currentTarget.value);
    };

    const handleSelect = async (option: AutoCompleteOption) => {
        await setOptionSelected(option || null);
        await setValue(option?.label.trim() || '');
        onOptionSelect && onOptionSelect(option || null);
        setSuggestionVisible(false);
    };

    const handleOnFocus = (ev: React.FocusEvent) => {
        setSuggestionVisible(true);
    };

    const handleKeyUp = (ev: React.KeyboardEvent, option?: AutoCompleteOption) => {
        if (ev.key === 'Escape') {
            setSuggestionVisible(false);
        }
        if (ev.key === 'Enter' && option) {
            handleSelect(option);
        }
    };

    const handleClick = async (ev: React.MouseEvent, option: AutoCompleteOption) => {
        ev.preventDefault();
        handleSelect(option);
    };

    const handleClear = () => {
        setValue('');
        inputRef.current?.focus();
        onOptionSelect && onOptionSelect(null);
        onChange && onChange('');
    };

    const renderOptions = (option: AutoCompleteOption, i: number) => {
        const regex = new RegExp(`(${value})`, 'gi');
        const parts = option.label.split(regex);
        return <li
            tabIndex={i + 3}
            key={option.value}
            onClick={ev => handleClick(ev, option)}
            onKeyUp={ev => handleKeyUp(ev, option)}
            role='option'
            className='autocomplete-option'>{parts.map((part, i) => (
                regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
            ))}</li>;
    };

    return <div className='autocomplete'>
        <input
            tabIndex={1}
            ref={inputRef}
            type="text"
            placeholder={placeholder ?? 'Start searching'}
            value={value}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onKeyUp={handleKeyUp}
            {...rest}
        />
        {value.length > 0 && <button className='autocomplete-close' onClick={handleClear}>+</button>}
        {(loading && value) && <div className='autocomplete-loading'><img src={Loading} alt='Loading options' /></div>}
        {suggestionsVisible && <div>
            {options.map(renderOptions).length > 0 && <ul className='autocomplete-list-options' role="combobox" tabIndex={2}>
                {options.map((option, i) => renderOptions(option, i))}
            </ul>}
        </div>}
    </div>;
};

export default Autocomplete;
export type {AutoCompleteOption};
