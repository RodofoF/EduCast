const Live = require('../models/live/live.model');
const User = require('../models/users/user.model');

function getUploadedFilePath(file) {
    // Se nao houver arquivo enviado, nao temos caminho para salvar.
    if (!file) {
        return null;
    }

    // Define a pasta com base no campo recebido no multipart/form-data.
    const folder = file.fieldname === 'video' ? 'videos' : 'thumbnails';
    return `/uploads/live/${folder}/${file.filename}`;
}

async function createLive(req, res) {
    try {
        // Campos de texto enviados no body.
        const { title, subtitle, category, theme, user_id, description, thumbnail_url, video_url } = req.body;

        // Arquivos enviados pelo multer.
        const uploadedThumbnail = req.files?.thumbnail?.[0];

        // Prioridade: arquivo enviado > URL manual no body.
        // Para live, não é possivel enviar arquivo, apenas URL.
        const resolvedThumbnailUrl = getUploadedFilePath(uploadedThumbnail) || thumbnail_url;

        // Regra minima para criar o registro.
        if (!title || !video_url) {
            return res.status(400).json({ error: 'Title and video URL are required' });
        }

        // Cria a live no banco.
        const newLive = await Live.create({
            title,
            subtitle,
            category,
            theme,
            user_id,
            description,
            thumbnail_url: resolvedThumbnailUrl,
            video_url,
        });
        res.status(201).json(newLive);
    } catch (error) {
        console.error('Error creating live content:', error);
        res.status(500).json({ error: 'Failed to create live content' });
    }
}

async function getAllLives(req, res) {
    try {
        // Lista todas as lives com dados do usuario relacionado.
        const lives = await Live.findAll({
            include: [{ model: User, as: 'user' }],
        });
        res.json(lives);
    } catch (error) {
        console.error('Error fetching live content:', error);
        res.status(500).json({ error: 'Failed to fetch live content' });
    }
}

async function getLiveById(req, res) {
    try {
        const { id } = req.params;

        // Busca uma live por ID com dados do usuario.
        const live = await Live.findByPk(id, {
            include: [{ model: User, as: 'user' }],
        });

        if (!live) {
            return res.status(404).json({ error: 'Live content not found' });
        }

        res.json(live);
    } catch (error) {
        console.error('Error fetching live content:', error);
        res.status(500).json({ error: 'Failed to fetch live content' });
    }
}

async function updateLive(req, res) {
    try {
        const { id } = req.params;

        // Campos de texto enviados no body.
        const { title, subtitle, category, theme, user_id, description, thumbnail_url, video_url } = req.body;

        // Arquivos enviados pelo multer (opcionais no update).
        const uploadedThumbnail = req.files?.thumbnail?.[0];

        // Primeiro localiza o registro.
        const live = await Live.findByPk(id);
        if (!live) {
            return res.status(404).json({ error: 'Live content not found' });
        }

        // Atualiza apenas o que foi enviado.
        live.title = title || live.title;
        live.subtitle = subtitle || live.subtitle;
        live.category = category || live.category;
        live.theme = theme || live.theme;
        live.user_id = user_id || live.user_id;
        live.description = description || live.description;

        // Prioridade: novo arquivo > URL enviada no body > valor atual do banco.
        live.thumbnail_url = getUploadedFilePath(uploadedThumbnail) || thumbnail_url || live.thumbnail_url;
        live.video_url = video_url || live.video_url;

        await live.save();
        res.json(live);
    } catch (error) {
        console.error('Error updating live content:', error);
        res.status(500).json({ error: 'Failed to update live content' });
    }
}

async function deleteLive(req, res) {
    try {
        const { id } = req.params;

        // Remove o registro pelo ID.
        const deletedCount = await Live.destroy({ where: { id } });

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Live content not found' });
        }

        res.json({ message: 'Live content deleted successfully' });
    } catch (error) {
        console.error('Error deleting live content:', error);
        res.status(500).json({ error: 'Failed to delete live content' });
    }
}

module.exports = {
    createLive,
    getAllLives,
    getLiveById,
    updateLive,
    deleteLive,
};