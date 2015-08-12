import thinky from '../thinky';

let type = thinky.type;

let Period = thinky.createModel('Period', {
    id         : type.string().optional(), // Optional => not specified in bodies but generated by RethinkDB
    name       : String,
    start      : Date,
    end        : Date,
    createdAt  : type.date().default(new Date()),
    editedAt   : Date,
    isRemoved  : type.boolean().default(false),
    fundationId: type.string().optional() // Force Thinky to show thoses additional fields that would be cut by enforce_extra
}, {
    enforce_missing: true,
    // enforce_extra: 'remove',
    // enforce_type: 'strict'
});

Period.pre('save', function (next) {
    this.editedAt = new Date();
    next();
});

Period.ensureIndex('name');
Period.ensureIndex('start');
Period.ensureIndex('end');
Period.ensureIndex('createdAt');
Period.ensureIndex('editedAt');

Period.associate = models => {
    models.Period.belongsTo(models.Fundation, 'fundation', 'fundationId', 'id');
    models.Period.hasMany(models.Price, 'prices', 'id', 'periodId');
};

export default Period;