import * as d3 from "d3";
import races from './data/races.csv'
import results from './data/results.csv'
import lapTimes from './data/lap_times.csv'



var parseDate = d3.timeParse('%d/%m/%Y');

//returns data to be used in details.js to make the graph and a score (avarage deviation of the data with the least square method)
export function importRaceConsistencyData(driverId, year, callBack){
    d3.csv(races).then((races) => { 
      d3.csv(results).then((results) => {
          races = races.filter(function(row) {
              return row.year == year;
          });
          var maxRaceId = Math.max.apply(Math, races.map(function(race) { return race.raceId; }));
          var minRaceId = Math.min.apply(Math, races.map(function(race) { return race.raceId; }));
          results = results.filter(function(row){
              return row.driverId == driverId && row.raceId >= minRaceId && row.raceId <= maxRaceId;
          });
          var data = [];
          races.forEach(race => {
              var found = false;
              var date = parseDate(race.date);
              date = new Date(race.year, date.getMonth(), date.getDate());
              results.forEach(result => {
                  if (race.raceId == result.raceId){
                      found=true;
                      if (result.position == '\\N'){
                          data.push({date: date, value: "20"})
                      }
                      else 
                          data.push({date: date, value: result.position})
                  }
              }); 
              if (!found){  
                  data.push({date: date, value: "20"})
              }
          });
  
          data = data.sort((a, b) => (a.date > b.date) ? 1 : -1)
          var lsm = leastSquareMethod(data);
          callBack({data: data, lsm: lsm});
      });
    });
  }

//returns data to be used in details.js and a score. The score is the avarage standard deviation in laptimes over all the races.
export function importTimeConsistencyData(driverId, year, callback){
    d3.csv(races).then(function(races){ 
        d3.csv(lapTimes).then(function(lapTimes){
            races = races.filter(function(row) {
                return row.year == year;
            });
            var maxRaceId = Math.max.apply(Math, races.map(function(race) { return race.raceId; }));
            var minRaceId = Math.min.apply(Math, races.map(function(race) { return race.raceId; }));
            //filter out useless laptimes
            lapTimes = lapTimes.filter(function(row){
                return row.driverId == driverId && row.raceId >= minRaceId && row.raceId <= maxRaceId;
            });
            var data = [];
            races.forEach(race => {
                
                var date = parseDate(race.date);
                date = new Date(race.year, date.getMonth(), date.getDate());

                var raceLaptimes = lapTimes.filter(function(row){
                    return row.raceId == race.raceId;
                });

                var unfilteredMean = 0;
                var unfilteredN = 0;
                var filterVariance = 1.5;
                //calculate Mean of unfiltered lap times (including safety car, pitstop,...)
                raceLaptimes.forEach(lapTime => {
                    unfilteredMean += parseInt(lapTime.milliseconds);
                    unfilteredN++;
                });
                unfilteredMean = unfilteredMean / unfilteredN;


                //list containing only the racetimes in milliseconds, nothing else
                //Filtering applied
                var times = [];
                raceLaptimes.forEach(lapTime => {
                    var t = parseInt(lapTime.milliseconds);
                    if (t <= filterVariance * unfilteredMean){
                        times.push(t);
                    }
                });
                
                if (times.length != 0){
                    var mean = 0;
                    var n = 0;
                    // calculate avarage and deviation
                    times.forEach(time => {
                        mean += time;
                        n++;
                    });
                    mean = mean / n;

                    //sum of difference between values and mean squared
                    var diffMean = 0;
                    times.forEach(time => {
                        diffMean += Math.pow(Math.abs(time - mean), 2);
                    });

                    var sd = Math.sqrt(diffMean/n);
                    data.push({date: date, value: sd})
                }
            });
            data = data.sort((a, b) => (a.date > b.date) ? 1 : -1);
            //calculate leastSquares
            var lsm = leastSquareMethod(data);

            callback({data: data, lsm: lsm});
        }); 
    });
};



function leastSquareMethod(data){
    var n = data.length
    var sumXY = 0;
    var sumX = 0;
    var sumY = 0;
    var sumXSquared = 0;
    data.forEach(element => {
        var date  = element.date.getTime();
        var value = parseInt(element.value);
        sumXY += date*value;
        sumX += date;
        sumY += value;
        sumXSquared += date * date;
    });

    var b = (n*sumXY -sumX*sumY) / (n*sumXSquared - sumX*sumX);
    var a = sumY/n - b * sumX/n;

    var lsm = [];
    var sqDiff = 0;
    data.forEach(element => {
        var x = element.date;
        var y = a + b*x;
        lsm.push({value: y, date: x});
        sqDiff += Math.pow((element.value - y), 2);
    });
    var avgDiff = Math.sqrt(sqDiff/data.length);
    // console.log("average difference: ", avgDiff);
    return {lsmPoints: lsm, score: avgDiff};
}

  export default {importRaceConsistencyData, importTimeConsistencyData};