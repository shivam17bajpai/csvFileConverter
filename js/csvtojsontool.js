var result = [],
    result1 = [],
    result3 = [],
    final = [],
    statearray = [];
var fs = require("fs");
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('../csv/India2011.csv')
});
    //json file named 
var myWriteStream = require("fs").createWriteStream("../json/Age.json")
var myWriteStreamstate = require("fs").createWriteStream("../json/State.json")
var myWriteStreameducation = require("fs").createWriteStream("../json/Education.json")
//For Age-wise population distribution in terms of literate population (first json)
lineReader.on('line', function(line) {
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
});
lineReader.on('close', function() {
    var i = 0;
    while (i != 28) {
        var j = i.toString();
        jsonResult = result.filter(agegroup => agegroup['AgeGroup'] === result[j]['AgeGroup']);
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
    myWriteStream.write(JSON.stringify(final, null, 2))
});
console.log("first json created");
//For Graduate Population of India - State-wise & Gender-wise. (second json)
lineReader.on('line', function(line) {
    var jsonFromLine2 = {};
    var lineSplit = line.split(',');
    if (lineSplit[4] === "Total") {
        if (lineSplit[5] === "All ages") {
            jsonFromLine2.state = lineSplit[3];
            jsonFromLine2.Graduatepop = parseInt(lineSplit[39]);
            jsonFromLine2.gradM = parseInt(lineSplit[40]);
            jsonFromLine2.gradF = parseInt(lineSplit[41]);
            result1.push(jsonFromLine2);
        }
    }
})
lineReader.on('close', function() {
    var i = 0;
    while (i != 35) {
        var array = {
            AreaName: result1[i].state,
           // Graduatepopulation: result1[i].Graduatepop,
            Graduate_Male: result1[i].gradM,
            Graduate_Female: result1[i].gradF
        }
        statearray.push(array);
        i++;
    }
    myWriteStreamstate.write(JSON.stringify(statearray, null, 2))
});
console.log("second json created");
//For Education Category wise - all India data combined together (third json)
var a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
lineReader.on('line', function(line) {
    var jsonFromLine_three = {};
    var lineSplit_three = line.split(',')
    if (lineSplit_three[4] == 'Total' && lineSplit_three[5] == 'All ages') {
        for (let i = 0, j = 15; i < 10; i++, j += 3) {
            a[i] = a[i] + parseInt(lineSplit_three[j])
        }
    }
});
var arr=['Literate_without_educational','Below_Primary','Primary','Middle','Matric_Secondary','Higher_secondary_Senior_secondary',
'Non_technical_diploma_degree',' Technical_diploma','Graduate_above','Unclassified']
lineReader.on('close',
    function() {
        obj = []
        for(var i=0;i<10;i++)
        {
        obj[i]= {
          name: arr[i],
          value: a[i]
}
        
        }
        myWriteStreameducation.write(JSON.stringify(obj, null, 2))
    })
console.log("Third json created");