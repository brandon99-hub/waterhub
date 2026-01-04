
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
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
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

export const meters = pgTable("meters", {
  id: serial("id").primaryKey(),
  serialNo: text("serial_no").notNull(),
  imeiNo: text("imei_no").notNull(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  operationModeId: integer("operation_mode_id").references(() => operationModes.id).notNull(),
  simcard: text("simcard").notNull(),
  type: text("type").notNull(),
  meterSize: text("meter_size").notNull(),
  technology: text("technology").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billingProfiles = pgTable("billing_profiles", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  tariff: text("tariff").notNull(),
  quota: integer("quota").notNull(), // Litres
  automatedBilling: boolean("automated_billing").default(false).notNull(),
  rateKes: numeric("rate_kes").notNull(),
  rateLitres: numeric("rate_litres").notNull(),
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

export type MpesaKey = typeof mpesaKeys.$inferSelect;
export type InsertMpesaKey = z.infer<typeof insertMpesaKeySchema>;
