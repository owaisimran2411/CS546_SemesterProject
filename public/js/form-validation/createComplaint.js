$(document).ready(function () {
	let complaintForm = $("#complaint-form");

	let currentPath = window.location.href;
	let url = new URL(currentPath);
	let segments = url.pathname.split("/");
	let sellerId = segments[segments.length - 1];
	complaintForm.action = "/complaint/createComplaintSeller/" + sellerId;

	complaintForm.submit(function (event) {
		let allowSubmit = true;

		let errorDiv = $("#create-complaint-errors-client");
		errorDiv.empty();

		let complaintMessage = $("#complaint-message").val();

		if (!complaintMessage) {
			errorDiv.append("<p>You must provide a complaint message</p>");
			allowSubmit = false;
		}
		complaintMessage = complaintMessage.trim();
		if (complaintMessage.length === 0) {
			errorDiv.append("<p>You must provide a complaint message</p>");
			allowSubmit = false;
		}

		if (!allowSubmit) {
			event.preventDefault();
			allowSubmit = true;
		}
	});
});
