-- This project evolved the Skill model (removed proficiency_level, taxonomy_id).
-- Existing MySQL tables may still have NOT NULL constraints that break inserts.
-- These ALTERs are safe to run repeatedly.

ALTER TABLE skills MODIFY COLUMN proficiency_level INT NULL;
ALTER TABLE skills MODIFY COLUMN taxonomy_id BIGINT NULL;

-- Session status grew beyond the old enum values.
-- Keep it as VARCHAR so new statuses (like PENDING_MENTEE_CONFIRMATION) save safely.
ALTER TABLE sessions MODIFY COLUMN status VARCHAR(64) NOT NULL;

-- Notification enum values evolve with features. Keep type column wide enough.
ALTER TABLE notifications MODIFY COLUMN notification_type VARCHAR(64) NOT NULL;

