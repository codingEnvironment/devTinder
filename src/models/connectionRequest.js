const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        required: true,
    }
}, { timestamps: true });

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// pre hook to prevent users from sending connection requests to themselves
connectionRequestSchema.pre('save', function () {
    console.log('Pre-save hook executed for ConnectionRequest');
    if (this.fromUserId.toString() === this.toUserId.toString()) {
        throw new Error("You cannot send a connection request to yourself")
    }
});
//post hook to log when a connection request is created
connectionRequestSchema.post('save', function (doc) {
    console.log(`Post-save hook executed for ConnectionRequest`);
    console.log(`Connection request from ${doc.fromUserId} to ${doc.toUserId} has been created with status ${doc.status}`);
});
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;