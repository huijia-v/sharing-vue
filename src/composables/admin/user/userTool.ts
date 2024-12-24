export const addDateRange = (
	params: any,
	dateRange: any[],
	propName?: string
) => {
	const search = params
	search.params = typeof search.params === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
	dateRange = Array.isArray(dateRange) ? dateRange : []
	if (typeof propName === 'undefined') {
		search.params['beginTime'] = dateRange[0];
		search.params['endTime'] = dateRange[1];
	} else {
		search.params['begin' + propName] = dateRange[0];
		search.params['end' + propName] = dateRange[1];
	}
	return search
};

export const parseStrEmpty = (str: any) => {
	if (!str || str == 'undefined' || str == 'null') {
		return ''
	}
	return str
}


/**
 * 参数处理
 * @param {*} params  参数
 */
export const tansParams = (params: any) => {
	let result = ''
	for (const propName of Object.keys(params)) {
		const value = params[propName]
		const part = encodeURIComponent(propName) + '='
		if (value !== null && value !== '' && typeof value !== 'undefined') {
			if (typeof value === 'object') {
				for (const key of Object.keys(value)) {
					if (
						value[key] !== null &&
						value[key] !== '' &&
						typeof value[key] !== 'undefined'
					) {
						const params = propName + '[' + key + ']'
						const subPart = encodeURIComponent(params) + '='
						result += subPart + encodeURIComponent(value[key]) + '&'
					}
				}
			} else {
				result += part + encodeURIComponent(value) + '&'
			}
		}
	}
	return result
}
