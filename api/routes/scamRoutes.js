import express from 'express';
import Scam from '../models/Scam.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const scam = await Scam.create(req.body);
        res.status(201).json(scam);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {   
    try {
        const scams = await Scam.find();
        res.json(scams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const scam = await Scam.findById(req.params.id);
        if (!scam) return res.status(404).json({ error: 'Scam not found' });
        res.json(scam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;