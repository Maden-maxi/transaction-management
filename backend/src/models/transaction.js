import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const schema = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true,
        unique: true,
        set: value => Math.round(value)
    },
    cardHolderHash: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    }
});
schema.plugin(mongoosePaginate)


export default mongoose.model('Transaction', schema);