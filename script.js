
function start(){
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, { camera: true });

    
    tracker.on('track', function (event) {
       // context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function (rect) {
            context.strokeStyle = '#a64ceb';
            //context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
    });

    var gui = new dat.GUI();
    gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    gui.add(tracker, 'stepSize', 1, 5).step(0.1);

   
    
}

//This function takes the total emotion present on an image
//and find the dominant emotion across all the faces.
function findDominantEmotion(totalEmotion){
   var result=Object.keys(totalEmotion).reduce(function(a,b){return totalEmotion[a]>totalEmotion[b]?a:b});
   document.getElementById('result').textContent= result;
   return result;
}

//combine the emotions of the different faces in a picture.
function sumObjectsByKey() {
    return Array.from(arguments).reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k))
          a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
  }
  
  //function that evaluate emotion of each faces and draw it to the screen
  function drawFaces(canvas, context, faces){
    context.clearRect(0, 0, canvas.width, canvas.height);
    var result = findDominantEmotion(faces.scores);
    alert (result);
            var color; 
            switch (result) {
                case 'anger':
                    color = "#FF0000";
                    break;
                case 'neutral':
                    color = "#AFEEEE";
                    break;
                case 'contempt':
                    color = "#4169E1";
                    break;
                case 'disgust':
                    color = "#EE82EE";
                    break;
                case 'fear':
                    color = "#FFFF00";
                    break;
                case 'happiness':
                    color = "#7FFF00";
                    break;
                case 'sadness':
                    color = "#006400";
                    break;
                case 'surprise':
                    color = "#9932CC";
                    break;
        
            }
             //get the face rectangle to draw
             var faceRect= faces.faceRectangle;  
          
             context.strokeStyle = color;
             context.strokeRect(faceRect.left,faceRect.top,faceRect.height,faceRect.width);
 

  }

function clickevent(){
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var frame = captureVideoFrame('video', 'png');
    var apiKey="c108ff473e19468d9416a478d958a2ba";
    var request = new XMLHttpRequest();
    request.open('POST', 'https://api.projectoxford.ai/emotion/v1.0/recognize', true);
    request.setRequestHeader("Content-Type", "application/octet-stream");
    request.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
    request.send(frame.blob);
    

    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            var answer=JSON.parse(request.responseText);
         
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";

            answer.forEach(function(faces) {             
                drawFaces(canvas, context, faces);

                //get the emotions of all the persons present and put them in an array
                var totalEmotion= sumObjectsByKey(faces.scores);

                var dominant = findDominantEmotion(totalEmotion);
              

            }, this);

           
          
        }
    }
 
    // Show the image
    var img = document.getElementById('my-screenshot');
    img.setAttribute('src', frame.dataUri);
}




