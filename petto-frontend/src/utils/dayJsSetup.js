import dayjs from 'dayjs';

// plugins
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/uk';

export const dayjsSetup = () => {
	dayjs.extend(utc);
	dayjs.locale('uk');
};
