window.timer.taskList = {
    name: 'taskList',
    title: 'Task list & Time reports',
    parent: window.timer,
    isInit: false,

    visible: ko.computed(function () {
        return window.timer.visibleSection() === 'taskList';
    }, window.timer.taskList),

    date: new Date(),
    dateFormatted: ko.observable(''),
    activeTab: ko.observable('user-tasks'),
    userTasks: ko.observableArray(),
    timeReportsList: ko.observableArray(),
    total: ko.observable('0:00'),
    count: ko.observable(0),

    /**
     * Update this object data when it shows
     */
    update: function(){
        if(this.isInit === false){
            this.init();
            this.isInit = true;
        }

        this._updateUserTasks();
        this._updateTimeReportsList();
    },

    /**
     * Init functions of this object
     */
    init: function(){
        var self = this;

        $('.tabs').tabs({
            "onShow": function (activeTab) {
                self.activeTab($(activeTab).attr('id'));
            }
        });

        this.activeTab.subscribe(function(tab){
            if('user-tasks' === tab){
                self._updateUserTasks();
            } else {
                self._updateTimeReportsList();
            }
        });

        this.dateFormatted(this._getDateFormatted());
    },

    /**
     * Open the edit screen for a time report
     *
     * @param {Object} self Current object
     * @param {Object} task
     * @param {Object} project
     */
    showTimeReport: function (self, task, project) {
        self.parent.timeReport.setData(task, project);
    },

    /**
     * Convert number to time string
     *
     * @param {number} decimal
     * @returns {string}
     */
    convertDecimalToString: function (decimal) {
        return this.parent.timeConverter.setDecimal(decimal).getTime();
    },

    /**
     * Open the edit screen for the time report
     *
     * @param {Object} timeReport
     * @param {Object} task
     * @param {Object} project
     */
    editTimeReport: function (timeReport, task, project) {
        this.parent.timeReport.setData(task, project, timeReport);
    },

    /**
     * Delete the time report from AC
     *
     * @param {Object} timeReport
     * @param {Object} project
     */
    deleteTimeReport: function (timeReport, project) {
        var self = this;

        this.parent.request.deleteTimeReport(project.id, timeReport.id).done(function(){
            self._updateTimeReportsList();
        }).fail(function(err){
            self.parent.showError(err);
        });
    },

    /**
     * Get the Job Type name by id
     *
     * @param {number} jobTypeId
     * @returns {string}
     */
    getJobTypeName: function (jobTypeId) {
        return this.parent.jobTypesById[jobTypeId] ? this.parent.jobTypesById[jobTypeId] : '';
    },

    /**
     * -1 day to this.date
     */
    decreaseDate: function () {
        this.date.setDate(this.date.getDate() - 1);
        this.dateFormatted(this._getDateFormatted());
        this._updateTimeReportsList();
    },

    /**
     * +1 day to this.date
     */
    increaseDate: function () {
        this.date.setDate(this.date.getDate() + 1);
        this.dateFormatted(this._getDateFormatted());
        this._updateTimeReportsList();
    },

    /**
     * Open the object link in the external browser
     *
     * @param {Object} task
     */
    openExternalLink: function (task) {
        window.electron.openExtLink(this.parent.request.createAcLink(task.url_path));
    },

    /**
     * Get the date as a string from the this.date variable
     *
     * @returns {string}
     * @private
     */
    _getDateFormatted: function () {
        var today = this.date,
            dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return  dd + '.' + mm + '.' + yyyy;
    },

    /**
     * Update section #time-reports from AC
     *
     * @private
     */
    _updateTimeReportsList: function () {
        var self = this;

        this._setTotal(0);
        this.count(0);

        try {
            this.parent.request.getTimeReports(this.date).done(function (data) {
                self.timeReportsList(self._convertTimeReports(data));
            }).fail(function (e) {
                self.parent.showError(e);
            });
        } catch (e) {
            self.parent.showError(e);
        }
    },

    /**
     * Update section #user-tasks from AC
     *
     * @private
     */
    _updateUserTasks: function () {
        var self = this;

        try {
            this.parent.request.getOpenedTasks().done(function (data) {
                self.userTasks(self._convertTasks(data));
            }).fail(function (e) {
                self.parent.showError(e);
            });
        } catch (e) {
            self.parent.showError(e);
        }
    },

    /**
     * Convert AC response to a convinient form
     *
     * @param {Object} orginalData
     * @returns {Array}
     * @private
     */
    _convertTasks: function (orginalData) {
        var tasks = orginalData.tasks,
            data = orginalData.related.Project;

        if(typeof data !== 'object' || !$.isArray(tasks)){
            console.log('data', data);
            return [];
        }

        tasks.forEach(function(task) {
            if(typeof data[task.project_id] === 'object'){
                if(!$.isArray(data[task.project_id].tasks)){
                    data[task.project_id].tasks = [];
                }
                data[task.project_id].tasks.push(task);
            } else {
                throw "Not found project: " + task.project_id;
            }
        });

        var dataArray = Object.values(data);

        dataArray.sort(this._sortProjects);

        return dataArray;
    },

    /**
     * Convert AC response to a convinient form
     *
     * @param {Object} orginalData
     * @returns {Array}
     * @private
     */
    _convertTimeReports: function (orginalData) {
        var records = orginalData.time_records,
            projects = orginalData.related.Project,
            tasks = orginalData.related.Task,
            totalMinutes = 0,
            count = 0;

        if(typeof projects !== 'object' || typeof tasks !== 'object' || !$.isArray(records)){
            console.log('orginalData', orginalData);
            return [];
        }

        records.forEach(function(record) {
            if (record.parent_type === 'Task') {
                if (!$.isArray(tasks[record.parent_id].time_records)) {
                    tasks[record.parent_id].time_records = [];
                }
                tasks[record.parent_id].time_records.push(record);
            } else if (record.parent_type === 'Project') {
                if (!$.isArray(projects[record.parent_id].time_records)) {
                    projects[record.parent_id].time_records = [];
                }
                projects[record.parent_id].time_records.push(record);
            }
            totalMinutes = totalMinutes + record.value;
            count = count + 1;
        });

        var task;
        for (var taskId in tasks) {
            task = tasks[taskId];
            if (!$.isArray(projects[task.project_id].tasks)) {
                projects[task.project_id].tasks = [];
            }
            projects[task.project_id].tasks.push(task);
        }

        this._setTotal(totalMinutes);
        this.count(count);

        var projectsArray = Object.values(projects)

        projectsArray.sort(this._sortProjects);

        return projectsArray;
    },

    /**
     * Compare the objects of project for sorting
     *
     * @param {Object} a
     * @param {Object} b
     * @returns {number}
     * @private
     */
    _sortProjects: function (a, b) {
        return a.last_activity_on > b.last_activity_on ? -1 : 1;
    },

    /**
     * Set total time for the day
     *
     * @param {number} minutes
     * @private
     */
    _setTotal: function (minutes) {
        this.total(this.parent.timeConverter.setDecimal(minutes).getTime());
    },
};

