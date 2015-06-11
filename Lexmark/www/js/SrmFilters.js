angular.module('SrmFilters', [])

.filter('comma', function() {
	return function(input) {
		if(input)
			return ""
		else
			return ","
	
	};
})


.filter('backslash', function() {
	return function(input) {
		return input ? '' : '/';
	};
});