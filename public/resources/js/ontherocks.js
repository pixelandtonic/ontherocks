var $loginLink = $('#loginLink');

$loginLink.on('click', function(event) {
	event.preventDefault();

	var $ul = $loginLink.closest('ul'),
		$loginForm = $('#loginForm').css({ display: 'block', top: -55 });

	$ul.animate({ top: 55 }, 'fast');
	$loginForm.animate({ top: 10 }, 'fast');
});
