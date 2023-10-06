const DeliveredContent = require('../model/DeliveredContent');
const mongoose = require('mongoose');

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const logDeliveredContentEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    return logItem;
};

const getAllDeliveredContents = async (req, res) => {
    const deliveredContents = await DeliveredContent.find();
    if (!deliveredContents) return res.status(204).json({ 'message': 'No deliveredContents found.' });
    res.json(deliveredContents);
};

const deleteAllDeliveredContents = async (req, res) => {
    console.log("deleteAllDeliveredContents called");
    const result = await DeliveredContent.deleteMany();
    res.json(result);
};

const createNewDeliveredContent = async (req, res) => {
    if (!req?.body?.title ) {
        return res.status(400).json({ 'message': 'DeliveredContent title required' });
    }

    if (!req?.body?.content ) {
        return res.status(400).json({ 'message': 'DeliveredContent content required' });
    }

    // Check if a deliveredContent with the submitted title already exists
    const duplicateDeliveredContent = await DeliveredContent.find( { title: req.body.title } ).exec();
    if (duplicateDeliveredContent.length > 0) {
        return res.status(400).json({ 'message': 'DeliveredContent title already exists' });
    }

    try {

        // add createdAt fields
        const result = await DeliveredContent.create({
            title: req.body.title,
            content: req.body.content,
            createdAt: Date.now(),
            log: [await logDeliveredContentEvents(`DeliveredContent created with title ${req.body.title}`)]
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
};

const getDeliveredContent = async (req, res) => {
    const deliveredContent = await DeliveredContent.findById(req.params.id);
    if (!deliveredContent) return res.status(404).json({ 'message': 'DeliveredContent not found.' });
    res.json(deliveredContent);
};

const getDeliveredContentByTitle = async (req, res) => {
    const deliveredContent = await DeliveredContent.find({title: req.params.title});
    if (!deliveredContent) return res.status(404).json({ 'message': 'DeliveredContent not found.' });
    res.json(deliveredContent);
};

const modifyDeliveredContent = async (req, res) => {
    const deliveredContent = await DeliveredContent.findById(req.params.id);
    if (!deliveredContent) return res.status(404).json({ 'message': 'DeliveredContent not found.' });

    if (req.body.title) {
        deliveredContent.title = req.body.title;
        // update log
        deliveredContent.log.push(await logDeliveredContentEvents(`Title changed to ${req.body.title}`));
    }
    if (req.body.content) {
        deliveredContent.content = req.body.content;
        // update log
        deliveredContent.log.push(await logDeliveredContentEvents("Content changed"));
    }
    await deliveredContent.save();

    res.json(deliveredContent);
};

const deleteDeliveredContent = async (req, res) => {
    const deliveredContent = await DeliveredContent.findById(req.params.id);
    if (!deliveredContent) return res.status(404).json({ 'message': 'DeliveredContent not found.' });

    await deliveredContent.remove();
    res.status(204).json({ 'message': 'DeliveredContent deleted.' });
};

const getDeliveredContentCreatedAt = async (req, res) => {
    const deliveredContent = await DeliveredContent.findById(req.params.id);
    if (!deliveredContent) return res.status(404).json({ 'message': 'DeliveredContent not found.' });
    res.json(deliveredContent.createdAt);
};

const getDeliveredContentLog = async (req, res) => {
    const deliveredContent = await DeliveredContent.findById(req.params.id);
    if (!deliveredContent) return res.status(404).json({ 'message': 'DeliveredContent not found.' });
    res.json(deliveredContent.log);
};

module.exports = {
    getAllDeliveredContents,
    deleteAllDeliveredContents,
    createNewDeliveredContent,
    getDeliveredContent,
    modifyDeliveredContent,
    deleteDeliveredContent,
    getDeliveredContentByTitle,
    getDeliveredContentCreatedAt,
    getDeliveredContentLog
};
