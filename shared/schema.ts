
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  businessAddress: text("business_address"), // Landlord's business/contact address
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull(),
  location: text("location"), // Formatted place name (e.g., "Kileleshwa, Nairobi")
  clientId: integer("client_id").references(() => clients.id).notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const operationModes = pgTable("operation_modes", {
  id: serial("id").primaryKey(),
  modeName: text("mode_name").notNull(),
  modeDescription: text("mode_description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const establishmentTypes = pgTable("establishment_types", {
  id: serial("id").primaryKey(),
  typeName: text("type_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const establishments = pgTable("establishments", {
  id: serial("id").primaryKey(),
  establishmentName: text("establishment_name").notNull(),
  establishmentTypeId: integer("establishment_type_id").references(() => establishmentTypes.id).notNull(),
  siteId: integer("site_id").references(() => sites.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const occupancies = pgTable("occupancies", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  unitNumber: text("unit_number").notNull(), // e.g., "D4", "C2", "B3"
  customerName: text("customer_name"), // Tenant name
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  meterId: integer("meter_id").references(() => meters.id), // Nullable - can be unassigned
  status: text("status").default("vacant"), // "occupied" | "vacant"
  createdAt: timestamp("created_at").defaultNow(),
});

export const meters = pgTable("meters", {
  id: serial("id").primaryKey(),
  serialNo: text("serial_no").notNull(),
  imeiNo: text("imei_no").notNull(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id),
  operationModeId: integer("operation_mode_id").references(() => operationModes.id).notNull(),
  simcard: text("simcard").notNull(),
  type: text("type").notNull(),
  meterSize: text("meter_size").notNull(),
  technology: text("technology").notNull(),
  valveStatus: text("valve_status").default("open"), // "open", "closed", "offline"
  latestReading: integer("latest_reading").default(0), // Latest totalizer reading in liters
  lastReadingTime: timestamp("last_reading_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billingProfiles = pgTable("billing_profiles", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  tariff: text("tariff").notNull(),
  quota: integer("quota").notNull(), // Litres
  automatedBilling: boolean("automated_billing").default(false).notNull(),
  baseRate: numeric("base_rate").default("0").notNull(),
  sewerCharge: numeric("sewer_charge").default("0").notNull(),
  serviceFee: numeric("service_fee").default("0").notNull(),
  rateKes: numeric("rate_kes").notNull(),
  rateLitres: numeric("rate_litres").notNull(),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mpesaKeys = pgTable("mpesa_keys", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => admins.id).notNull(),
  accountType: text("account_type").notNull(),
  consumerKey: text("consumer_key").notNull(),
  businessAccount: text("business_account").notNull(),
  consumerSecret: text("consumer_secret").notNull(),
  shortCode: text("short_code").notNull(),
  passKey: text("pass_key").notNull(),
  initiator: text("initiator").notNull(),
  securityCredential: text("security_credential").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  meterId: integer("meter_id").references(() => meters.id).notNull(),
  amount: numeric("amount").notNull(),
  volume: integer("volume").notNull(), // Litres
  status: text("status").notNull(), // 'success', 'pending', 'failed'
  type: text("type").notNull(), // 'payment', 'recharge', 'refund'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  meterId: integer("meter_id").references(() => meters.id),
  siteId: integer("site_id").references(() => sites.id),
  eventType: text("event_type").notNull(), // 'alert', 'info', 'status_change'
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === RELATIONS ===

export const clientsRelations = relations(clients, ({ many, one }) => ({
  sites: many(sites),
  meters: many(meters),
  billingProfiles: many(billingProfiles),
}));

export const sitesRelations = relations(sites, ({ one, many }) => ({
  client: one(clients, {
    fields: [sites.clientId],
    references: [clients.id],
  }),
  establishments: many(establishments),
}));

export const establishmentsRelations = relations(establishments, ({ one }) => ({
  type: one(establishmentTypes, {
    fields: [establishments.establishmentTypeId],
    references: [establishmentTypes.id],
  }),
  site: one(sites, {
    fields: [establishments.siteId],
    references: [sites.id],
  }),
}));

export const metersRelations = relations(meters, ({ one }) => ({
  client: one(clients, {
    fields: [meters.clientId],
    references: [clients.id],
  }),
  establishment: one(establishments, {
    fields: [meters.establishmentId],
    references: [establishments.id],
  }),
  operationMode: one(operationModes, {
    fields: [meters.operationModeId],
    references: [operationModes.id],
  }),
}));

export const mpesaKeysRelations = relations(mpesaKeys, ({ one }) => ({
  admin: one(admins, {
    fields: [mpesaKeys.adminId],
    references: [admins.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  meter: one(meters, {
    fields: [transactions.meterId],
    references: [meters.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  meter: one(meters, {
    fields: [events.meterId],
    references: [meters.id],
  }),
  site: one(sites, {
    fields: [events.siteId],
    references: [sites.id],
  }),
}));

// === INSERTS & TYPES ===

export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertSiteSchema = createInsertSchema(sites).omit({ id: true, createdAt: true });
export const insertOperationModeSchema = createInsertSchema(operationModes).omit({ id: true, createdAt: true });
export const insertEstablishmentTypeSchema = createInsertSchema(establishmentTypes).omit({ id: true, createdAt: true });
export const insertEstablishmentSchema = createInsertSchema(establishments).omit({ id: true, createdAt: true });
export const insertMeterSchema = createInsertSchema(meters).omit({ id: true, createdAt: true });
export const insertBillingProfileSchema = createInsertSchema(billingProfiles).omit({ id: true, createdAt: true });
export const insertMpesaKeySchema = createInsertSchema(mpesaKeys).omit({ id: true, createdAt: true });

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Site = typeof sites.$inferSelect;
export type InsertSite = z.infer<typeof insertSiteSchema>;

export type OperationMode = typeof operationModes.$inferSelect;
export type InsertOperationMode = z.infer<typeof insertOperationModeSchema>;

export type EstablishmentType = typeof establishmentTypes.$inferSelect;
export type InsertEstablishmentType = z.infer<typeof insertEstablishmentTypeSchema>;

export type Establishment = typeof establishments.$inferSelect;
export type InsertEstablishment = z.infer<typeof insertEstablishmentSchema>;

export type Meter = typeof meters.$inferSelect;
export type InsertMeter = z.infer<typeof insertMeterSchema>;

export type BillingProfile = typeof billingProfiles.$inferSelect;
export type InsertBillingProfile = z.infer<typeof insertBillingProfileSchema>;

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, timestamp: true });

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type AppEvent = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type MpesaKey = typeof mpesaKeys.$inferSelect;
export type InsertMpesaKey = z.infer<typeof insertMpesaKeySchema>;
