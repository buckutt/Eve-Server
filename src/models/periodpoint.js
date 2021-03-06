import thinky from '../thinky';

let type = thinky.type;

let PeriodPoint = thinky.createModel('PeriodPoint', {
    id       : type.string().optional(), // Optional => not specified in bodies but generated by RethinkDB
    createdAt: type.date().default(new Date()),
    editedAt : Date,
    isRemoved: type.boolean().default(false),
    // Force Thinky to show thoses additional fields that would be cut by enforce_extra
    periodId : type.string().optional(),
    pointId  : type.string().optional()
}, {
    enforce_missing: true,
    enforce_extra  : 'remove',
    enforce_type   : 'strict'
});

PeriodPoint.pre('save', function (next) {
    this.editedAt = new Date();
    next();
});

PeriodPoint.ensureIndex('createdAt');
PeriodPoint.ensureIndex('editedAt');

PeriodPoint.associate = models => {
    models.PeriodPoint.belongsTo(models.Point, 'point', 'id', 'pointId');
    models.PeriodPoint.belongsTo(models.Period, 'period', 'id', 'periodId');
    models.PeriodPoint.hasAndBelongsToMany(models.Device, 'devices', 'id', 'id');
};

export default PeriodPoint;
