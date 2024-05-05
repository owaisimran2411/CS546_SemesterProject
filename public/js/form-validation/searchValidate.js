$(document).ready(function () {
    let searchForm = $('#product-search-form');

    searchForm.submit(function (event) {
        event.preventDefalut();
        let errorDiv = $('#search-errors');
        errorDiv.empty();

        let searchTerm = $('#search-input');
        if(!searchTerm){
            errorDiv.append('<p>You must provide search term.</p>');
            return;
        }
        searchTerm = searchTerm.trim();
        if(searchTerm.length === 0){
            errorDiv.append('<p>You must provide search term.</p>');
            return;
        }
        this.submit();
    });
});