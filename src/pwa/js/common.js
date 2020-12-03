/* globals gapi: false */

/* Google Auth */

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function isSignedIn() {
    const auth2 = gapi.auth2.getAuthInstance();
    return auth2.isSignedIn.get();
}


let auth2;
window.addEventListener('load', function() {
    const signOutButton = document.querySelector('.g-signout');
    // check if this page has a SignOut button first
    if (signOutButton) {
        // get the Google project Client_ID from the <meta name="google-signin-client_id" content="XXXX"> HTML tag
        const CLIENT_ID = document.querySelector('meta[name="google-signin-client_id"]').content;

        gapi.load('auth2', function() {
            auth2 = gapi.auth2.init({
                client_id: CLIENT_ID,
            // fetch_basic_profile: false,
            // scope: 'profile'
            });

            auth2.isSignedIn.listen(function(val) {
                if (val) {
                    // show the SignOut button
                    signOutButton.style.display = '';
    
                    signOutButton.addEventListener('click', signOut);
                } else {
                    // it's already hidden - but remove it anyway
                    // signOutButton.remove();
                }
            });

            // This is what you use to listen for user changes
            auth2.currentUser.listen(function (user) {
                // in client-side can use the user.getId(), !!!! BUT to send to a server use ONLY the ID_TOKEN user.getAuthResponse().id_token
                console.log('Google user:', user.getId(), 'with token:', user.getAuthResponse().id_token);
            }); 
        });
    }
});
