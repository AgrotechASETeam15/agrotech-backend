

CREATE TABLE IF NOT EXISTS  team_members(
        id INT NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        student_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE (student_id)
    ) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        hash  VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (email)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS  drip_info (
        id INT NOT NULL AUTO_INCREMENT,
        kit_id VARCHAR(255) NOT NULL,
        kit_name VARCHAR(255) NOT NULL,
        kit_status VARCHAR(255) NOT NULL,
        sensor_one VARCHAR(255) NOT NULL,
        sensor_two VARCHAR(255) NOT NULL,
        sensor_three VARCHAR(255) NOT NULL,
        valve_one VARCHAR(255) NOT NULL,
        valve_two VARCHAR(255) NOT NULL,
        valve_three VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE (kit_id)
    ) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS pestricides (
        id INT NOT NULL AUTO_INCREMENT,
        kit_id VARCHAR(255) NOT NULL,
        kit_name VARCHAR(255) NOT NULL,
        kit_status VARCHAR(255) NOT NULL,
        sensor_one VARCHAR(255) NOT NULL,
        sensor_two VARCHAR(255) NOT NULL,
        valve_one VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (kit_id)
    ) ENGINE=INNODB;