import { Input, InputProps } from '@mui/joy';
import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md'

type SearchBarProps = {
	value: string;
	onChange: (val: string) => void;
	delay?: number;
	placeholder?: string;
	inputProps?: InputProps;
};

export const SearchBar = ({
	value,
	onChange,
	delay = 300,
	placeholder = "Buscar...",
	inputProps = {},
}: SearchBarProps) => {
	const [localValue, setLocalValue] = useState(value);

	// debounce
	useEffect(() => {
		const handler = setTimeout(() => {
			onChange(localValue);
		}, delay);

		return () => clearTimeout(handler);
	}, [localValue, delay]);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	return (
		<Input
			value={localValue}
			onChange={(e) => setLocalValue(e.target.value)}
			placeholder={placeholder}
			startDecorator={<MdSearch />}
			sx={{ mb: 2, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
			{...inputProps}
		/>
	);
};
