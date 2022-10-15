

CREATE TABLE IF NOT EXISTS  team_members(
        id INT NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        student_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE (student_id)
    ) ENGINE=INNODB;