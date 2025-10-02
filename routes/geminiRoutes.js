import { Router } from 'express';
import generateContent from '../controllers/geminiController.js';

const router = Router();

router.post('/generate', generateContent);

export default router;
