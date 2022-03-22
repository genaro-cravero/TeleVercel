import React, { useRef, useEffect, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import {
  drawKeypoints,
  drawSkeleton,
  exercises,
  dataExercise,
} from "../lib/utilities";
import "./detector.module.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { isMobile } from "react-device-detect";
import { Button } from "@mui/material";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

var ordenActual = 0;
var seconds;
var minutes;
var intervalRef;
var videoWidth;
var videoHeight;
var video;


function Detector({
  Component,
  pageProps,
  ejercicio,
  detectorStart,
  setRepeticion,
  setSerie,
  setDetectorStart,
  setProgress,
  setBlackOut,
  setSeconds,
  setMinutes,
  setProgressCircle,
  setIntervalRef,
  toleranceRef,
  handleInicioEjercicio,
  progressCircle,
  countdown
}) {
  const alertRefSuccess = useRef(null);
  const alertRefError = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const blackoutRef = useRef(null);
  const [intervalo, setIntervalo] = useState(null);
  const handle = useFullScreenHandle();

  var poseActual;
  var repeticion = 0;
  var serie = 0;

  if (seconds == undefined) {
    ejercicio.config.time >= 60
      ? (seconds =
          ejercicio.config.time - Math.floor(ejercicio.config.time / 60) * 60)
      : (seconds = ejercicio.config.time);
  }

  if (minutes == undefined) {
    ejercicio.config.time >= 60
      ? (minutes = Math.floor(ejercicio.config.time / 60))
      : (minutes = 0);
  }

  //Constantes de los keypoints
  const keypoints = {
    //Left side
    LShoulder: { x: 0, y: 0 },
    LElbow: { x: 0, y: 0 },
    LWrist: { x: 0, y: 0 },
    LeHip: { x: 0, y: 0 },
    LKnee: { x: 0, y: 0 },
    LFoot: { x: 0, y: 0 },

    //Right side
    RShoulder: { x: 0, y: 0 },
    RElbow: { x: 0, y: 0 },
    RWrist: { x: 0, y: 0 },
    RiHip: { x: 0, y: 0 },
    RKnee: { x: 0, y: 0 },
    RFoot: { x: 0, y: 0 },
  };

  //* Load Movenet
  const runMovenet = async () => {
    const detectorConfig = {
      model: {
        maxPoses: 1,
        scoreThreshold: 0.2,
        // umbral de certeza de keypoint. Lo estandar es 0.5.
        // si es muy bajo "adivina" el elemento con tal de mostrar algo.
        // Si es 1, muestra el keypoint solo si esta seguro de lo que es.
      },
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );

    // Se usa el estado "intervalo" para guardar el ultimo ID de intervalo creado.
    // la proxima vez que cambie el estado, se re-ejecuta la funcion
    // y antes de crear el nuevo intervalo, se elimina el anterior
    if (intervalo != null) {
      clearInterval(intervalo);
    }

    const int = window.setInterval(() => {
      detect(detector);
    }, 10);

    setIntervalo(int);
  };

  //*Create Pose Detector
  const detect = async (detector) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //+ Get video properties
      video = webcamRef.current.video;
      videoWidth = webcamRef.current.video.videoWidth;
      videoHeight = webcamRef.current.video.videoHeight;

      //+Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //+Make detections
      const pose = await detector.estimatePoses(video);

      drawCanvas(pose[0], video, videoWidth, videoHeight, canvasRef);

      if (pose[0] === undefined) {
      } else {
        if (detectorStart) {
          // Ejercicio iniciado

          //* Calculate keypoints coordinates

          //identificar que poses se cumplieron

          // Left side
          keypoints.LShoulder.x = pose[0].keypoints[5].x;
          keypoints.LShoulder.y = pose[0].keypoints[5].y;

          keypoints.LElbow.x = pose[0].keypoints[7].x;
          keypoints.LElbow.y = pose[0].keypoints[7].y;

          keypoints.LWrist.x = pose[0].keypoints[9].x;
          keypoints.LWrist.y = pose[0].keypoints[9].y;

          keypoints.LeHip.x = pose[0].keypoints[11].x;
          keypoints.LeHip.y = pose[0].keypoints[11].y;

          keypoints.LKnee.x = pose[0].keypoints[13].x;
          keypoints.LKnee.y = pose[0].keypoints[13].y;

          keypoints.LFoot.x = pose[0].keypoints[15].x;
          keypoints.LFoot.y = pose[0].keypoints[15].y;

          // Right side
          keypoints.RShoulder.x = pose[0].keypoints[6].x;
          keypoints.RShoulder.y = pose[0].keypoints[6].y;

          keypoints.RElbow.x = pose[0].keypoints[8].x;
          keypoints.RElbow.y = pose[0].keypoints[8].y;

          keypoints.RWrist.x = pose[0].keypoints[10].x;
          keypoints.RWrist.y = pose[0].keypoints[10].y;

          keypoints.RiHip.x = pose[0].keypoints[12].x;
          keypoints.RiHip.y = pose[0].keypoints[12].y;

          keypoints.RKnee.x = pose[0].keypoints[14].x;
          keypoints.RKnee.y = pose[0].keypoints[14].y;

          keypoints.RFoot.x = pose[0].keypoints[16].x;
          keypoints.RFoot.y = pose[0].keypoints[16].y;

          //Checkeo de pose, suma de repeticiones y series

          poseActual = ejercicio.config.poses[ordenActual];

          if (
            exercises(
              keypoints.LShoulder,
              keypoints.LElbow,
              keypoints.LWrist,
              keypoints.LeHip,
              keypoints.LKnee,
              keypoints.LFoot,
              keypoints.RShoulder,
              keypoints.RElbow,
              keypoints.RWrist,
              keypoints.RiHip,
              keypoints.RKnee,
              keypoints.RFoot,
              ordenActual
            )
          ) {
            setRepeticion((prevRepeticion) => prevRepeticion + 1);
            repeticion += 1;

            setProgress((prevProgress) =>
              prevProgress > 99
                ? (prevProgress = 100)
                : prevProgress +
                  100 / (ejercicio.config.series * ejercicio.config.repetitions)
            );

            if (ejercicio.config.poses.length > poseActual.order) {
              ordenActual = ordenActual + 1;
            } else if (ejercicio.config.poses.length === poseActual.order) {
              ordenActual = 0;
            }

            if (ejercicio.config.repetitions === repeticion) {
              setRepeticion((prevRepeticion) => (prevRepeticion = 0));
              repeticion = 0;

              setSerie((prevSerie) => prevSerie + 1);

              serie += 1;
            }
          }

          if (ejercicio.config.series === serie) {
            setDetectorStart(!detectorStart);
            repeticion = 0;
            serie = 0;
            ordenActual = 0;
            setProgressCircle(100);
            setRepeticion(0);
            setSerie(0);
            setProgress(0);
            alertRefSuccess.current.hidden = false;
            setMinutes((prevMinutes) =>
              ejercicio.config.time >= 60
                ? (prevMinutes = Math.floor(ejercicio.config.time / 60))
                : 0
            );
            setSeconds((prevSeconds) =>
              ejercicio.config.time >= 60
                ? (prevSeconds =
                    ejercicio.config.time -
                    Math.floor(ejercicio.config.time / 60) * 60)
                : (prevSeconds = ejercicio.config.time)
            );
            ejercicio.config.time >= 60
              ? (seconds =
                  ejercicio.config.time -
                  Math.floor(ejercicio.config.time / 60) * 60)
              : (seconds = ejercicio.config.time);
            ejercicio.config.time >= 60
              ? (minutes = Math.floor(ejercicio.config.time / 60))
              : (minutes = 0);

            clearInterval(intervalRef);
          }
        }
      }
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    // cuando no se detecta poseç => no dibujar.
    if (pose != undefined) {
      drawKeypoints(pose.keypoints, 0.3, ctx);
      drawSkeleton(pose.keypoints, 0.3, ctx);
    }
  };

  useEffect(() => {
    handle.enter();
    runMovenet();
    //Funcion pasa la data al componente Exercise
    setBlackOut(blackoutRef);
    dataExercise(ejercicio, toleranceRef);

    if (detectorStart) {
      alertRefError.current.hidden = true;
      alertRefSuccess.current.hidden = true;
      const timerApi = setInterval(() => {
        if (seconds < 1 && minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          minutes -= 1;
          seconds = 59;
          setSeconds(59);
        } else if (seconds < 1 && minutes == 0) {
          clearInterval(timerApi);
          setDetectorStart(!detectorStart);
          setProgressCircle(100);
          alertRefError.current.hidden = false;
          ejercicio.config.time >= 60
            ? (seconds =
                ejercicio.config.time -
                Math.floor(ejercicio.config.time / 60) * 60)
            : (seconds = ejercicio.config.time);
          ejercicio.config.time >= 60
            ? (minutes = Math.floor(ejercicio.config.time / 60))
            : (minutes = 0);
          setMinutes((prevMinutes) =>
            ejercicio.config.time >= 60
              ? (prevMinutes = Math.floor(ejercicio.config.time / 60))
              : 0
          );
          setSeconds((prevSeconds) =>
            ejercicio.config.time >= 60
              ? (prevSeconds =
                  ejercicio.config.time -
                  Math.floor(ejercicio.config.time / 60) * 60)
              : (prevSeconds = ejercicio.config.time)
          );
          setRepeticion(0);
          setSerie(0);
          serie = 0;
          repeticion = 0;
          ordenActual = 0;
          setProgress(0);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
          seconds -= 1;
        }
      }, 1000);
      setIntervalRef(timerApi);
      intervalRef = timerApi;
    }
  }, [detectorStart]);
  // useEffect con parametros [detectorStart] . Se vuelve a ejecutar cada vez que cambia el estado
  // Le indicamos que vuelva a generar el intervalo, pero sabiendo que esta iniciado o detenido el ejercicio.
 
  //* Create canvas | camera | Text
  return (
    <div className="App">


      <FullScreen handle={handle}>

        <header className="App-header">
        <div ref={alertRefSuccess} hidden={true}>
            <Alert severity="success">
              <AlertTitle>Ejercicio Superado!</AlertTitle>
              Has completado el ejercicio <strong>correctamente.</strong>
            </Alert>
          </div>
          <div ref={alertRefError} hidden={true}>
            <Alert severity="error">
              <AlertTitle>Ejercicio finalizado.</AlertTitle>
              Te has quedado sin <strong>tiempo.</strong>
            </Alert>
          </div>
          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              transform: "rotateY(180deg)",
              width: window.innerWidth,
              height: window.innerHeight,
            }}
          />
          <canvas
            id="canvasSkeleton"
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              transform: "rotateY(180deg)",
              // width: window.innerWidth,
              height: window.innerHeight,
            }}
          />
          <canvas
            ref={blackoutRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              width: window.innerWidth,
              height: window.innerHeight,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0)",
            }}
          />
          <div align='center' ref={countdown}>
            <CircularProgressWithLabel value={progressCircle} />
          </div>
        </header>
        <Button
              variant="contained"
              size="small"
              onClick={() => handleInicioEjercicio()}
            >
              {detectorStart ? "Detener ejercicio" : "Iniciar ejercicio"}
        </Button>
         
      </FullScreen>
    
    </div>
  );
}
export function ResetVariables() {
  clearInterval(intervalRef)
  ordenActual = 0;
  seconds = undefined;
  minutes = undefined;
}

export default Detector;