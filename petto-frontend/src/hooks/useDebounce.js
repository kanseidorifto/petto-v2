import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';

export const useDebounce = (callback) => {
	const ref = useRef();

	useEffect(() => {
		ref.current = callback;
	}, [callback]);

	const debouncedCallback = useMemo(() => {
		const func = (...args) => {
			ref.current?.(...args);
		};

		return debounce(func, 700);
	}, []);

	return debouncedCallback;
};
