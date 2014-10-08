window.onload = function() {
    var returnUrl = sessionStorage.getItem("returnUrl");
    if(returnUrl !== null && returnUrl !== undefined && returnUrl !== "null" && returnUrl !== document.URL) {
        sessionStorage.setItem("returnUrl", null);
        window.location = returnUrl;
    }
}
