$(document).ready(function () {
	$("#complaintStatus").on("change", () => {
		let action = $(this).val();
		console.log("action", action);

		const requestURL = `/admin/complaint/${action}/${action}`;
		console.log(requestURL);
		const idToSelect = `#actionButtonComplaint-${action}`;
		console.log(idToSelect);
		$(idToSelect).attr("href", requestURL);
	});
});
