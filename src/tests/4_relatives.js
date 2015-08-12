import assert  from 'assert';
import unirest from 'unirest';

describe('Relatives', () => {
    describe('Correct id', () => {
        it('should get the submodel correctly', done => {
            unirest.get('http://localhost:3006/purchases')
                .type('json')
                .end(response => {
                    let id = response.body[0].id;

                    unirest.get('http://localhost:3006/purchases/' + id + '/promotion')
                        .type('json')
                        .end(response => {
                            assert.equal(200, response.code);
                            assert.equal('string', typeof response.body.name);
                            done();
                        });
                });
        });

        it('should get the submodel and its relatives with ?embed=modelA,modelB', done => {
            unirest.get('http://localhost:3006/purchases')
                .type('json')
                .end(response => {
                    let id = response.body[0].id;

                    unirest.get('http://localhost:3006/purchases/' + id + '/promotion?embed=purchases')
                        .type('json')
                        .end(response => {
                            assert.equal(200, response.code);
                            assert.equal('string', typeof response.body.name);
                            assert.equal(id, response.body.purchases[0].id);
                            done();
                        });
                });
        });
    });

    describe('Incorrect id', () => {
        it('should not get any submodel if id is non-existant', done => {
            unirest.get('http://localhost:3006/purchases/00000000-0000-1000-8000-000000000000/promotion')
                .type('json')
                .end(response => {
                    assert.equal(404, response.code);

                    done();
                });
        });

        it('should not get any submodel if the id is not a guid', done => {
            unirest.get('http://localhost:3006/purchases/foo/promotion')
                .type('json')
                .end(response => {
                    assert.equal(400, response.code);

                    done();
                });
        });
    });
});