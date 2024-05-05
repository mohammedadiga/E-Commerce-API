import mongoose from 'mongoose';

export default function validateMongodbid(id) {
    if (!id) {
        throw new Error('ID is required');
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
        throw new Error('This id is not a valid ObjectId');
    }
}

