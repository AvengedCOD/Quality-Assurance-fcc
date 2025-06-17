'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {
  let issues = [];

  app.route('/api/issues/:project')
  
    // Get list of issues
    .get(function (req, res){
      const project = req.params.project;
      const filters = req.query;

      const filtered = issues.filter(issue => {
        if (issue.project !== project) return false;
        for (let key in filters) {
          if (issue[key] != filters[key]) return false;
        }
        return true;
      });

      res.json(filtered.map(({ project, ...rest }) => rest));
    })
    
    // Create new issue
    .post(function (req, res){
      const project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to = '',
        status_text = ''
      } = req.body;

      // Check fields
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const now = new Date();
      const issue = {
        _id: uuidv4(),
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: now,
        updated_on: now,
        open: true,
        project
      };

      issues.push(issue);

      const { project: _, ...output } = issue;
      res.json(output);
    })
    
    // Update existing issue
    .put(function (req, res){
      const { _id, ...rest } = req.body;

      // Check fields
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      // Add update
      const updates = {};
      for (let key in rest) {
        if (key !== '_id' && rest[key] !== undefined) {
          updates[key] = rest[key];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      // Find issue to update
      const issue = issues.find(i => i._id === _id);
      if (!issue) {
        return res.json({ error: 'could not update', _id });
      }

      for (let key in updates) {
          issue[key] = updates[key];
      }

      issue.updated_on = new Date();
      res.json({ result: 'successfully updated', _id });
    })
    
    // Delete an issue
    .delete(function (req, res){
      const { _id } = req.body;

      // Check fields
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      // Find issue
      const index = issues.findIndex(i => i._id === _id);
      if (index === -1) {
        return res.json({ error: 'could not delete', _id });
      }
      // Remove
      issues.splice(index, 1);
      res.json({ result: 'successfully deleted', _id });
    });
};