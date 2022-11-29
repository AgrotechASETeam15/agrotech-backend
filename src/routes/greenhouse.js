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

// if kit exists, update the kit
router.put('/update-kit', async (req, res) => {
  const { data } = await axios.get(
    'https://api.thingspeak.com/channels/1932134/feeds.json?results=1'
  );
  console.log(`data`, data?.feeds[0]);

  let db;
  try {
    db = await getConnection();
    const result = await db.query(
      'UPDATE greenhouse SET kit_status=?, tempreture=?, humidity=?, smoke=?, soil_moisture=?, light_density=? WHERE kit_id=?',

      [
        'Active',
        data?.feeds[0]?.field2,
        data?.feeds[0]?.field3,
        data?.feeds[0]?.field1,
        data?.feeds[0]?.field4,
        data?.feeds[0]?.field6,
        data?.feeds[0]?.field7,
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
    const result = await db.query('SELECT * FROM greenhouse WHERE kit_id = ?', [
      kitId,
    ]);

    if (result.length > 0) {
      const updateKit = await axios.put(
        'http://localhost:8080/greenhouse/update-kit'
      );
      console.log(`updateKit`, updateKit);
      return res.status(200).send({
        success: true,
        message: 'Kit found',
        kit: result[0],
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

    const result = await db.query('DELETE FROM greenhouse WHERE kit_id=?', [
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
