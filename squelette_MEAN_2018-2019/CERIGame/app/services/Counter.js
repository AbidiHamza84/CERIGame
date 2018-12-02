CERIGameApp.service('Counter', ['$interval', function ($interval) {

    this.countDown = function(doThis, interval, second = 0, minute = 0, day = 0, month = 0,  year = 0){
        let countDown = second + (minute * 60) + (day * 24 * 60 * 60) + (month * 30 * 24 * 60 * 60) + (year * 12 * 30 * 24 * 60 * 60);
        let countTo = countDown;

        return $interval(function(){
            doThis(countDown);
            countDown--;
        },interval,countTo + 1);
    }

    this.stop = function (counter) {
        if(counter !== undefined){
            $interval.cancel(counter);
        }
    }

}]);