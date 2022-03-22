// https://nextjs.org/docs/api-routes/introduction
import { data } from "../data";

export default function userHandler(req, res) {
  const {
    query: { pid },
    method,
  } = req;

  switch (method) {
    case "GET":
      const filter = data.filter((ej) => ej.id == pid);
      res.status(200).json(filter[0]);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
