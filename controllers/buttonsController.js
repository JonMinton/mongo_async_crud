const Button = require('../model/Button');
const mongoose = require('mongoose');


const { format } = require('date-fns');
const { v4: uuid } = require('uuid');


const logButtonEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    return logItem;
}




const getAllButtons = async (req, res) => {
    const buttons = await Button.find();
    if (!buttons) return res.status(204).json({ 'message': 'No buttons found.' });
    res.json(buttons);
}

const deleteAllButtons = async (req, res) => {
    console.log("deleteAllButtons called");
    const result = await Button.deleteMany();
    res.json(result);
}

const resetAllButtons = async (req, res) => {
    console.log("resetAllButtons called");
    const result = await Button.updateMany({}, { timesPressed: 0 });
    res.json(result);
}


const createNewButton = async (req, res) => {
    if (!req?.body?.name ) {
        return res.status(400).json({ 'message': 'Button name required' });
    }

    // Check if a button with the submitted name already exists
    const duplicateButton = await Button.find( { name: req.body.name } ).exec();
    if (duplicateButton.length > 0) {
        return res.status(400).json({ 'message': 'Button name already exists' });
    }

    try {
        const result = await Button.create({
            name: req.body.name,
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const renameButton = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const button = await Button.findOne({ _id: req.params.id }).exec();
    if (!button) {
        return res.status(204).json({ "message": `No button matches ID ${req.params.id}.` });
    }
    if (req.body?.name) {
        const oldName = button.name;
        button.name = req.body.name;
        button.log.push(await logButtonEvents(`Button name changed from ${oldName} to ${button.name}`));
        const result = await button.save();
        res.json(result);    
    }
}

const incrementButton = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const button = await Button.findOne({ _id: req.params.id }).exec();
    if (!button) {
        return res.status(204).json({ "message": `No button matches ID ${req.params.id}.` });
    }
    button.timesPressed += 1;
    // add to log
    button.log.push(await logButtonEvents(`Button pressed`));
    const result = await button.save();
    res.json(result);
}

const resetButton = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }
    const button = await Button.findOne({ _id: req.params.id }).exec();  
    if (!button) {
        return res.status(204).json({ "message": `No button matches ID ${req.params.id}.` });
    }
    button.timesPressed = 0;
    // add to log
    button.log.push(await logButtonEvents(`Button reset`));
    const result = await button.save();
    res.json(result);
}

const deleteButton = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Button ID required.' });

    const button = await Button.findOne({ _id: req.params.id }).exec();
    if (!button) {
        return res.status(204).json({ "message": `No button matches ID ${req.params.id}.` });
    }
    const result = await button.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getButton = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Button ID required.' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ 'message': 'Invalid ID.' });

    try {
        const button = await Button.findById(id).exec();
        
        if (!button) {
            return res.status(204).json({ "message": `No button matches ID ${id}.` });
        }
        res.json(button);
    } catch (err) {
        next (err);
    }
}

const getButtonCreatedAt = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Button ID required.' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ 'message': 'Invalid ID.' });

    try {
        const button = await Button.findById(id).exec();
        
        if (!button) {
            return res.status(204).json({ "message": `No button matches ID ${id}.` });
        }
        res.json(button.createdAt);
    } catch (err) {
        next (err);
    }
    
}

const getButtonLogs = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Button ID required.' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ 'message': 'Invalid ID.' });

    try {
        const button = await Button.findById(id).exec();
        
        if (!button) {
            return res.status(204).json({ "message": `No button matches ID ${id}.` });
        }
        res.json(button.log);
    } catch (err) {
        next (err);
    }


}

module.exports = {
    getAllButtons,
    deleteAllButtons,
    resetAllButtons,
    createNewButton,
    getButtonCreatedAt,
    getButtonLogs,
    incrementButton,
    renameButton,  
    resetButton,
    deleteButton,
    getButton
}

// Compare this snippet from routes/buttonRoutes.js: