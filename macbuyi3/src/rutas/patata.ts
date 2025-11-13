import { Router } from "express";
import { AuthRequest, verifyToken } from "../middelwares/verifyToken";



const router = Router();


router.get("/", verifyToken, (req:AuthRequest, res)=> {
    res.json({
        message: "Chaval todo correcto",
        user: req.user
    })
})

export default router;