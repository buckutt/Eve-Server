import thinky from '../thinky';

let type = thinky.type;

let Point = thinky.createModel('Point', {
    id       : type.string().optional(), // Optional => not specified in bodies but generated by RethinkDB
    name     : String,
    createdAt: type.date().default(new Date()),
    editedAt : Date,
    isRemoved: type.boolean().default(false)
}, {
    enforce_missing: true,
    enforce_extra  : 'remove',
    enforce_type   : 'strict'
});

Point.pre('save', function (next) {
    this.editedAt = new Date();
    next();
});

Point.ensureIndex('name');
Point.ensureIndex('createdAt');
Point.ensureIndex('editedAt');

Point.associate = models => {
    models.Point.hasMany(models.PeriodPoint, 'periodPoints', 'id', 'pointId');
    models.Point.hasMany(models.Promotion, 'promotions', 'id', 'pointId');
    models.Point.hasMany(models.Purchase, 'purchases', 'id', 'pointId');
    models.Point.hasMany(models.Reload, 'reloads', 'id', 'pointId');
    models.Point.hasAndBelongsToMany(models.Article, 'articles', 'id', 'id');
};

export default Point;
