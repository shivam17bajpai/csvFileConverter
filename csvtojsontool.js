var result = [];
var result1 = [];
var result3 = [];
var final = [];
var education = [];
var statearray = [];
var fs = require("fs");
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('India2011.csv')
});

//For Age-wise population distribution in terms of literate population (first json)
var myWriteStream = require("fs").createWriteStream("Age.json")
var myWriteStreamstate = require("fs").createWriteStream("State.json")
var myWriteStreameducation = require("fs").createWriteStream("Education.json")

lineReader.on('line',
    function(line) {
        var jsonFromLine = {};
        var lineSplit = line.split(',');
        if (lineSplit[4] === "Total") {
            if (lineSplit[5] != "All ages") {
                jsonFromLine.Total_Urban_Rural = lineSplit[4];
                jsonFromLine.AgeGroup = lineSplit[5];
                jsonFromLine.literate = lineSplit[12];
                result.push(jsonFromLine);
            }
        }
    }
);
lineReader.on('close', function() {
    var i = 0;
    while (i != 28) {
        var j = i.toString();
        //console.log(result[j]['AgeGroup']);

        jsonResult = result.filter(function(agegroup) {

            return agegroup['Total_Urban_Rural'] === "Total" && agegroup['AgeGroup'] === result[j]['AgeGroup']
        });


        sum = jsonResult.reduce(function(total, agegroup) {

            total = total + parseInt(agegroup.literate);
            return total;
        }, 0);

        var array = {};
        array.AgeGroup = result[j]['AgeGroup'];
        array.totliterate = sum;
        final.push(array);
        i++;
    }
});
lineReader.on('close', function(line) {
    myWriteStream.write(JSON.stringify(final, null, 2))
});
console.log("first json created");
//For Graduate Population of India - State-wise & Gender-wise. (second json)
lineReader.on('line',
    function(line) {
        var jsonFromLine2 = {};
        var lineSplit = line.split(',');
        if (lineSplit[4] === "Total") {
            if (lineSplit[5] === "All ages") {
                var x = lineSplit[1]
                if (x == '01' || x == '02' || x == '03' || x == '04' || x == '05' || x == '06' || x == '07' || x == '08' || x == '09')
                    x = x.charAt(1)
                jsonFromLine2.statecode = x
                jsonFromLine2.state = lineSplit[3];

                jsonFromLine2.Graduatepop = parseInt(lineSplit[39]);
                jsonFromLine2.gradM = parseInt(lineSplit[40]);
                jsonFromLine2.gradF = parseInt(lineSplit[41]);
                result1.push(jsonFromLine2);
                //console.log(result1[0]);
            }
        }
    })
lineReader.on('close',
    function() {
        var i = 1;
        while (i != 36) {

            jsonResult1 = result1.filter(function(agegp) {
                return agegp['statecode'] === i.toString();
            });


            var array = {
                AreaName: jsonResult1[0].state,
                Graduatepopulation: jsonResult1[0].Graduatepop,
                Graduate_Male: jsonResult1[0].gradM,
                Graduate_Female: jsonResult1[0].gradF

            }
            statearray.push(array);

            i++;
            // console.log(statearray);
        }
    });
lineReader.on('close', function(line) {
    myWriteStreamstate.write(JSON.stringify(statearray, null, 2))
});
console.log("second json created");
//For Education Category wise - all India data combined together (third json)
lineReader.on('line',
    function(line) {
        var jsonFromLine3 = {};
        var lineSplit = line.split(',');
        if (lineSplit[4] === "Total") {
            if (lineSplit[5] === "All ages") {
                // jsonFromLine3.Total_Urban_Rural = lineSplit[4];
                jsonFromLine3.literateedu = lineSplit[15];
                jsonFromLine3.belowpri = lineSplit[18];
                jsonFromLine3.primary = lineSplit[21];
                jsonFromLine3.middle = lineSplit[24];
                jsonFromLine3.matric = lineSplit[27];
                jsonFromLine3.highersec = lineSplit[30];
                jsonFromLine3.nontechdip = lineSplit[33];
                jsonFromLine3.techdip = lineSplit[36];
                jsonFromLine3.Graduate = lineSplit[40];
                jsonFromLine3.unclassified = lineSplit[43];
                result3.push(jsonFromLine3);
                //  console.log(result3);
            }
        }
    }
);

lineReader.on('close', function() {

    sumedu = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.literateedu);
        return total;
    }, 0);
    sumbelow = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.belowpri);
        return total;
    }, 0);
    sumprimary = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.primary);
        return total;
    }, 0);

    summiddle = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.middle);
        return total;
    }, 0);


    summatric = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.matric);
        return total;
    }, 0);

    sumhighersec = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.highersec);
        return total;
    }, 0);

    sumnontechdip = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.nontechdip);
        return total;
    }, 0);

    sumtechdip = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.techdip);
        return total;
    }, 0);

    sumGraduate = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.Graduate);
        return total;
    }, 0);
    sumunclassified = result3.reduce(function(total, agegroup) {

        total = total + parseInt(agegroup.unclassified);
        return total;
    }, 0);

    var array = {};
    array.Literate_without_educational_level_Persons = sumedu;
    array.Below_Primary_Persons = sumbelow;
    array.Primary_Persons = sumprimary;
    array.Middle_Persons = summiddle;
    array.Matric_Secondary_Persons = summatric;
    array.Higher_secondary_Senior_secondary_Persons = sumhighersec;
    array.Non_technical_diploma_degree_Persons = sumnontechdip;
    array.Technical_diploma_Persons = sumtechdip;
    array.Graduate_above_Persons = sumGraduate;
    array.Unclassified_Persons = sumunclassified;
    education.push(array);
});

lineReader.on('close', function(line) {
    myWriteStreameducation.write(JSON.stringify(education, null, 2))
});
console.log("Third json created");