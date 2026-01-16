import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";

const router = express.Router();
router.use(authenticate);

router.post("/", authorize(['admin']), createUser); // Only admin can create users directly? Or maybe signup is public (auth routes)
router.get("/", authorize(['admin']), getUsers);
router.get("/:id", getUserById); // User can see themselves, or admin can see anyone. Logic needs check in controller or here? Controller check is better for self.
router.put("/:id", updateUser); // Same as above
router.delete("/:id", authorize(['admin']), deleteUser);

export default router;
