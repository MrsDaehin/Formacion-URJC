//1000 ms is a maximum allowed value according to requirements
maximumResponseTime = 1000;
//100 is a number of sent requests according to requirements
iterations = 100;
//100 ms is a delay between requests according to requirements
delay = 100;
//responseTimes is an array for collecting response time values
responseTimes = [];
i=0;
function sendRequest() {
   pm.sendRequest({
       url: "dummy.restapiexample.com/api/v1/employees",
       method: 'GET'
   }, function (err, res) {
       pm.test("Response time is " + res.responseTime, function (){
       pm.expect(err).to.equal(null);
       pm.expect(res).to.have.property('code', 200);
       responseTimes.push(res.responseTime);
       });
       if (i < iterations - 1) {
           i++;
           setTimeout(sendRequest, delay);
       }
       else {
           percentile90ResponseTime = quantile(responseTimes, 90);
           pm.test("90 percentile response time " + percentile90ResponseTime + " is lower than " + maximumResponseTime + ", the number of iterations is " + iterations, function () {
               pm.expect(percentile90ResponseTime).to.be.below(maximumResponseTime);
           });
       }
   });
}
sendRequest();
function sortNumber(a,b) {
   return a - b;
}
function quantile(array, percentile) {
   array.sort(sortNumber);
   index = percentile/100. * (array.length-1);
   if (Math.floor(index) == index) {
    result = array[index];
   } else {
       j = Math.floor(index)
       fraction = index - j;
       result = array[j] + (array[j+1] - array[j]) * fraction;
   }
   return result;
}