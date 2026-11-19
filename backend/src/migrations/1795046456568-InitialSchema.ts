import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1795046456568 implements MigrationInterface {
    name = 'InitialSchema1795046456568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "credit_requests" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "cedula" character varying(20) NOT NULL, "amount" numeric(12,2) NOT NULL, "termMonths" integer NOT NULL, "status" character varying(10) NOT NULL DEFAULT 'PENDING', "statusComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0e6892aa27209fcd2fd6074018c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "credit_requests"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
