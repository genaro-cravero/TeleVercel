// se usa la libreria posenet en lugar de poseDetection
// trae por defecto la funcion: getAdjacentKeyPoints
// son los puntos que se unen y arman la figura
// https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73okvBAB8zr5Li3Ve233KIrXcmnBR1q5fKuh2suA-3U7pyUg2-_sKXGgD8SY-1tgLShI&usqp=CAU

import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

const color = "aqua";
const errorColor = "red";

const boundingBoxColor = "red";
const lineWidth = 3.3;

export const tryResNetButtonName = "tryResNetButton";
export const tryResNetButtonText = "[New] Try ResNet50";
const tryResNetButtonTextCss = "width:100%;text-decoration:underline;";
const tryResNetButtonBackgroundCss = "background:#e61d5f;";

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

function setDatGuiPropertyCss(propertyText, liCssString, spanCssString = "") {
  var spans = document.getElementsByClassName("property-name");
  for (var i = 0; i < spans.length; i++) {
    var text = spans[i].textContent || spans[i].innerText;
    if (text == propertyText) {
      spans[i].parentNode.parentNode.style = liCssString;
      if (spanCssString !== "") {
        spans[i].style = spanCssString;
      }
    }
  }
}

export function updateTryResNetButtonDatGuiCss() {
  setDatGuiPropertyCss(
    tryResNetButtonText,
    tryResNetButtonBackgroundCss,
    tryResNetButtonTextCss
  );
}

/**
 * Toggles between the loading UI and the main canvas UI.
 */
export function toggleLoadingUI(
  showLoadingUI,
  loadingDivId = "loading",
  mainDivId = "main"
) {
  if (showLoadingUI) {
    document.getElementById(loadingDivId).style.display = "block";
    document.getElementById(mainDivId).style.display = "none";
  } else {
    document.getElementById(loadingDivId).style.display = "none";
    document.getElementById(mainDivId).style.display = "block";
  }
}

function toTuple({ y, x }) {
  return [y, x];
}

function checkKeypoints(keypoints) {
  let isComplete = true;
  keypoints.forEach((keypoint) => {
    if (keypoint.score < 0.15) {
      isComplete = false;
    }
  });
  return isComplete ? color : errorColor;
}

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );
  let color = checkKeypoints(keypoints);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0]), //.position
      toTuple(keypoints[1]), //.position
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, checkKeypoints(keypoints));
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
export function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX,
    boundingBox.minY,
    boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY
  );

  ctx.strokeStyle = boundingBoxColor;
  ctx.stroke();
}

/**
 * Converts an arary of pixel data into an ImageData object
 */
export async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);

  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;

    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw an image on a canvas
 */
export function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);
}

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
  const ctx = canvas.getContext("2d");
  const radius = 5;
  const scaledValues = heatMapValues.mul(tf.scalar(outputStride, "int32"));

  drawPoints(ctx, scaledValues, radius, checkKeypoints(keypoints));
}

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
function drawPoints(ctx, points, radius, color) {
  const data = points.buffer().values;

  for (let i = 0; i < data.length; i += 2) {
    const pointY = data[i];
    const pointX = data[i + 1];

    if (pointX !== 0 && pointY !== 0) {
      ctx.beginPath();
      ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

export function find_angle(A, B, C) {
  //? Function calculate 3 points angle
  let AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
  let BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
  let AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
  return toDegree(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)));
}

//? Convert number to degree
function toDegree(Num) {
  return Math.ceil((Num * 180) / Math.PI);
}

//? Tolerance level
export function toleranceLvl(Num) {
  return [Num * (1 + toleranceRef / 100), Num * (1 - toleranceRef / 100)];
}

//+Ejercicio
var exercise;
var angles;
var ordenActual = 0;
var toleranceRef;

export function exercises(
  LShoulder,
  LElbow,
  LWrist,
  LeHip,
  LKnee,
  LFoot,
  RShoulder,
  RElbow,
  RWrist,
  RiHip,
  RKnee,
  RFoot,
  ordenActual
) {
  angles = exercise.config.poses[ordenActual].pose;
  return (
    toleranceLvl(angles.angle_LShoulder_LElbow_LWrist)[0] >=
      find_angle(LShoulder, LElbow, LWrist) &&
    find_angle(LShoulder, LElbow, LWrist) >=
      toleranceLvl(angles.angle_LShoulder_LElbow_LWrist)[1] &&
    toleranceLvl(angles.angle_RShoulder_RElbow_RWrist)[0] >=
      find_angle(RShoulder, RElbow, RWrist) &&
    find_angle(RShoulder, RElbow, RWrist) >=
      toleranceLvl(angles.angle_RShoulder_RElbow_RWrist)[1] &&
    toleranceLvl(angles.angle_LHip_LKnee_LFoot)[0] >=
      find_angle(LeHip, LKnee, LFoot) &&
    find_angle(LeHip, LKnee, LFoot) >=
      toleranceLvl(angles.angle_LHip_LKnee_LFoot)[1] &&
    toleranceLvl(angles.angle_RHip_RKnee_RFoot)[0] >=
      find_angle(RiHip, RKnee, RFoot) &&
    find_angle(RiHip, RKnee, RFoot) >=
      toleranceLvl(angles.angle_RHip_RKnee_RFoot)[1] &&
    toleranceLvl(angles.angle_LElbow_LShoulder_LHip)[0] >=
      find_angle(LElbow, LShoulder, LeHip) &&
    find_angle(LElbow, LShoulder, LeHip) >=
      toleranceLvl(angles.angle_LElbow_LShoulder_LHip)[1] &&
    toleranceLvl(angles.angle_RElbow_RShoulder_RHip)[0] >=
      find_angle(RElbow, RShoulder, RiHip) &&
    find_angle(RElbow, RShoulder, RiHip) >=
      toleranceLvl(angles.angle_RElbow_RShoulder_RHip)[1] &&
    toleranceLvl(angles.angle_LShoulder_LHip_LKnee)[0] >=
      find_angle(LShoulder, LeHip, LKnee) &&
    find_angle(LShoulder, LeHip, LKnee) >=
      toleranceLvl(angles.angle_LShoulder_LHip_LKnee)[1] &&
    toleranceLvl(angles.angle_RShoulder_RHip_RKnee)[0] >=
      find_angle(RShoulder, RiHip, RKnee) &&
    find_angle(RShoulder, RiHip, RKnee) >=
      toleranceLvl(angles.angle_RShoulder_RHip_RKnee)[1]
  );
}

export function dataExercise(ejercicioData, toleranceR) {
  exercise = ejercicioData;
  toleranceRef = toleranceR;
}
