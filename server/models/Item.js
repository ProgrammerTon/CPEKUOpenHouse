import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: 'No description provided.'
    },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;