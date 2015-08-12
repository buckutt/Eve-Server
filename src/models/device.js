import thinky from '../thinky';

let type = thinky.type;

let Device = thinky.createModel('Device', {
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

Device.pre('save', function (next) {
    this.editedAt = new Date();
    next();
});

Device.ensureIndex('name');
Device.ensureIndex('createdAt');
Device.ensureIndex('editedAt');

Device.associate = models => {
    models.Device.hasAndBelongsToMany(models.Point, 'points', 'id', 'id');
};

export default Device;