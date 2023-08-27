window.timer = {
    /**
     * Request object
     *
     * @type {{_post, _getUrl, isAuth, getOpenedTasks, _getHeader, clearStorage, _get, authorize, getUserId, getJobTypes}|*}
     */
    request: {},

    /**
     * Time converter object
     *
     * @type {{getTime, _minutes, setMinutes, getMinutes, setTime, setDecimal}|*}
     */
    timeConverter: {},

    /**
     * Tray object
     */
    tray: {},

    jobTypes: ko.observable(),
    jobTypesById: {},

    isAuth: ko.observable(false),
    visibleSection: ko.observable('login'),
    title: ko.observable(),
    errorMessage: ko.observable(''),

    /**
     * Constructor method
     */
    init: function(){
        let self = this;

        this.request = window.request;
        this.timeConverter = window.timeConverter;

        window.electron.initTray();

        this.isAuth.subscribe(function(newValue){
            if(newValue){
                self.showSection('taskList');
            } else {
                self.request.clearStorage();
                self.showSection('login');
            }
        });

        this.visibleSection.subscribe(function(newValue){
            if(typeof self[newValue] === 'object' &&
                typeof self[newValue].update === 'function') {
                self[newValue].update();
            }
        });

        if(this.request.isAuth()){
            this.isAuth(true);
        }

        if(this.isAuth()){
            this.updateJobTypes();
        } else {
            self.showSection('login');
        }
    },

    /**
     * Exucute after auth
     */
    afterAuth: function () {
        this.updateJobTypes();
    },

    /**
     * Update this.isAuth
     */
    checkIsAuth: function () {
        this.isAuth(
            this.request.isAuth()
        );

        if(this.isAuth()){
            this.afterAuth();
        }
    },

    /**
     * Update JobTypes from AC
     */
    updateJobTypes: function () {
        var self = this;
        this.request.getJobTypes().done(function (jobTypesServer) {
            self.jobTypes(jobTypesServer);
            jobTypesServer.forEach(function(jobType){
                self.jobTypesById[jobType.id] = jobType.name;
            });
        });
    },

    /**
     * Switch among sections
     *
     * @param string section
     */
    showSection: function(section){
        this.visibleSection(section);
        this.title(
            this[section] ? this[section].title : ''
        );
    },

    /**
     * Show error
     *
     * @param error
     */
    showError: function(error){
        var self = this;

        if(typeof error === 'string'){
            this.errorMessage(error);
        } else {
            console.error(error);
            this.errorMessage('An error occurred');
        }

        setTimeout(function(){
            self.errorMessage('');
        }, 10000);
    },

    /**
     * Change App view if timer is turned on/off
     *
     * @param {Boolean} isActive
     */
    setAppActive: function (isActive) {
        window.electron.setAppActive(isActive);
    }
};
