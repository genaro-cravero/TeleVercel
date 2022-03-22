import { useRouter } from "next/router";
import Axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Collapse } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { EJERCICIO_ENDPOINT } from "../../config";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest
  })
}));

export default function EjercicioPage() {
  // Recupera el parametro del ID del ejercicio
  // Por ejemplo:
  // http://localhost:3000/ejercicio/E1
  // pid = E1
  // router.query.pid
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios({
          url: router.query.pid
            ? `${EJERCICIO_ENDPOINT}/${router.query.pid}`
            : null
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
    <Grid>
      <Link href="/">
        <Button>
          <ArrowBackOutlinedIcon />
        </Button>
      </Link>
      <Card sx={{ maxWidth: 700, minWidth: 350 }}>
        <CardHeader
          avatar={<Avatar alt={data[0].title} src={data[0].icoURL} />}
          title={
            <Typography gutterBottom variant="h4" component="div">
              {data[0].title}
            </Typography>
          }
        />
        <CardMedia
          alt={data[0].title}
          component="img"
          image={data[0].imageURL}
        />
        <CardContent>
          <Typography paragraph>Descripcion:</Typography>
          <Typography gutterBottom variant="h6" align="justify" component="div">
            {data[0].description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Link id={data[0].id} href={`/ejercicioPlay/${data[0].id}`}>
            <Button size="medium">Iniciar ejercicio</Button>
          </Link>
          {/*Button size="medium">Editar Configuracion</Button>*/}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="mostrar mas"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1">Instrucciones:</Typography>
            <Typography variant="body2" align="justify" color="text.secondary">
              {data[0].instructions}
            </Typography>
            {data[0].videoURL != "" && (
              <CardMedia
                alt={data[0].title}
                component="iframe"
                height={300}
                image={data[0].videoURL}
                autoPlay
              />
            )}
            <Typography paragraph></Typography>
            <Typography variant="sub1">Configuracion:</Typography>
            <Typography variant="body2" color="text.secondary">
              Tiempo limite: {data[0].config.time} segundos.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Numero de series: {data[0].config.series}{" "}
              {data[0].config.series == 1 ? "vez" : "veces"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Numero de repeticiones: {data[0].config.repetitions}{" "}
              {data[0].config.repetitions == 1 ? "vez" : "veces"}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
}
