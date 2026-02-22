import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { vitMailFormat } from "../Middlewares/Format/vitMailFormat.js";
import { rateLimiter_10min_10req, rateLimiter_10min_100req } from "../Middlewares/rateLimiter.js";
import { loginUser, registerUser, verifyEmail, resendVerificationEmail, requestPasswordReset, updatePassword } from "../Controllers/AuthController.js";

const router = express.Router();

router.use(bodyParser.json());

router.post('/register', rateLimiter_10min_10req, vitMailFormat,async (req, res) => {
    await registerUser(req, res);
  });
  
  router.post('/login', rateLimiter_10min_100req, async (req, res) => {
    await loginUser(req, res);
  });
  
  router.post('/verify-email', rateLimiter_10min_100req, async (req, res) => {
    await verifyEmail(req, res);
  });
  
  router.post('/resend-verify-email', rateLimiter_10min_10req, async (req, res) => {
    await resendVerificationEmail(req, res);
  });
  
  router.post('/password-reset', rateLimiter_10min_10req, async (req, res) => {
    await requestPasswordReset(req, res);
  });
  
  router.post('/update-password', rateLimiter_10min_100req, async (req, res) => {
    await updatePassword(req, res);
  });

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login", 
    }),
    (req, res) => {
      const token = req.user.token;
      console.log("token1: ", token)
      res.redirect(`${process.env.CLIENT_URL}/?token=${token}`); 
    }
  );
  

export default router;