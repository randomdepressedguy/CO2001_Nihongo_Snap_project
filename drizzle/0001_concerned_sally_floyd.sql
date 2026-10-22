CREATE TABLE `app_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_email_unique` ON `app_accounts` (`email`);--> statement-breakpoint
CREATE TABLE `app_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `app_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `app_sessions_account_idx` ON `app_sessions` (`account_id`);--> statement-breakpoint
CREATE INDEX `app_sessions_expiry_idx` ON `app_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `auth_throttles` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL
);
