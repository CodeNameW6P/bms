import { Router } from "express";
import { createFlat, getFlats, getFlat, updateFlat, deleteFlat } from "../controllers/flat.controller";

const flatRouter = Router();

flatRouter.post("/", createFlat);
flatRouter.get("/", getFlats);
flatRouter.get("/:number", getFlat);
flatRouter.put("/:number", updateFlat);
flatRouter.delete("/:number", deleteFlat);

export default flatRouter;
