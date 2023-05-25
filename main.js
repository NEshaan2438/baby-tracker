i = 0;
status1 = "";
status2 = "";
results1 = [];
totalConfidence = 0;
averageConfidence = 0;

function setup() {
    canvas = createCanvas(1450, 850);

    objectDetector = ml5.objectDetector("cocossd", modelLoaded);

    video = createCapture(VIDEO);
    video.hide();

    document.getElementById("status").innerHTML = "<br> Baby detection has begun... <br> <br>";
}

function draw() {
    image(video, 0, 0, 1450, 850);

    strokeWeight(5);

    if (status1 == true) {
        objectDetector.detect(video, gotResults);
    }

    for (let i = 0; i < results1.length; i++) { 
        totalConfidence = Number(totalConfidence) + Number(results1[i].confidence);
        averageConfidence = Math.floor((Number(totalConfidence) / Number(results1.length)) * 100);
        console.log(averageConfidence);  

        stroke("black");
        strokeWeight(5);
        rect(results1[i].x * 1450/video.width, results1[i].y * 850/video.height, results1[i].width * 1450/video.width, results1[i].height * 850/video.height);
        strokeWeight(1);
        text(results1[i].label + "      " + Math.floor(results1[i].confidence * 100) + "%", results1[i].x * 1450/video.width, results1[i].y * 850/video.height - 10);
        noFill();
    }
}

function modelLoaded() {
    console.log("CocoSSD is loaded.");
    status1 = true;
}

function gotResults(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        results1 = results;
        totalConfidence = 0;
        status2 = "";
        for (let i = 0; i < results1.length; i++) {
            if (results1[i].label == "person") {
                status2 = true;
            }
        }
        if (status2 == true) {
            document.getElementById("status").innerHTML = "<br> Objects have been detected with an average of " + averageConfidence + "% confidence. A baby has been spotted.<br> <br>";
        } else if (results1.length == 0) {
            document.getElementById("status").innerHTML = "<br> No objects have been detected and no baby has been spotted.<br> <br>";
        } else {
            document.getElementById("status").innerHTML = "<br> Objects have been detected with an average of " + averageConfidence + "% confidence. A baby has not been spotted.<br> <br>";
        }
    }
}