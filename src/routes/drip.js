const express = require('express');
let router = express.Router();
const getConnection = require('../services/config/database');
const crypto = require('crypto');
const chalk = require('chalk');

router.post('/add-kit', async (req, res) => {
  const {
    kitName,
    kitStatus,
    sensorOne,
    sensorTwo,
    sensorThree,
    valveOne,
    valveTwo,
    valveThree,
  } = req.body;

  if (
    !kitName ||
    !kitStatus ||
    !sensorOne ||
    !sensorTwo ||
    !sensorThree ||
    !valveOne ||
    !valveTwo ||
    !valveThree
  ) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }

  let db;
  try {
    const kitId = crypto.randomUUID();
    db = await getConnection();

    // check if kit already exists
    const results = await db.query(
      'Select * from drip_info where kit_name=? ',
      [kitName]
    );

    if (results.length > 0) {
      return res.json({
        success: false,
        message: 'Kit already exists',
      });
    }

    const result = await db.query(
      'INSERT INTO drip_info (kit_id, kit_name, kit_status, sensor_one, sensor_two, sensor_three, valve_one, valve_two, valve_three) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        kitId,
        kitName,
        kitStatus,
        sensorOne,
        sensorTwo,
        sensorThree,
        valveOne,
        valveTwo,
        valveThree,
      ]
    );
    console.log(
      `${chalk.green('Success')} -  ${chalk.blue(kitName)} ${chalk.green(
        'Added to the database'
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
    const result = await db.query('SELECT * FROM drip_info');
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

router.get('/get-kit/:kitId', async (req, res) => {
  const { kitId } = req.params;

  if (!kitId) {
    return res.status(400).send({ message: 'Please provide a kit id' });
  }
  let db;
  try {
    db = await getConnection();
    const result = await db.query('SELECT * FROM drip_info WHERE kit_id = ?', [
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
    const result = await db.query('SELECT * FROM drip_info WHERE kit_id = ?', [
      kitId,
    ]);
    if (result.length === 0) {
      return res.status(400).send({ message: 'Kit not found' });
    }
    // delete the kit from the database
    const deleteResult = await db.query(
      'DELETE FROM drip_info WHERE kit_id = ?',
      [kitId]
    );
    if (deleteResult) {
      return res.status(200).send({ message: 'Kit deleted successfully' });
    } else {
      return res.status(400).send({ message: 'Kit not deleted' });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
});

module.exports = router;
