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

router.get('/categories', async (req, res) => {
    try {
        const categories = await Scam.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/category/:category', async (req, res) => {
    try {
        const scams = await Scam.find({ category: req.params.category });
        res.json(scams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/recent', async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentScams = await Scam.find({ createdAt: { $gte: oneWeekAgo } });
        res.json(recentScams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const scams = await Scam.find({ submittedBy: req.params.userId });
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
