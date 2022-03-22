import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import TitleLeft from "./styles/TitleLeft";
import Title from "./styles/Title";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import Detector from "./Detector";
import TextField from '@mui/material/TextField';

const CabeceraStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr auto auto;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;
  margin-top: 0rem;
  margin-bottom: 0.5rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;
const SubTituloStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;
  margin-top: 0rem;
  margin-bottom: 0.5rem;
`;


export default function Play({ ejercicio }) {
  // la props ejercicio tiene toda la definicion del ejercicio:
  // titulo, descripcion, instrucciones, series, repeticiones, tiempo, poses
  // en caso de necesitar agregar algun campo nuevo hacerlo en /pages/api/data.js en todos los ejercicios

  const [progress, setProgress] = useState(0);
  const [repeticion, setRepeticion] = useState(0);
  const [serie, setSerie] = useState(0);
  const [detectorStart, setDetectorStart] = useState(false);
  const [progressCircle, setProgressCircle] = useState(100);
  const [blackOut, setBlackOut] = useState()
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [intervalRef, setIntervalRef] = useState()
  const [toleranceRef, setToleranceRef] = useState(ejercicio.config.tolerance)

  

  
  const countdown = useRef(null);
  
  
  

  

  useEffect(() => {
    
    countdown.current.hidden = true;
    setMinutes((prevMinutes) =>
      ejercicio.config.time >= 60 ? prevMinutes = Math.floor(ejercicio.config.time/60) : 0,
    );
    setSeconds((prevSeconds) =>
      ejercicio.config.time >= 60 ? prevSeconds = ejercicio.config.time - Math.floor(ejercicio.config.time/60)*60: prevSeconds = ejercicio.config.time,

    );    
    
    
    
  }, []);    


  const handleInicioEjercicio = () => {
    // funcion que inicia ejercicio
    // inicio de camara y conteo progresivo
    if(detectorStart){
      setProgressCircle(100)
      setDetectorStart(!detectorStart);
      clearInterval(intervalRef)
  
      
    }else{
      countdown.current.hidden = false;
      blackOut.current.style.backgroundColor= "rgba(0,0,0,0.65)"
      
      
      
      const timer = setInterval(() => {
        setProgressCircle((prevProgressCircle) =>
          prevProgressCircle < 1 ? countdownFinished(timer) : prevProgressCircle - 33.3
        );
      }, 1000);
        
    };

  };

  const countdownFinished = (t) => {
    setProgressCircle(0);
    setDetectorStart(!detectorStart);
    clearInterval(t);
    countdown.current.hidden = true;
    blackOut.current.style.backgroundColor= "rgba(0,0,0,0)" 
        
  };
    
  
  return (
    <>
    
      <CabeceraStyles>
        <Head>
          {/* Cambiar nombre de la pestaña por si es necesario. Tal vez mostrar el progreso?*/}
          <title>DOC24 | {Math.round(progress)} %</title>
        </Head>

        <TitleLeft>
          <Link href={`/ejercicio/${ejercicio.id}`}>{ejercicio.title}</Link>
        </TitleLeft>
        
        <Stack direction="row" spacing={3}>
          <Title>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleInicioEjercicio()}
            >
              {detectorStart ? "Detener ejercicio" : "Iniciar ejercicio"}
            </Button>
          </Title>
        </Stack>
      </CabeceraStyles>
      <TextField type="number" sx={{marginLeft: "20px"}}label="Tolerancia" defaultValue={ejercicio.config.tolerance} id="inputTolerance" onChange={() => {setToleranceRef(document.getElementById("inputTolerance").value)}} />
      <SubTituloStyles>
        <Typography variant="h4" gutterBottom component="div" margin="auto">
          Repeticiones: {repeticion} de {ejercicio.config.repetitions} / Serie:{" "}
          {serie} de {ejercicio.config.series} / Tiempo restante: 0{minutes}:{seconds <= 9? 0 : "" }{seconds}
        </Typography>
      </SubTituloStyles>
      <SubTituloStyles>
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </SubTituloStyles>

      <Box
      sx={{
        width: 500,
        maxWidth: '50%',
      }}>    
      
      </Box>
      
      <Detector ejercicio={ejercicio} detectorStart={detectorStart} setDetectorStart={setDetectorStart} setRepeticion={setRepeticion} setSerie={setSerie} setProgress={setProgress} setBlackOut={setBlackOut} setSeconds={setSeconds} setMinutes={setMinutes} setProgressCircle={setProgressCircle} setIntervalRef={setIntervalRef} toleranceRef={toleranceRef} handleInicioEjercicio={handleInicioEjercicio} progressCircle={progressCircle} countdown={countdown}></Detector>
           
      
    </>
  );
}


