$(document).ready(function () {
	let phase1 = $("#productCreate_1");

	phase1.submit((event) => {
		event.preventDefault();

		let phase1ErrorDiv = $("#phase1-error-div");
		phase1ErrorDiv.empty();

		let productName = $("productName").val();
		productName = productName.trim();
		if (productName.length <= 0) {
			phase1ErrorDiv.append("<p>You must provide a product name</p>");
			return;
		}
	});

	let phase2 = $("#productCreate_2");

	phase2.submit((event) => {
		let allowSubmit = true;
		// event.preventDefault();
		let phase2ErrorDiv = $("#phase2-error-div");

		let productDescription = $("#productDescription").val();
		let productCondition = $("#productCondition").val();
		let productSerialNumber = $("#productSerialNumber").val();
		let productSupportedConsole = $("#productSupportedConsole").val();
		let productAskingPrice = $("#productAskingPrice").val();

		productDescription = productDescription.trim();
		productCondition = productCondition.trim();
		productSerialNumber = productSerialNumber.trim();
		// productSupportedConsole = productSupportedConsole.trim();

		if (productCondition.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product condition");
			allowSubmit = false;
		}
		if (productDescription.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product description");
			allowSubmit = false;
		}
		if (productSerialNumber.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product serial number");
			allowSubmit = false;
		}
		// if (productSupportedConsole.length === 0) {
		// 	phase2ErrorDiv.append("<p>You must provide product supported console");
		// 	return;
		// }
		if (productAskingPrice <= 0) {
			phase2ErrorDiv.append("<p>Product Asking Price can not be less than 0");
			allowSubmit = false;
		}

		if (!allowSubmit) {
			event.preventDefault();
			allowSubmit = true;
		}
	});
	$("#productSupportedConsole").change(function() {

		let selectedConsole = $(this).val();


		$.ajax({
			method: 'GET',
			url: `/metric/getMetrics/${selectedConsole}`,
			success: function(res){
				let averagePrice = res.averagePrice.toFixed(2);
				$('#average-price-text').html(`$${averagePrice}`);
			},
			error: function(xhr){
				const errorJSON = JSON.parse(xhr.responseText);
				$('#average-price-text').html(errorJSON.error);
			}
		})
	});
});
