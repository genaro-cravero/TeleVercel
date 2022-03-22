import Axios from "axios";
import { useState, useEffect } from "react";

import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { EJERCICIOS_ENDPOINT } from "../config";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EjercicioPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios({
          url: EJERCICIOS_ENDPOINT,
        });

        setData(response.data);
      } catch (error) {
        
        setError(true);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>Falla en la carga de ejercicios.</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {data.map((ejercicio) => (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={ejercicio.title} src={ejercicio.icoURL} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="h4" gutterBottom component="div">
                <Link id={ejercicio.id} href={`/ejercicio/${ejercicio.id}`}>
                  {ejercicio.title}
                </Link>
              </Typography>}
              secondary={<Typography
                variant="h6"
                align="justify"
                gutterBottom
                component="div"
              >
                {ejercicio.description}
              </Typography>}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
}
