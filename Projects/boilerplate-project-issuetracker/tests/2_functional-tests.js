const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testId;

suite('Functional Tests', function() {
  const project = 'test-project';

  test('1. Create an issue with every field', function (done) {
    chai.request(server)
      .post(`/api/issues/${project}`)
      .send({
        issue_title: 'Full test',
        issue_text: 'Text',
        created_by: 'Tester',
        assigned_to: 'Dev',
        status_text: 'In QA'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Full test');
        assert.equal(res.body.issue_text, 'Text');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, 'Dev');
        assert.equal(res.body.status_text, 'In QA');
        assert.property(res.body, '_id');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.equal(res.body.open, true);
        testId = res.body._id;
        done();
      });
  });
  
  test('2. Create an issue with only the required fields', function (done) {
    chai.request(server)
      .post(`/api/issues/${project}`)
      .send({
        issue_title: 'Minimal test',
        issue_text: 'Just required',
        created_by: 'Tester'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Minimal test');
        assert.equal(res.body.issue_text, 'Just required');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        done();
      });
  });
  
  test('3. Create an issue with missing required fields', function (done) {
    chai.request(server)
      .post(`/api/issues/${project}`)
      .send({
        issue_title: '',
        issue_text: '',
        created_by: ''
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
        done();
      });
  });
  
  test('4. View issues on a project', function (done) {
    chai.request(server)
      .get(`/api/issues/${project}`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  
  test('5. View issues on a project with one filter', function (done) {
    chai.request(server)
      .get(`/api/issues/${project}?open=true`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
            assert.equal(issue.open, true);
        });
        done();
      });
  });
  
  test('6. View issues on a project with multiple filters', function (done) {
    chai.request(server)
      .get(`/api/issues/${project}?open=true&created_by=Tester`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
            assert.equal(issue.open, true);
            assert.equal(issue.created_by, 'Tester')
        });
        done();
      });
  });
  
  test('7. Update one field on an issue', function (done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: testId,
        status_text: 'Updated'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            result: 'successfully updated',
            _id: testId
        });
        done();
      });
  });
  
  test('8. Update multiple fields on an issue', function (done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: testId,
        issue_title: 'Updated title',
        issue_text: 'Updated text'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            result: 'successfully updated',
            _id: testId
        });
        done();
      });
  });
  
  test('9. Update an issue with missing _id', function (done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        issue_text: 'Missing ID'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            error: 'missing _id'
        });
        done();
      });
  });
  
  test('10. Update an issue with no fields to update', function (done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: testId
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            error: 'no update field(s) sent',
            _id: testId
        });
        done();
      });
  });
  
  test('11. Update an issue with an invalid _id', function (done) {
    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({
        _id: 'invalidid123',
        issue_text: 'Should fail'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            error: 'could not update',
            _id: 'invalidid123'
        });
        done();
      });
  });
  
  test('12. Delete an issue', function (done) {
    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({ _id: testId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            result: 'successfully deleted',
            _id: testId
        });
        done();
      });
  });
  
  test('13. Delete an issue with an invalid _id', function (done) {
    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({ _id: 'invalidid123' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            error: 'could not delete',
            _id: 'invalidid123'
        });
        done();
      });
  });
  
  test('14. Delete an issue with a missing _id', function (done) {
    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            error: 'missing _id'
        });
        done();
      });
  });
});
