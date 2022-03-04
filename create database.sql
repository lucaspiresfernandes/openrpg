drop database juizodivinodb;

create database juizodivinodb;

use juizodivinodb;

CREATE TABLE `characteristic` (
    `characteristic_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `rollable` BOOLEAN NOT NULL,
    PRIMARY KEY (`characteristic_id`)
);

INSERT INTO
    `characteristic` (`name`, `rollable`)
VALUES
    ('Força', TRUE),
    ('Agilidade', TRUE),
    ('Constituição', TRUE),
    ('Intelecto', TRUE),
    ('Presença', TRUE),
    ('Sabedoria', TRUE),
    ('Tamanho', TRUE),
    ('Deslocamento', FALSE);

CREATE TABLE `specialization` (
    `specialization_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`specialization_id`)
);

INSERT INTO
    `specialization` (`name`)
VALUES
    ('Atletismo'),
    ('Luta'),
    ('Furtividade'),
    ('Pilotagem'),
    ('Pontaria'),
    ('Prestidigitação'),
    ('Reflexos'),
    ('Fortitude'),
    ('Avaliação'),
    ('Ciência'),
    ('História'),
    ('Investigação'),
    ('Medicina'),
    ('Misticismo'),
    ('Percepção'),
    ('Profissão'),
    ('Afinidade Natural'),
    ('Diplomacia'),
    ('Enganação'),
    ('Intimidação'),
    ('Intuição'),
    ('Vontade');

CREATE TABLE `skill` (
    `skill_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `specialization_id` INT UNSIGNED NULL,
    `characteristic_id` INT UNSIGNED NOT NULL,
    `mandatory` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`skill_id`),
    CONSTRAINT `fk_skill_characteristic_id` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic`(`characteristic_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_skill_specialization_id` FOREIGN KEY (`specialization_id`) REFERENCES `specialization`(`specialization_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
    `skill` (
        `specialization_id`,
        `characteristic_id`,
        `name`,
        `mandatory`
    )
VALUES
    (NULL, 1, 'Atletismo', TRUE),
    (NULL, 1, 'Luta', TRUE),
    (NULL, 2, 'Furtividade', TRUE),
    (NULL, 2, 'Pilotagem', TRUE),
    (NULL, 2, 'Pontaria', TRUE),
    (NULL, 2, 'Prestidigitação', TRUE),
    (NULL, 2, 'Reflexos', TRUE),
    (NULL, 3, 'Fortitude', TRUE),
    (NULL, 4, 'Avaliação', TRUE),
    (NULL, 4, 'Ciência', TRUE),
    (NULL, 4, 'História', TRUE),
    (NULL, 4, 'Investigação', TRUE),
    (NULL, 4, 'Medicina', TRUE),
    (NULL, 4, 'Misticismo', TRUE),
    (NULL, 4, 'Percepção', TRUE),
    (NULL, 4, 'Profissão', TRUE),
    (NULL, 5, 'Afinidade Natural', TRUE),
    (NULL, 5, 'Diplomacia', TRUE),
    (NULL, 5, 'Enganação', TRUE),
    (NULL, 5, 'Intimidação', TRUE),
    (NULL, 5, 'Intuição', TRUE),
    (NULL, 5, 'Vontade', TRUE);

CREATE TABLE `attribute` (
    `attribute_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `rollable` BOOLEAN NOT NULL,
    `bg_color` varchar(6) NOT NULL,
    `fill_color` varchar(6) NOT NULL,
    `characteristic_id` INT UNSIGNED NOT NULL,
    `skill_id` INT UNSIGNED NULL,
    `operation` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`attribute_id`),
    CONSTRAINT `fk_attribute_characteristic_skill_id` FOREIGN KEY (`skill_id`) REFERENCES `skill`(`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_attribute_characteristic_characteristic_id` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic`(`characteristic_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
    `attribute` (
        `name`,
        `rollable`,
        `bg_color`,
        `fill_color`,
        `characteristic_id`,
        `skill_id`,
        `operation`
    )
VALUES
    (
        'Vida',
        FALSE,
        '5a1e1e',
        'b62323',
        7,
        8,
        '({characteristic} + {skill}) / 2'
    ),
    (
        'Sanidade',
        TRUE,
        '584377',
        '871eef',
        4,
        22,
        '{characteristic} + ({skill} * 5)'
    ),
    (
        'Energia',
        FALSE,
        '1d9797',
        '00ffff',
        5,
        NULL,
        '{characteristic} * 2'
    );

CREATE TABLE `player` (
    `player_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `admin` BOOLEAN NOT NULL,
    PRIMARY KEY (`player_id`)
);

CREATE TABLE `player_characteristic` (
    `player_id` INT UNSIGNED NOT NULL,
    `characteristic_id` INT UNSIGNED NOT NULL,
    `value` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`player_id`, `characteristic_id`),
    CONSTRAINT `uk_player_id_characteristic_id` UNIQUE (`player_id`, `characteristic_id`),
    CONSTRAINT `fk_player_characteristic_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_characteristic_characteristic_id` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic`(`characteristic_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `player_skill` (
    `player_id` INT UNSIGNED NOT NULL,
    `skill_id` INT UNSIGNED NOT NULL,
    `value` INT UNSIGNED NOT NULL,
    `extra_value` INT UNSIGNED NOT NULL,
    `total_value` INT UNSIGNED GENERATED ALWAYS AS (`value` + `extra_value`) STORED,
    PRIMARY KEY (`player_id`, `skill_id`),
    CONSTRAINT `uk_player_id_skill_id` UNIQUE (`player_id`, `skill_id`),
    CONSTRAINT `fk_player_skill_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_skill_skill_id` FOREIGN KEY (`skill_id`) REFERENCES `skill`(`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `attribute_status` (
    `attribute_status_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `attribute_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`attribute_status_id`),
    CONSTRAINT `fk_attribute_status_attribute_id` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
    `attribute_status` (`name`, `attribute_id`)
VALUES
    ('Morrendo', 1),
    ('Enfraquecendo', 1),
    ('Inconsciente', 1),
    ('Lesão Grave', 1),
    ('Traumatizado', 2),
    ('Acessório', 3);

CREATE TABLE `player_attribute` (
    `player_id` INT UNSIGNED NOT NULL,
    `attribute_id` INT UNSIGNED NOT NULL,
    `value` INT UNSIGNED NOT NULL,
    `max_value` INT UNSIGNED NOT NULL,
    `extra_value` INT UNSIGNED NOT NULL,
    `total_value` INT UNSIGNED GENERATED ALWAYS AS (`max_value` + `extra_value`) STORED,
    `coefficient` DECIMAL(15, 2) GENERATED ALWAYS AS (IFNULL((`value` / `total_value`) * 100, 0)) VIRTUAL,
    PRIMARY KEY (`player_id`, `attribute_id`),
    CONSTRAINT `uk_player_id_attribute_id` UNIQUE (`player_id`, `attribute_id`),
    CONSTRAINT `fk_player_attribute_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_attribute_attribute_id` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `player_attribute_status` (
    `player_id` INT UNSIGNED NOT NULL,
    `attribute_status_id` INT UNSIGNED NOT NULL,
    `value` BOOLEAN NOT NULL,
    PRIMARY KEY (`player_id`, `attribute_status_id`),
    CONSTRAINT `uk_player_id_attribute_status_id` UNIQUE (`player_id`, `attribute_status_id`),
    CONSTRAINT `fk_player_attribute_status_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_attribute_status_attribute_status_id` FOREIGN KEY (`attribute_status_id`) REFERENCES `attribute_status`(`attribute_status_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `equipment` (
    `equipment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `skill_id` INT UNSIGNED NOT NULL,
    `damage` VARCHAR(255) NOT NULL,
    `range` VARCHAR(255) NOT NULL,
    `attacks` VARCHAR(255) NOT NULL,
    `ammo` VARCHAR(255) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`equipment_id`),
    CONSTRAINT `fk_equipment_skill_id` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
    `equipment` (
        `name`,
        `type`,
        `skill_id`,
        `damage`,
        `range`,
        `attacks`,
        `ammo`,
        `visible`
    )
VALUES
    (
        'Desarmado',
        'Luta',
        2,
        '1d3',
        'Toque',
        '1',
        '-',
        TRUE
    );

CREATE TABLE `player_equipment` (
    `player_id` INT UNSIGNED NOT NULL,
    `equipment_id` INT UNSIGNED NOT NULL,
    `current_ammo` varchar(255) NOT NULL,
    `using` BOOLEAN NOT NULL,
    PRIMARY KEY (`player_id`, `equipment_id`),
    CONSTRAINT `uk_player_id_equipment_id` UNIQUE (`player_id`, `equipment_id`),
    CONSTRAINT `fk_player_equipment_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_equipment_equipment_id` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `spec` (
    `spec_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`spec_id`)
);

INSERT INTO
    `spec` (`name`)
VALUES
    ('Exposição Pavorosa');

CREATE TABLE `player_spec` (
    `player_id` INT UNSIGNED NOT NULL,
    `spec_id` INT UNSIGNED NOT NULL,
    `value` varchar(255) NOT NULL,
    PRIMARY KEY (`player_id`, `spec_id`),
    CONSTRAINT `uk_player_id_spec_id` UNIQUE (`player_id`, `spec_id`),
    CONSTRAINT `fk_player_spec_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_spec_spec_id` FOREIGN KEY (`spec_id`) REFERENCES `spec`(`spec_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `item` (
    `item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`item_id`)
);

CREATE TABLE `player_item` (
    `player_id` INT UNSIGNED NOT NULL,
    `item_id` INT UNSIGNED NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (`player_id`, `item_id`),
    CONSTRAINT `uk_player_id_item_id` UNIQUE (`player_id`, `item_id`),
    CONSTRAINT `fk_player_item_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_item_item_id` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `info` (
    `info_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`info_id`)
);

INSERT INTO
    `info` (`name`)
VALUES
    ('Nome'),
    ('Player'),
    ('Idade'),
    ('Raça'),
    ('Local de Nascimento'),
    ('Altura');

CREATE TABLE `player_info` (
    `player_id` INT UNSIGNED NOT NULL,
    `info_id` INT UNSIGNED NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`player_id`, `info_id`),
    CONSTRAINT `uk_player_id_info_id` UNIQUE (`player_id`, `info_id`),
    CONSTRAINT `fk_player_info_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_info_info_id` FOREIGN KEY (`info_id`) REFERENCES `info`(`info_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `extra_info` (
    `extra_info_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`extra_info_id`)
);

INSERT INTO
    `extra_info` (`name`)
VALUES
    ('História'),
    ('Itens, Pessoas e Locais Importantes'),
    ('Fobias e Manias');

CREATE TABLE `player_extra_info` (
    `player_id` INT UNSIGNED NOT NULL,
    `extra_info_id` INT UNSIGNED NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`player_id`, `extra_info_id`),
    CONSTRAINT `uk_player_id_extra_info_id` UNIQUE (`player_id`, `extra_info_id`),
    CONSTRAINT `fk_player_extra_info_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_extra_info_extra_info_id` FOREIGN KEY (`extra_info_id`) REFERENCES `extra_info`(`extra_info_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `player_avatar` (
    `player_id` INT UNSIGNED NOT NULL,
    `attribute_status_id` INT UNSIGNED NULL,
    `link` MEDIUMTEXT NULL DEFAULT NULL,
    UNIQUE KEY (`player_id`, `attribute_status_id`),
    CONSTRAINT `uk_player_id_attribute_status_id` UNIQUE (`player_id`, `attribute_status_id`),
    CONSTRAINT `fk_player_avatar_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_player_avatar_attribute_status_id` FOREIGN KEY (`attribute_status_id`) REFERENCES `attribute_status`(`attribute_status_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `player_note` (
    `player_id` INT UNSIGNED NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`player_id`),
    CONSTRAINT `fk_player_note_player_id` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `player_session` (
    `sid` VARCHAR(255),
    `sess` JSON NOT NULL,
    `expired` DATETIME NOT NULL,
    PRIMARY KEY (`sid`),
    INDEX `player_session_expired_index` (`expired`)
);

CREATE TABLE `config` (
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NULL,
    PRIMARY KEY (`key`)
);

INSERT INTO
    `config` (`key`, `value`)
VALUES
    ('portrait_environment', 'idle');