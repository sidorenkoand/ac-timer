window.timeConverter = {
    /**
     * {number}
     */
    _minutes: 0,

    /**
     * @param {number} minutes
     * @returns {Object}
     */
    setMinutes: function (minutes) {
        this._minutes = minutes * 1;

        return this;
    },

    /**
     * @returns {number}
     */
    getMinutes: function () {
        return this._minutes;
    },

    /**
     * Set time in 1:25 (1h 25m) format
     *
     * @param {string} time
     * @returns {Object}
     */
    setTime: function (time) {
        var timeArr = time.split(':');
        if (timeArr[1] && timeArr[1] * 1 > 0) {
            this._minutes = timeArr[1] * 1;
        } else {
            this._minutes = 0;
        }

        if (timeArr[0] && timeArr[0] * 1 > 0) {
            this._minutes = this._minutes + timeArr[0] * 60;
        }

        return this;
    },

    /**
     * Return time in string format
     *
     * @returns {string}
     */
    getTime: function () {
        var time = '',
            hours = Math.trunc(this._minutes / 60),
            minutes = this._minutes - hours * 60;

        time = hours + ':';
        time = time + (minutes > 9 ? minutes.toString() : '0' + minutes);

        return time;
    },

    /**
     * Set time in decimal format
     *
     * @param {number} decimal
     * @returns {Object}
     */
    setDecimal: function (decimal) {
        var hours = Math.trunc(decimal),
            minutesDecimal = decimal - hours,
            minutes = Math.round(60 * minutesDecimal);

        this._minutes = 60 * hours + minutes;
        return this;
    }
};
