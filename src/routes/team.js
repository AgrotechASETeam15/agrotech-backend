const express = require('express');
const chalk = require('chalk');
const getConnection = require('../services/config/database');

let router = express.Router();

router.post('/add-member', async (req, res) => {
  let connection = await getConnection();
  const { full_name, student_id } = req.body;
  try {
    const result = await connection.query(
      'INSERT INTO team_members (full_name, student_id) VALUES (?, ?)',
      [full_name, student_id]
    );
    console.log(
      `${chalk.green(
        `Success - team member ${req.body.full_name} added to the database`
      )}`
    );

    if (result) {
      return res.status(200).send({
        success: true,
        message: 'Team member added to the database successfully',
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'Team member not added to the database',
      });
    }
  } catch (err) {
    console.log(`${chalk.red(`Error - ${err}`)}`);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  } finally {
    connection.end();
  }
});

module.exports = router;
