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
		event.preventDefault();
		let phase2ErrorDiv = $("#phase2-error-div");

		let productDescription = $("#productDescription").val();
		let productCondition = $("#productCondition").val();
		let productSerialNumber = $("#productSerialNumber").val();
		let productSupportedConsole = $("#productSupportedConsole").val();
		let productAskingPrice = $("#productAskingPrice").val();

		productDescription = productDescription.trim();
		productCondition = productCondition.trim();
		productSerialNumber = productSerialNumber.trim();
		productSupportedConsole = productSupportedConsole.trim();

		if (productCondition.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product condition");
			return;
		}
		if (productDescription.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product description");
			return;
		}
		if (productSerialNumber.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product serial number");
			return;
		}
		if (productSupportedConsole.length === 0) {
			phase2ErrorDiv.append("<p>You must provide product supported console");
			return;
		}
		if (productAskingPrice <= 0) {
			phase2ErrorDiv.append("<p>Product Asking Price can not be less than 0");
			return;
		}
	});
});
