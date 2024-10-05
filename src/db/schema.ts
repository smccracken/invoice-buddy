import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { AVAILABLE_STATUSES } from '~/data/invoices';

export type Status = (typeof AVAILABLE_STATUSES)[number]['id'];

const statuses = AVAILABLE_STATUSES.map(({ id }) => id) as Array<Status>;

export const statusEnum = pgEnum(
  'status',
  statuses as [Status, ...Array<Status>]
);

export const Invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  amount: integer('amount').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  description: text('description'),
  userId: text('userId').notNull(),
  status: statusEnum('status').notNull(),
});
