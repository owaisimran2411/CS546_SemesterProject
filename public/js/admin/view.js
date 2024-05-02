$(document).ready(function () {
	$(".myTable select").change(function () {
		// Find the closest row
		let action = $(this).val();
		let name = $(this).attr("name");

		const requestURL = `/admin/complaint/${name}/${action}`;
		const idToSelect = `#actionButtonComplaint-${name}`;
		$(idToSelect).attr("href", requestURL);
	});

	// $("#complaintStatus").on("change", () => {
	// 	console.log("action", action);

	// 	const requestURL = `/admin/complaint/${action}/${action}`;
	// 	console.log(requestURL);
	// 	const idToSelect = `#actionButtonComplaint-${action}`;
	// 	console.log(idToSelect);
	// 	$(idToSelect).attr("href", requestURL);
	// });
});
