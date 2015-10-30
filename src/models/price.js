import thinky from '../thinky';

let type = thinky.type;

let Price = thinky.createModel('Price', {
    id         : type.string().optional(), // Optional => not specified in bodies but generated by RethinkDB
    amount     : Number,
    createdAt  : type.date().default(new Date()),
    editedAt   : Date,
    isRemoved  : type.boolean().default(false),
    // Force Thinky to show thoses additional fields that would be cut by enforce_extra
    fundationId: type.string().optional(),
    groupId    : type.string().optional(),
    periodId   : type.string().optional()
}, {
    enforce_missing: true,
    enforce_extra  : 'remove',
    enforce_type   : 'strict'
});

Price.pre('save', function (next) {
    this.editedAt = new Date();
    next();
});

Price.ensureIndex('amount');
Price.ensureIndex('createdAt');
Price.ensureIndex('editedAt');

Price.associate = models => {
    models.Price.belongsTo(models.Fundation, 'fundation', 'fundationId', 'id');
    models.Price.belongsTo(models.Group, 'group', 'groupId', 'id');
    models.Price.belongsTo(models.Period, 'period', 'periodId', 'id');
    models.Price.hasOne(models.Promotion, 'promotion', 'id', 'promotionId');
    models.Price.hasAndBelongsToMany(models.Article, 'articles', 'id', 'id');
};

export default Price;
