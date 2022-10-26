

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
)
