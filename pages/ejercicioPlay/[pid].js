import { useRouter } from "next/router";
import Axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Play from "../../components/Play";
import Button from "@mui/material/Button";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { ResetVariables } from "../../components/Detector";

import { EJERCICIO_ENDPOINT } from "../../config";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EjercicioPlayPage() {
  // Recupera el parametro del ID del ejercicio
  // Por ejemplo:
  // http://localhost:3000/ejercicioPlay/E1
  // pid = E1
  // router.query.pid

  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios({
          url: router.query.pid
            ? `${EJERCICIO_ENDPOINT}/${router.query.pid}`
            : null,
        });

        setData(response.data);
      } catch (error) {
        
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Falla en la carga de ejercicio.</div>;
  if (!data) return <div>Cargando...</div>;
  return (
    <div>
      <Link href={`/ejercicio/${router.query.pid}`}>
        <Button onClick={() => ResetVariables()}>
          <ArrowBackOutlinedIcon />
        </Button>
      </Link>
      <Play ejercicio={data[0]}></Play>
    </div>
  );
}
