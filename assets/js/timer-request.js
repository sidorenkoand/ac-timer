window.request = {

    /**
     * Return an array with available job types
     *
     * @returns {Array}
     */
    getJobTypes: function () {
        return this._get('/job-types');
    },

    /**
     * Return opened tasks for current user
     *
     * @returns {*}
     */
    getOpenedTasks: function () {
        var userId = this.getUserId();
        if (userId === 0) {
            throw "Can't find current user ID";
        }

        return this._get('/users/' + userId + '/tasks');
    },

    /**
     * Return time reports for current user
     *
     * @param {Date object} date
     * @returns {*}
     */
    getTimeReports: function (date) {
        var userId = this.getUserId(),
            url = '/users/' + userId + '/time-records/filtered-by-date';

        url = url + '?from=' + encodeURIComponent(this._getDate(date)) + '&to=' + encodeURIComponent(this._getDate(date));

        return this._get(url);
    },

    /**
     * Authorization
     *
     * @param string url
     * @param string email
     * @param string password
     * @returns {never}
     */
    authorize: function (url, email, password) {
        url = url.replace(/\/$/, '');
        localStorage.setItem('ac_url', url)

        var request = this._post(this._getUrl() + '/issue-token', {
            "username": email,
            "password": password,
            "client_name": "Timer",
            "client_vendor": "Andrew"
        }, true);

        request.done(function (json) {
            if (json.is_ok === true) {
                localStorage.setItem('ac_token', json.token)
            }
        });

        return request;
    },

    /**
     * Create time record (time report)
     *
     * @param {int} projectId
     * @param {int} taskId
     * @param {time} value
     * @param {int} jobType
     * @param {string} summary
     * @returns {*}
     */
    postTimeReport: function (projectId, taskId, value, jobType, summary, date) {
        if (!projectId || parseInt(projectId) < 1 || !taskId || parseInt(taskId) < 1) {
            console.error('Empty project or task ID: ' + projectId, +', ' + taskId);
            return null;
        }

        var url = '/projects/' + parseInt(projectId) + '/time-records'

        return this._post(url, {
            "value": value,
            "job_type_id": parseInt(jobType),
            "summary": summary,
            "task_id": taskId,
            "record_date": this._getDate(date),
            "billable_status": 1
        });
    },

    /**
     * Update time record (time report)
     *
     * @param {int} projectId
     * @param {int} reportId
     * @param {time} value
     * @param {int} jobType
     * @param {string} summary
     * @returns {*}
     */
    updateTimeReport: function (projectId, reportId, value, jobType, summary) {
        if (!projectId || parseInt(projectId) < 1 || !reportId || parseInt(reportId) < 1) {
            console.error('Empty project or report ID: ' + projectId, +', ' + reportId);
            return null;
        }

        var url = '/projects/' + parseInt(projectId) + '/time-records/' + reportId

        return this._put(url, {
            "value": value,
            "job_type_id": parseInt(jobType),
            "summary": summary
        });
    },

    /**
     * Delete time record (time report)
     *
     * @param {int} projectId
     * @param {int} reportId
     * @param {time} value
     * @param {int} jobType
     * @param {string} summary
     * @returns {*}
     */
    deleteTimeReport: function (projectId, reportId) {
        if (!projectId || parseInt(projectId) < 1 || !reportId || parseInt(reportId) < 1) {
            console.error('Empty project or report ID: ' + projectId, +', ' + reportId);
            return null;
        }

        var url = '/projects/' + parseInt(projectId) + '/time-records/' + reportId

        return this._delete(url);
    },

    /**
     * Save the timereport to localStorage
     * @param obj
     */
    setBufferTimeReport: function (obj) {
        localStorage.setItem('ac_timereport', JSON.stringify(obj));
    },

    /**
     * Return an object for saved timereport
     * @returns {{}}
     */
    getBufferTimeReport: function () {
        var data = localStorage.getItem('ac_timereport');
        return data ? JSON.parse(data) : {};
    },


    /**
     * Check if authorized
     *
     * @returns {Boolean}
     */
    isAuth: function () {
        return localStorage.getItem('ac_url') !== null && localStorage.getItem('ac_token') !== null
    },

    /**
     * Return AC ID for current user
     * @returns {number}
     */
    getUserId: function () {
        var token = localStorage.getItem('ac_token');
        return token === null ? 0 : token.substr(0, token.indexOf('-')) * 1;
    },

    /**
     * Clear user data storage
     */
    clearStorage: function () {
        localStorage.clear();
    },

    createAcLink: function (uri) {
        return localStorage.getItem('ac_url') + uri
    },

    /**
     *
     * @param string url
     * @param object data
     * @param string isAbsoluteUrl
     * @returns {*|*|*|*}
     * @private
     */
    _post: function (url, data, isAbsoluteUrl) {
        if (!isAbsoluteUrl) {
            url = this._getUrl() + url;
        }

        return $.ajax(url, {
            url: url,
            method: 'POST',
            data: data,
            dataType: 'json',
            headers: this._getHeader()
        });
    },

    /**
     *
     * @param string url
     * @param object data
     * @param string isAbsoluteUrl
     * @returns {*|*|*|*}
     * @private
     */
    _put: function (url, data, isAbsoluteUrl) {
        if (!isAbsoluteUrl) {
            url = this._getUrl() + url;
        }

        return $.ajax(url, {
            url: url,
            method: 'PUT',
            data: data,
            dataType: 'json',
            headers: this._getHeader()
        });
    },

    /**
     *
     * @param url
     * @param isAbsoluteUrl
     * @private
     */
    _get: function (url, isAbsoluteUrl) {
        if (!isAbsoluteUrl) {
            url = this._getUrl() + url;
        }

        return $.ajax(url, {
            url: url,
            method: 'GET',
            dataType: 'json',
            headers: this._getHeader()
        });
    },

    /**
     * Delete something
     *
     * @param url
     * @param isAbsoluteUrl
     * @private
     */
    _delete: function (url, isAbsoluteUrl) {
        if (!isAbsoluteUrl) {
            url = this._getUrl() + url;
        }

        return $.ajax(url, {
            url: url,
            method: 'DELETE',
            dataType: 'json',
            headers: this._getHeader()
        });
    },

    /**
     * Return header object
     * @returns {Object}
     * @private
     */
    _getHeader: function () {
        return localStorage.getItem('ac_token') === null ? {} : {
            'X-Angie-AuthApiToken': localStorage.getItem('ac_token')
        };
    },

    /**
     * Return base url for AC API
     * @returns {string}
     * @private
     */
    _getUrl: function () {
        var url = localStorage.getItem('ac_url');
        if (url) {
            url = url + '/api/v1';
        }
        return url;
    },

    /**
     *
     * @param {Date | undefined} date
     * @returns {string}
     * @private
     */
    _getDate: function (date) {
        var today = date instanceof Date ? date : new Date(),
            dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return yyyy + '-' + mm + '-' + dd;
    }
};