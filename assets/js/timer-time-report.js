window.timer.timeReport = {
    name: 'timeReport',
    title: 'Time Report',
    parent: window.timer,

    visible: ko.computed(function () {
        return window.timer.visibleSection() === 'timeReport';
    }, window.timer.timeReport),

    //jobTypes: ko.observable(),
    task: {},
    project: {},
    timeReport: {},

    timeReportId: 0,
    time: ko.observable('0:00'),
    projectName: ko.observable(),
    taskName: ko.observable(),
    jobType: ko.observable(1),
    description: ko.observable(),
    date: {},

    /**
     * This method calls automaticaly when shows this section
     */
    update: function () {
    },

    /**
     * Set task & data for the timereport
     *
     * @param {object} task
     * @param {object} project
     */
    setData: function (task, project, timeReport) {
        this.parent.showSection('timeReport');

        this.task = task;
        this.project = project;
        this.taskName(task.name);
        this.projectName(project.name);

        if (typeof timeReport !== 'undefined') {
            this.timeReport = timeReport;
            this.time(
                this.parent.timeConverter.setDecimal(timeReport.value).getTime()
            );
            this.jobType(timeReport.job_type_id);
            this.description(timeReport.summary);
            this.timeReportId = timeReport.id;
            this.date = new Date(timeReport.record_date);
        } else {
            this.timeReport = {};
            this.time("0:00");
            this.jobType(1);
            this.description("");
            this.timeReportId = 0;
            this.date = new Date();
        }
    },

    /**
     * Start time tracker
     */
    startTrackTime: function () {
        this.saveToBuffer();
        this.parent.trackTime.start(this);
    },

    /**
     * Save current time report in the buffer
     */
    saveToBuffer: function () {
        var time = this.time(),
            description = this.description(),
            jobType = this.jobType(),
            timeReport = {
                taskId: this.task.id,
                startMinutes: this.getMinutes(),
                description: description,
                jobType: jobType,
                timeReportId: this.timeReportId
            };

        this.parent.request.setBufferTimeReport(timeReport);
    },

    /**
     * Return time in minutes
     *
     * @returns {number}
     */
    getMinutes: function () {
        return this.parent.timeConverter.setTime(this.time()).getMinutes();
    },

    /**
     * Return to task list
     */
    backToTaskList: function () {
        this.parent.showSection('taskList');
    },

    /**
     * Save current time report to Active Collab
     */
    save: function () {
        var self = this;

        if (this.timeReportId === 0) {
            var postRequet = this.parent.request.postTimeReport(
                this.project.id,
                this.task.id,
                this.time(),
                this.jobType(),
                this.description(),
                this.date
            );
        } else {
            var postRequet = this.parent.request.updateTimeReport(
                this.project.id,
                this.timeReportId,
                this.time(),
                this.jobType(),
                this.description()
            );
        }

        if (null === postRequet) {
            return;
        }

        postRequet.done(function (response) {
            try {
                self.timeReportId = response.single.id;
                self.parent.showSection('taskList');
            } catch (e) {
                self.parent.showError(e);
                self.parent.showError(response);
            }
        }).fail(function (error) {
            self.parent.showError(error);
        });
    },

    /**
     * Return unix timestamp
     *
     * @returns {number}
     * @private
     */
    _getCurrentTimestamp: function () {
        return Math.round(new Date().getTime() / 1000);
    }
};
