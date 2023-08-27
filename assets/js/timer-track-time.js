window.timer.trackTime = {
    name: 'trackTime',
    title: 'Time Tracking',
    parent: window.timer,
    isInit: false,

    visible: ko.computed(function () {
        return window.timer.visibleSection() === 'trackTime';
    }, window.timer.trackTime),

    timeReport: {},
    timerId: 0,

    minutes: ko.observable(0),
    isActive: ko.observable(false),
    time: ko.observable("0:00"),
    projectName: ko.observable("project"),
    taskName: ko.observable("task"),

    /**
     * Update the object data
     */
    update: function () {
        if(this.isInit === false){
            this.init();
            this.isInit = true;
        }
    },

    /**
     * Init this object
     */
    init: function () {
        var self = this;
        this.minutes.subscribe(function (newMinutes) {
            self._updateTimeField(newMinutes);
        });

        this.isActive.subscribe(function (newStatus) {
            self.parent.setAppActive(newStatus);
        });
    },

    /**
     * Return to the edit screen and forget the current time
     */
    discard: function () {
        this.parent.showSection('timeReport');
    },

    /**
     * Return to the edit screen and set the current time to the timereport
     */
    edit: function () {
        this.parent.timeReport.time(this.time());
        this.parent.showSection('timeReport');
    },

    /**
     * Save the current time report to AC
     */
    done: function () {
        this.edit();
        this.parent.timeReport.save();
    },

    /**
     * Resume to the edit screen
     */
    resume: function () {
        this.isActive(true);
        this._startTimer();
    },

    /**
     * Set the timer data and start
     *
     * @param {Object} timeReport
     */
    start: function (timeReport) {
        this.parent.showSection(this.name);
        this.timeReport = timeReport;
        this.isActive(true);
        this.minutes(this.parent.timeConverter.setTime(timeReport.time()).getMinutes());
        this.projectName(timeReport.projectName());
        this.taskName(timeReport.taskName());

        this._updateTimeField(this.minutes());
        this._startTimer();
    },

    /**
     * Pause the timer
     */
    pause: function () {
        this.isActive(false);
        this._stopTimer();
    },

    openTask: function () {
        window.electron.openExtLink(this.parent.request.createAcLink(this.timeReport.task.url_path));
    },

    openProject: function () {
        window.electron.openExtLink(this.parent.request.createAcLink(this.timeReport.project.url_path));
    },

    /**
     * Start the timer
     *
     * @private
     */
    _startTimer: function () {
        var self = this;
        this.timerId = setInterval(function () {
            self._increaseMinutes();
        }, 60000);
    },

    /**
     * Stop the timer
     *
     * @private
     */
    _stopTimer: function () {
        clearInterval(this.timerId);
    },

    /**
     * +1 minute
     *
     * @private
     */
    _increaseMinutes: function () {
        var minutes = this.minutes();
        minutes++;
        this.minutes(minutes);
    },

    /**
     * Update the time string
     *
     * @param {number} newMinutes
     * @private
     */
    _updateTimeField: function (newMinutes) {
        this.time(this.parent.timeConverter.setMinutes(newMinutes).getTime());
    }
};
