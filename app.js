const modelParams = {
  flipHorizontal: true, // flip e.g for video
  imageScaleFactor: 0.7, // reduce input image size for gains in speed.
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.89 // confidence threshold for predictions.
};

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

const video = document.getElementById("video");
const audio = document.getElementById("audio");
let model;

handTrack.startVideo(video).then(status => {
  if (status) {
    navigator.getUserMedia(
      { video: {} },
      stream => {
        video.srcObject = stream;

        // Run detection
        setInterval(runDetection, 300);
      },
      err => console.log(err)
    );
  }
});

function runDetection() {
  model.detect(video).then(predictions => {
    // Run only when there is a movement recognized
    if (predictions.length !== 0) {
      let hand1 = predictions[0].bbox;
      let x = hand1[0];
      let y = hand1[1];

      if (y > 300) {
        if (x < 200) {
          audio.src = "a-major.wav";
        } else if (x > 400) {
          audio.src = "e-major.wav";
        } else if (x > 300) {
          audio.src = "c-major.wav";
        } else if (x > 200) {
          audio.src = "b-major.wav";
        }
      }

      audio.play();
    }
  });
  requestAnimationFrame(runDetection);
}

handTrack.load(modelParams).then(lmodel => {
  model = lmodel;
});
