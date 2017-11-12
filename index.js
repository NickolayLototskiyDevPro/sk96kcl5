const ProjectModule = (function () {
  return {
    getInstance: function () {
      return {
        participants: [],
        pricing: {},
        isBusy: false,

        init(participants, pricing) {
          if (Array.isArray(participants) && participants.every(item => item.hasOwnProperty('seniorityLevel'))) {
            this.participants = participants;
          }
          if (this._checkDataIsObj(pricing)) {
            this.pricing = pricing;
          }
          this.isBusy = false;
        },

        findParticipant(functor, callbackFunction) {
          const findOneParticipant = () => {
            const arrParticipants = [];
            if (functor.call(null, this.participants[0]) !== undefined) {
              for (let i = 0; i < this.participants.length; i++) {
                if (functor.call(null, this.participants[i]) === true) {
                  arrParticipants.push(this.participants[i]);
                }
              }
            }
            const resultFind = arrParticipants.length > 0 ? arrParticipants[0] : null;
            this.isBusy = false;
            callbackFunction.call(null, resultFind);
          }
          const result = this._timeDecorator(findOneParticipant, 1000, callbackFunction)();
          if (result === false) {
            return false;
          }
        },

        findParticipants(functor, callbackFunction) {
          const findAllParticipant = () => {
            const participantsArr = [];
            for (let i = 0; i < this.participants.length; i++) {
              if (functor.call(null, this.participants[i])) {
                participantsArr.push(this.participants[i]);
              }
            }
            this.isBusy = false;
            callbackFunction.call(null, participantsArr);
          }
          const result = this._timeDecorator(findAllParticipant, 0, callbackFunction)();
          if (result === false) {
            return false;
          }
        },

        addParticipant(participantObject, callbackFunction) {
          const runFunction = () => {
            if (participantObject.hasOwnProperty('seniorityLevel')) {
              this.participants.push(participantObject)
              this.isBusy = false;
              callbackFunction.call(null);
            } else {
              this.isBusy = false;
              callbackFunction.call(null, 'seniorityLevel- is required field');
            }
          }
          const result = this._timeDecorator(runFunction, 0, callbackFunction)();
          if (result === false) {
            return false;
          }
        },

        removeParticipant(participantObject, callbackFunction) {
          if (!this._checkDataIsObj(participantObject)) {
            return false;
          }
          const runFunction = () => {
            const index = this.participants.findIndex(item => item === participantObject);
            if (index > -1) {
              this.isBusy = false;
              callbackFunction.call(null, this.participants.splice(index, 1)[0]);
            } else {
              this.isBusy = false;
              callbackFunction.call(null, null);
            }
          }
          const result = this._timeDecorator(runFunction, 0, callbackFunction)();
          if (result === false) {
            return false;
          }
        },

        setPricing(participantPriceObject, callbackFunction) {
          if (!this._checkDataIsObj(participantPriceObject) || +participantPriceObject[Object.keys(participantPriceObject)[0]] <= 0) {
            return false;
          }
          const runFunction = () => {
            this.pricing = Object.assign({}, this.pricing, participantPriceObject);
            callbackFunction.call(null);
          }
          const result = this._timeDecorator(runFunction, 0, callbackFunction)();
          if (result === false) {
            return false;
          }
        },

        calculateSalary(periodInDays) {
          if (!this._isNumber(periodInDays)) {
            return false;
          }
          const result = this.participants.reduce((sum, current) => {
            if (current.seniorityLevel in this.pricing) {
              return sum + this.pricing[current.seniorityLevel] * 8 * periodInDays;
            } else {
              console.log('no pricing');
              throw new Error();
            }
          }, 0);
          return result;
        },

        _timeDecorator(func, time, callback) {
          return () => {
            if (typeof callback !== 'function') {
              console.log('Callback is not a function');
              return false;
            } else if (this.isBusy === true) {
              console.log('Object is busy now');
              return false;
            } else {
              this.isBusy = true;
              return setTimeout(() => func.call(this), time);
            }
          }
        },

        _checkDataIsObj(obj) {
          if (typeof obj !== 'object' || Array.isArray(obj)) {
            return false;
          } else {
            return true;
          }
        },

        _isNumber(num) {
          return num => typeof num === 'number' && isFinite(num) && num >= 1;
        }
      }
    }
  }
})();


module.exports = {
  firstName: 'Aleksei',
  secondName: 'Chernyak',
  task: ProjectModule.getInstance()
};
