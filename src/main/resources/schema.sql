-- This project evolved the Skill model (removed proficiency_level, taxonomy_id).
-- Existing MySQL tables may still have NOT NULL constraints that break inserts.
-- These ALTERs are safe to run repeatedly.

ALTER TABLE skills MODIFY COLUMN proficiency_level INT NULL;
ALTER TABLE skills MODIFY COLUMN taxonomy_id BIGINT NULL;

