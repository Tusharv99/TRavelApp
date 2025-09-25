const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    fileType: {
        type: String,
        required: true,
        enum: ['flight-ticket', 'train-ticket', 'hotel-booking', 'car-rental', 'valid-id', 'other']
    },
    fileUrl: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

// Add index for better query performance
documentSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('Document', documentSchema);