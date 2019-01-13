window.timer.login = {
    name: 'login',
    title: 'Login page',
    parent: window.timer,

    visible: ko.computed(function(){
        return window.timer.visibleSection() === 'login';
    }, window.timer.login),

    url: ko.observable(''),
    email: ko.observable(''),
    password: ko.observable(''),

    /**
     * Submit login form
     */
    loginSubmit: function(){
        var self = this;

        try {
            request.authorize(this.url(), this.email(), this.password()).done(function(data){
                self.parent.checkIsAuth();
            }).fail(function(err){
                self.parent.showError('Authentication error');
            });
        } catch (e) {
            self.parent.showError(e);
            return;
        }
    },

    /**
     * Logout
     */
    logout: function () {
        this.parent.isAuth(false);
    }
};