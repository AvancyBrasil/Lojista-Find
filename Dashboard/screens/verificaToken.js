window.onload = function() {

    setTimeout(function() {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            window.location.href = '../../../Login/login.html';
        } else {
            document.body.style.display = 'block';
        }
    }, 0);
};