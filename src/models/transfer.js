import thinky from '../thinky';

let type = thinky.type;

let Transfer = thinky.createModel('Transfer', {
    id        : type.string().optional(), // Optional => not specified in bodies but generated by RethinkDB
    amount    : Number,
    createdAt : type.date().default(new Date()),
    editedAt  : Date,
    isRemoved : type.boolean().default(false),
    // Force Thinky to show thoses additional fields that would be cut by enforce_extra
    senderId  : type.string().optional(),
    recieverId: type.string().optional()
}, {
    enforce_missing: true,
    enforce_extra  : 'remove',
    enforce_type   : 'strict'
});

Transfer.pre('save', function (next) {
    this.editedAt = new Date();
    next();
});

Transfer.ensureIndex('name');
Transfer.ensureIndex('createdAt');
Transfer.ensureIndex('editedAt');

Transfer.associate = models => {
    models.Purchase.belongsTo(models.User, 'sender', 'senderId', 'id');
    models.Purchase.belongsTo(models.User, 'reciever', 'recieverId', 'id');
};

export default Transfer;
