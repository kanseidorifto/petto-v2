export function formatYears(years) {
	const lastDigit = years % 10;
	const lastTwoDigits = years % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return `${years} років`;
	} else {
		switch (lastDigit) {
			case 1:
				return `${years} рік`;
			case 2:
			case 3:
			case 4:
				return `${years} роки`;
			default:
				return `${years} років`;
		}
	}
}
