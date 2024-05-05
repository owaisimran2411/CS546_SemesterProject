$(document).ready(function () {
    let registerForm = $('#register-form');

    registerForm.submit(function (event) {
        event.preventDefault();
        let errorDiv = $('#register-errors');
        errorDiv.empty();

        // check each text input for blank or missing inputs
        $('input[type="text"]').each(function () {
            let input = $(this).val();
            let id = $(this).attr('id');

            if (!input) {
                if ((errorDiv).is(':empty')) {
                    errorDiv.append(`<p>Missing input: ${id}.</p>`);
                }
                return;
            }
            input = input.trim();
            if (input.length === 0) {
                if ((errorDiv).is(':empty')) {
                    errorDiv.append(`<p>Missing input: ${id}.</p>`);
                }
                return;
            }
        });

        const phoneNumber = $('#phoneNumber').val().trim();
        if (!phoneNumber.match(/^\d{10}$/)) {
            if ((errorDiv.is(':empty'))) {
                errorDiv.append(`<p>Invalid phone number.</p>`);
            }
            return;
        }
        let ageCheck = $('#ageConfirmation');
        if (!ageCheck.prop('checked')) {
            errorDiv.append(`<p>You must be 13 years or older to have an account.</p>`);
            return
        }
        console.log(ageCheck);
        this.submit();
    });
});