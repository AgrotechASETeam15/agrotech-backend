const express = require('express');
let router = express.Router();
const getConnection = require('../services/config/database');
const crypto = require('crypto');
const chalk = require('chalk');
const axios = require('axios');

router.post('/add-kit', async (req, res) => {
  const {
    kitName,
    kitStatus,
    tempreture,
    humidity,
    smoke,
    soilMoisture,
    lightDensity,
  } = req.body;

  if (
    !kitName ||
    !kitStatus ||
    !tempreture ||
    !humidity ||
    !smoke ||
    !soilMoisture ||
    !lightDensity
  ) {
    return res.status(400).send({ message: 'Please fill all fields' });
  }
  const kitId = crypto.randomUUID();

  let db;
  try {
    db = await getConnection();

    // check if kit already exists
    const results = await db.query(' SELECT * FROM greenhouse WHERE kit_id=?', [
      kitId,
    ]);

    if (results.length > 0) {
      return res.json({
        success: false,
        message: 'Kit already exists',
      });
    }

    const result = await db.query(
      'INSERT INTO greenhouse (kit_id, kit_name, kit_status, tempreture, humidity, smoke, soil_moisture, light_density) VALUES (?,?,?,?,?,?,?,?)',
      [
        kitId,
        kitName,
        kitStatus,
        tempreture,
        humidity,
        smoke,
        soilMoisture,
        lightDensity,
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
    const result = await db.query('SELECT * FROM greenhouse');
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

module.exports = router;
