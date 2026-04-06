const OnDemand = require('../models/ondemand/ondemand.model');
const User = require('../models/users/user.model');

function getUploadedFilePath(file) {
    // Se nao houver arquivo enviado, nao temos caminho para salvar.
    if (!file) {
        return null;
    }

    // Define a pasta com base no campo recebido no multipart/form-data.
    const folder = file.fieldname === 'video' ? 'videos' : 'thumbnails';
    return `/uploads/ondemand/${folder}/${file.filename}`;
}

async function createOnDemand(req, res) {
    try {
        // Campos de texto enviados no body.
        const { title, subtitle, category, theme, user_id, description, thumbnail_url, video_url } = req.body;

        // Arquivos enviados pelo multer.
        const uploadedVideo = req.files?.video?.[0];
        const uploadedThumbnail = req.files?.thumbnail?.[0];

        // Prioridade: arquivo enviado > URL manual no body.
        const resolvedVideoUrl = getUploadedFilePath(uploadedVideo) || video_url;
        const resolvedThumbnailUrl = getUploadedFilePath(uploadedThumbnail) || thumbnail_url;

        // Regra minima para criar o registro.
        if (!title || !resolvedVideoUrl) {
            return res.status(400).json({ error: 'Title and video URL are required' });
        }

        // Cria o conteudo on-demand no banco.
        const newOnDemand = await OnDemand.create({
            title,
            subtitle,
            category,
            theme,
            user_id,
            description,
            thumbnail_url: resolvedThumbnailUrl,
            video_url: resolvedVideoUrl,
        });
        res.status(201).json(newOnDemand);
    } catch (error) {
        console.error('Error creating on-demand content:', error);
        res.status(500).json({ error: 'Failed to create on-demand content' });
    }
}

async function getAllOnDemands(req, res) {
    try {
        // Lista todos os conteudos com dados do usuario relacionado.
        const onDemands = await OnDemand.findAll({
            include: [{ model: User, as: 'user' }],
        });
        res.json(onDemands);
    } catch (error) {
        console.error('Error fetching on-demand content:', error);
        res.status(500).json({ error: 'Failed to fetch on-demand content' });
    }
}

async function getOnDemandById(req, res) {
    try {
        const { id } = req.params;

        // Busca um conteudo por ID com dados do usuario.
        const onDemand = await OnDemand.findByPk(id, {
            include: [{ model: User, as: 'user' }],
        });

        if (!onDemand) {
            return res.status(404).json({ error: 'On-demand content not found' });
        }

        res.json(onDemand);
    } catch (error) {
        console.error('Error fetching on-demand content:', error);
        res.status(500).json({ error: 'Failed to fetch on-demand content' });
    }
}

async function updateOnDemand(req, res) {
    try {
        const { id } = req.params;

        // Campos de texto enviados no body.
        const { title, subtitle, category, theme, user_id, description, thumbnail_url, video_url } = req.body;

        // Arquivos enviados pelo multer (opcionais no update).
        const uploadedVideo = req.files?.video?.[0];
        const uploadedThumbnail = req.files?.thumbnail?.[0];

        // Primeiro localiza o registro.
        const onDemand = await OnDemand.findByPk(id);
        if (!onDemand) {
            return res.status(404).json({ error: 'On-demand content not found' });
        }

        // Atualiza apenas o que foi enviado.
        onDemand.title = title || onDemand.title;
        onDemand.subtitle = subtitle || onDemand.subtitle;
        onDemand.category = category || onDemand.category;
        onDemand.theme = theme || onDemand.theme;
        onDemand.user_id = user_id || onDemand.user_id;
        onDemand.description = description || onDemand.description;

        // Prioridade: novo arquivo > URL enviada no body > valor atual do banco.
        onDemand.thumbnail_url = getUploadedFilePath(uploadedThumbnail) || thumbnail_url || onDemand.thumbnail_url;
        onDemand.video_url = getUploadedFilePath(uploadedVideo) || video_url || onDemand.video_url;

        await onDemand.save();
        res.json(onDemand);
    } catch (error) {
        console.error('Error updating on-demand content:', error);
        res.status(500).json({ error: 'Failed to update on-demand content' });
    }
}

async function deleteOnDemand(req, res) {
    try {
        const { id } = req.params;

        // Remove o registro pelo ID.
        const deletedCount = await OnDemand.destroy({ where: { id } });

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'On-demand content not found' });
        }

        res.json({ message: 'On-demand content deleted successfully' });
    } catch (error) {
        console.error('Error deleting on-demand content:', error);
        res.status(500).json({ error: 'Failed to delete on-demand content' });
    }
}

module.exports = {
    createOnDemand,
    getAllOnDemands,
    getOnDemandById,
    updateOnDemand,
    deleteOnDemand,
};