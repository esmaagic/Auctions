const express = require('express');
const Category = require('../models/Category'); // Adjust the path as needed
const router = express.Router();

// Route to create a new category
router.post('/', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to delete a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }

        res.send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get all categories sorted alphabetically
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }); // Sort by name in ascending order (alphabetical)
        res.send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id) // Sort by name in ascending order (alphabetical)
        res.send(category.name);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
