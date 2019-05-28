csui.define(['module'], function(module) {

    var Adaptivepoll = function (_callback, __localStorageKey, _defaultInterval) {
        var self = this;
        this.init = function (args) {
            this.timer = 0;
            this.iterations = 0;
            this.PERIOD_VISIBLE = _defaultInterval;
            this.IDLE_TIMEOUT = (this.PERIOD_VISIBLE / 1000) - 1; //seconds
            this._localStorageKey = __localStorageKey; //'global_countdown_last_reset_timestamp';
            this._idleSecondsTimer = null;
            this._lastResetTimeStamp = (new Date()).getTime();
            this._localStorage = null;
            this.noActivity = false;
            this.lastState = 0;
            this.LAST_STATE_LIMIT = 8;
            this._callback = _callback;

            this.AttachEvent(document, 'click', this.ResetTime);
            this.AttachEvent(document, 'mousemove', this.ResetTime);
            this.AttachEvent(document, 'keypress', this.ResetTime);
            this.AttachEvent(window, 'load', this.ResetTime);
            this.param1 = args[3];
            this.param2 = args[4];

            try {
                this._localStorage = window.localStorage;
            }
            catch (ex) {
            }

            this._idleSecondsTimer = window.setInterval(this.CheckIdleTime, _defaultInterval);
            if (document.addEventListener) {
                document.addEventListener("visibilitychange", this.ResetTime);
            }
        };

        this.GetLastResetTimeStamp = function () {
            var lastResetTimeStamp = 0;
            if (self._localStorage) {
                lastResetTimeStamp = parseInt(self._localStorage[self._localStorageKey], 10);
                if (isNaN(lastResetTimeStamp) || lastResetTimeStamp < 0) {
                    lastResetTimeStamp = (new Date()).getTime();
                }

            } else {
                lastResetTimeStamp = self._lastResetTimeStamp;
            }

            return lastResetTimeStamp;
        };

        this.SetLastResetTimeStamp = function (timeStamp) {
            if (self._localStorage) {
                self._localStorage[self._localStorageKey] = timeStamp;
            } else {
                self._lastResetTimeStamp = timeStamp;
            }
        };

        this.ResetTime = function () {

            if(self.lastState > 1) {
                setTimeout(self._callback, 1000 , self.param1, self.param2);
            }
            self.noActivity = false;
            self.SetLastResetTimeStamp((new Date()).getTime());
            self.setUpdateTimer();
        };

        this.AttachEvent = function (element, eventName, eventHandler) {
            if (element.addEventListener) {
                element.addEventListener(eventName, eventHandler, false);
                return true;
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
                return true;
            } else {
                //nothing to do, browser too old or non standard anyway
                return false;
            }
        };

        this.RemoveEvent = function (element, eventName, eventHandler) {
            if (element.addEventListener) {
                element.removeEventListener(eventName, eventHandler, false);
                return true;
            } else if (element.attachEvent) {
                element.attachEvent('off' + eventName, eventHandler);
                return true;
            } else {
                //nothing to do, browser too old or non standard anyway
                return false;
            }
        };

        this.CheckIdleTime = function () {

            var currentTimeStamp = (new Date()).getTime();
            var lastResetTimeStamp = self.GetLastResetTimeStamp();
            var secondsDiff = Math.floor((currentTimeStamp - lastResetTimeStamp) / 1000);
            if (secondsDiff <= 0) {
                self.ResetTime();
                secondsDiff = 0;
            }

            if (secondsDiff >= self.IDLE_TIMEOUT) {

                if (!self.noActivity) {
                    self.noActivity = true;
                    self.setUpdateTimer();

                }
            }
        };


        this.setUpdateTimer = function () {

            if (self.noActivity) {
                clearInterval(self.timer);
                self.lastState = Math.min(self.LAST_STATE_LIMIT, self.lastState + 2);
                if (self.lastState === self.LAST_STATE_LIMIT) {
                    clearInterval(self.timer);
                } else {
                    self.timer = setInterval(self._callback, self.PERIOD_VISIBLE * self.lastState, self.param1, self.param2);
                }

            }
            else if (self.lastState > 0) {
                clearInterval(self.timer);
                self.timer = setInterval(self._callback, self.PERIOD_VISIBLE, self.param1, self.param2);
                self.lastState = 0;

            }

            return self.timer;
        };
        this.destroy = function () {
            clearInterval(self._idleSecondsTimer);
            clearInterval(self.timer);
            self.RemoveEvent(document, 'click', this.ResetTime);
            self.RemoveEvent(document, 'mousemove', this.ResetTime);
            self.RemoveEvent(document, 'keypress', this.ResetTime);
            self.RemoveEvent(window, 'load', this.ResetTime);
            document.removeEventListener("visibilitychange", self.ResetTime);

        };
        this.init(arguments);
    }
    return Adaptivepoll;
});
