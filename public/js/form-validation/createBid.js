$(document).ready(function () {
    let bidForm = $('#bid-form');
    // console.log('test');
    bidForm.submit(function (event) {
        event.preventDefault();
        let errorDiv = $('#create-bid-errors');
        errorDiv.empty();

        let bidAmount = $('#bid-amount').val();
        // get the product id from the url
        let currentPath = window.location.href;
        let url = new URL(currentPath);
        let segments = url.pathname.split('/');
        let productId = segments[segments.length - 1];
        console.log('Bid amount', bidAmount);
        console.log('productId', productId);
        
        if (!bidAmount) {
            errorDiv.append('<p>You must provide a bid value</p>');
            return;
        }
        if (typeof (bidAmount) !== 'string') {
            errorDiv.append('<p>Bid must be a string</p>');
            return;
        }
        else {
            for (let i = 0; i < bidAmount.length; i++) {
                const char = bidAmount[i];
                if ((char < '0' || char > '9') && char !== '.') {
                    errorDiv.append('<p>Bid Must be a dollar ammount.</p>');
                    return;
                }
            }
        }
        if (parseFloat(bidAmount) <= 0 || parseFloat(bidAmount) > 999.99) {
            errorDiv.append('<p>Bid cannot be $0 or greater than $999.99</p>');
            return;
        }


        // send bid amount as an ajax request
        let bidRequest = {
            method: 'POST',
            url: '/bid/createBid',
            contentType: 'application/json',
            data: JSON.stringify({ bidAmount: bidAmount, productId: productId }),
            success: function (res) {
                let bidList = $('#bid-list');
                bidList.append(`<p>Bid Amount: ${res.bidAmount}</p>`);
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                const errorJSON = JSON.parse(xhr.responseText);
                errorDiv.empty();
                errorDiv.append(`<p>Error creating bid: ${errorJSON.error}</p>`);
            }
        }
        $.ajax(bidRequest)

    });
});