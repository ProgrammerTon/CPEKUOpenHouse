import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Item name is required.' });
    }

    const newItem = new Item({ name, description });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;