const express = require('express');
let router = express.Router();
const getConnection = require('../services/config/database');
const crypto = require('crypto');
const chalk = require('chalk');
const axios = require('axios');

router.post('/add-kit', async (req, res) => {
  const { kitName, kitStatus, sensorOne, sensorTwo, valveOne } = req.body;

  if (!kitName || !kitStatus || !sensorOne || !sensorTwo || !valveOne) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }
  const kitId = crypto.randomUUID();

  let db;
  try {
    db = await getConnection();

    // check if kit already exists
    const results = await db.query(
      ' SELECT * FROM pestricides WHERE kit_id=?',
      [kitId]
    );

    if (results.length > 0) {
      return res.json({
        success: false,
        message: 'Kit already exists',
      });
    }

    const result = await db.query(
      'INSERT INTO pestricides (kit_id, kit_name, kit_status, sensor_one, sensor_two,valve_one ) VALUES (?,?,?,?,?,?)',
      [kitId, kitName, kitStatus, sensorOne, sensorTwo, valveOne]
    );
    console.log(
      `${chalk.green('Success')} -  ${chalk.blue(kitName)} ${chalk.green(
        'Added to the database pestricides table'
      )}`
    );
    if (result) {
      return res.status(200).send({ message: 'Kit added successfully' });
    } else {
      return res.status(400).send({ message: 'Kit not added' });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
});

router.get('/get-kits', async (req, res) => {
  let db;
  try {
    db = await getConnection();
    const result = await db.query('SELECT * FROM pestricides');
    if (result) {
      return res.status(200).send({
        message: 'Kits fetched successfully',
        success: true,
        kits: result,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'No kits founds',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
});

// if kit exists, update the kit
router.put('/update-kit', async (req, res) => {
  const { data } = await axios.get(
    'https://api.thingspeak.com/channels/1922410/feeds.json?results=1'
  );
  console.log(`data`, data?.feeds[0]);

  let db;
  try {
    db = await getConnection();
    const result = await db.query(
      'UPDATE pestricides SET   sensor_one=?, sensor_two=?, valve_one=? WHERE kit_id=?',
      [
        data?.feeds[0].field1,
        data?.feeds[0].field2,
        data?.feeds[0].field4,
        data?.feeds[0].field7,
      ]
    );

    res.send({
      success: true,
      message: 'Kit updated successfully',
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
});

router.get('/get-kit/:kitId', async (req, res) => {
  const { kitId } = req.params;

  if (!kitId) {
    return res.status(400).send({ message: 'Please provide a kit id' });
  }
  let db;
  try {
    db = await getConnection();
    const result = await db.query('SELECT * FROM pestricides WHERE kit_id=?', [
      kitId,
    ]);
    if (result) {
      return res.status(200).send({
        message: 'Kit fetched successfully',
        success: true,
        kit: result[0],
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'No kit found',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
});

// delte a kit from the database
router.delete('/delete-kit/:kitId', async (req, res) => {
  const { kitId } = req.params;
  if (!kitId) {
    return res.status(400).send({ message: 'Please provide a kit id' });
  }
  let db;
  try {
    db = await getConnection();
    // find the kit in the database

    const result = await db.query('DELETE FROM pestricides WHERE kit_id=?', [
      kitId,
    ]);

    // delete the kit from the database
    if (result.affectedRows > 0) {
      return res.status(200).send({
        message: 'Kit deleted successfully',
        success: true,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'No kit found',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
});

module.exports = router;
