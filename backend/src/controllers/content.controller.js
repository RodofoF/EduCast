const Content = require('../models/contents/content.model');
const User = require('../models/users/user.model');

async function createContent(req, res) {
    try {
        const { title,  user_id, category, theme, subtitle , content} = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const createContent = await Content.create({ title,  user_id, category, theme, subtitle , content });
        res.status(201).json(createContent);
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ error: 'Failed to create content' });
    }
}
async function getAllContent(req, res) {
    try {
        const content = await Content.findAll();
        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
}

async function getContentById(req, res) {
    try {
        const { id } = req.params;
        const content = await Content.findByPk(id,{
                include: [{ model: User, as: 'user' }],
        });

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
}

async function updateContent(req, res) {
    try {
        const { id } = req.params;
        const {  title,  user_id, category, theme, subtitle , content } = req.body;

        const updatedContent = await Content.findByPk(id);
        if (!updatedContent) {
            return res.status(404).json({ error: 'Content not found' });
        }

        updatedContent.title = title || updatedContent.title;
        updatedContent.user_id = user_id || updatedContent.user_id;
        updatedContent.category = category || updatedContent.category;
        updatedContent.theme = theme || updatedContent.theme;
        updatedContent.subtitle = subtitle || updatedContent.subtitle;
        updatedContent.content = content || updatedContent.content;
        await updatedContent.save();

        res.json(updatedContent);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
}

async function deleteContent(req, res) {
    try {
        const { id } = req.params;

        const content = await Content.findByPk(id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        await content.destroy();
        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ error: 'Failed to delete content' });
    }
}

module.exports = {
    createContent,
    getAllContent,
    getContentById,
    updateContent,
    deleteContent,
};