import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1739544160066 implements MigrationInterface {
    name = 'CreateUsersTable1739544160066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`authors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`bio\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`bookId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rating\` int NOT NULL, \`comment\` varchar(255) NOT NULL, \`userId\` int NULL, \`bookId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`books\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`stock\` int NOT NULL DEFAULT '0', \`published_date\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`composesById\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders_books\` (\`id\` int NOT NULL AUTO_INCREMENT, \`price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`quantity\` int NOT NULL, \`orderId\` int NULL, \`bookId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shippings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phone\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`postCode\` varchar(255) NOT NULL, \`orderId\` int NULL, UNIQUE INDEX \`REL_c5a685f76b80f7eb0d143cc7d5\` (\`orderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'processing', \`total_price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`shippedAt\` datetime NULL, \`deliveredAt\` datetime NULL, \`updatedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`roles\` set ('ADMIN', 'USER') NOT NULL DEFAULT 'USER', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_5ce092c986f0d89baed7b328971\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_7ed5659e7139fc8bc039198cc1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_cab4e55252a9c18a27e81415299\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_7442ef91f51ec59d5d4d15cd86e\` FOREIGN KEY (\`composesById\`) REFERENCES \`authors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_a0f13454de3df36e337e01dbd55\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_books\` ADD CONSTRAINT \`FK_957396d9a50059abda2c8fa9e97\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_books\` ADD CONSTRAINT \`FK_ddc4834228624732cf91fa92ce3\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shippings\` ADD CONSTRAINT \`FK_c5a685f76b80f7eb0d143cc7d59\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1102b5a0c580f845993e2f766f6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1102b5a0c580f845993e2f766f6\``);
        await queryRunner.query(`ALTER TABLE \`shippings\` DROP FOREIGN KEY \`FK_c5a685f76b80f7eb0d143cc7d59\``);
        await queryRunner.query(`ALTER TABLE \`orders_books\` DROP FOREIGN KEY \`FK_ddc4834228624732cf91fa92ce3\``);
        await queryRunner.query(`ALTER TABLE \`orders_books\` DROP FOREIGN KEY \`FK_957396d9a50059abda2c8fa9e97\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_a0f13454de3df36e337e01dbd55\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_7442ef91f51ec59d5d4d15cd86e\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_cab4e55252a9c18a27e81415299\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_7ed5659e7139fc8bc039198cc1f\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_5ce092c986f0d89baed7b328971\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP INDEX \`REL_c5a685f76b80f7eb0d143cc7d5\` ON \`shippings\``);
        await queryRunner.query(`DROP TABLE \`shippings\``);
        await queryRunner.query(`DROP TABLE \`orders_books\``);
        await queryRunner.query(`DROP TABLE \`books\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`authors\``);
    }

}
