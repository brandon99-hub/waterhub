
import { db } from "./db";
import {
  admins, clients, sites, operationModes, establishmentTypes, establishments, occupancies, meters, billingProfiles, mpesaKeys,
  transactions, events,
  type InsertAdmin, type InsertClient, type InsertSite, type InsertOperationMode, type InsertEstablishmentType,
  type InsertEstablishment, type InsertMeter, type InsertBillingProfile, type InsertMpesaKey,
  type InsertTransaction, type InsertEvent,
  type Admin, type Client, type Site, type OperationMode, type EstablishmentType,
  type Establishment, type Meter, type BillingProfile, type MpesaKey,
  type Transaction, type AppEvent
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Admins
  getAdmins(): Promise<Admin[]>;
  getAdmin(id: number): Promise<Admin | undefined>;
  createAdmin(data: InsertAdmin): Promise<Admin>;
  updateAdmin(id: number, data: Partial<InsertAdmin>): Promise<Admin>;
  deleteAdmin(id: number): Promise<void>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(data: InsertClient): Promise<Client>;
  updateClient(id: number, data: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Sites
  getSites(): Promise<Site[]>;
  getSite(id: number): Promise<Site | undefined>;
  createSite(data: InsertSite): Promise<Site>;
  updateSite(id: number, data: Partial<InsertSite>): Promise<Site>;
  deleteSite(id: number): Promise<void>;

  // Operation Modes
  getOperationModes(): Promise<OperationMode[]>;
  getOperationMode(id: number): Promise<OperationMode | undefined>;
  createOperationMode(data: InsertOperationMode): Promise<OperationMode>;
  updateOperationMode(id: number, data: Partial<InsertOperationMode>): Promise<OperationMode>;
  deleteOperationMode(id: number): Promise<void>;

  // Establishment Types
  getEstablishmentTypes(): Promise<EstablishmentType[]>;
  getEstablishmentType(id: number): Promise<EstablishmentType | undefined>;
  createEstablishmentType(data: InsertEstablishmentType): Promise<EstablishmentType>;
  updateEstablishmentType(id: number, data: Partial<InsertEstablishmentType>): Promise<EstablishmentType>;
  deleteEstablishmentType(id: number): Promise<void>;

  // Establishments
  getEstablishments(): Promise<Establishment[]>;
  getEstablishment(id: number): Promise<Establishment | undefined>;
  createEstablishment(data: InsertEstablishment): Promise<Establishment>;
  updateEstablishment(id: number, data: Partial<InsertEstablishment>): Promise<Establishment>;
  deleteEstablishment(id: number): Promise<void>;

  // Meters
  getMeters(): Promise<Meter[]>;
  getMeter(id: number): Promise<Meter | undefined>;
  createMeter(data: InsertMeter): Promise<Meter>;
  updateMeter(id: number, data: Partial<InsertMeter>): Promise<Meter>;
  deleteMeter(id: number): Promise<void>;

  // Billing Profiles
  getBillingProfiles(): Promise<BillingProfile[]>;
  getBillingProfile(id: number): Promise<BillingProfile | undefined>;
  createBillingProfile(data: InsertBillingProfile): Promise<BillingProfile>;
  updateBillingProfile(id: number, data: Partial<InsertBillingProfile>): Promise<BillingProfile>;
  deleteBillingProfile(id: number): Promise<void>;

  // Mpesa Keys
  getMpesaKeys(): Promise<MpesaKey[]>;
  getMpesaKey(id: number): Promise<MpesaKey | undefined>;
  createMpesaKey(data: InsertMpesaKey): Promise<MpesaKey>;
  updateMpesaKey(id: number, data: Partial<InsertMpesaKey>): Promise<MpesaKey>;
  deleteMpesaKey(id: number): Promise<void>;

  // Occupancies
  getOccupanciesByEstablishment(establishmentId: number): Promise<any[]>;
  createOccupancy(data: any): Promise<any>;
  updateOccupancy(id: number, data: any): Promise<any>;
  deleteOccupancy(id: number): Promise<void>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    clientsCount: number;
    sitesCount: number;
    metersCount: number;
    adminsCount: number;
    totalRevenue: number;
    monthlyConsumption: number;
  }>;

  // Transactions
  getTransactions(limit?: number): Promise<Transaction[]>;
  createTransaction(data: InsertTransaction): Promise<Transaction>;

  // Events
  getEvents(limit?: number): Promise<AppEvent[]>;
  createEvent(data: InsertEvent): Promise<AppEvent>;
}

export class DatabaseStorage implements IStorage {
  // Admins
  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [result] = await db.select().from(admins).where(eq(admins.id, id));
    return result;
  }
  async createAdmin(data: InsertAdmin): Promise<Admin> {
    const [result] = await db.insert(admins).values(data).returning();
    return result;
  }
  async updateAdmin(id: number, data: Partial<InsertAdmin>): Promise<Admin> {
    const [result] = await db.update(admins).set(data).where(eq(admins.id, id)).returning();
    return result;
  }
  async deleteAdmin(id: number): Promise<void> {
    await db.delete(admins).where(eq(admins.id, id));
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }
  async getClient(id: number): Promise<Client | undefined> {
    const [result] = await db.select().from(clients).where(eq(clients.id, id));
    return result;
  }
  async createClient(data: InsertClient): Promise<Client> {
    const [result] = await db.insert(clients).values(data).returning();
    return result;
  }
  async updateClient(id: number, data: Partial<InsertClient>): Promise<Client> {
    const [result] = await db.update(clients).set(data).where(eq(clients.id, id)).returning();
    return result;
  }
  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Sites
  async getSites(): Promise<Site[]> {
    return await db.select().from(sites);
  }
  async getSite(id: number): Promise<Site | undefined> {
    const [result] = await db.select().from(sites).where(eq(sites.id, id));
    return result;
  }
  async createSite(data: InsertSite): Promise<Site> {
    const [result] = await db.insert(sites).values(data).returning();
    return result;
  }
  async updateSite(id: number, data: Partial<InsertSite>): Promise<Site> {
    const [result] = await db.update(sites).set(data).where(eq(sites.id, id)).returning();
    return result;
  }
  async deleteSite(id: number): Promise<void> {
    await db.delete(sites).where(eq(sites.id, id));
  }

  // Operation Modes
  async getOperationModes(): Promise<OperationMode[]> {
    return await db.select().from(operationModes);
  }
  async getOperationMode(id: number): Promise<OperationMode | undefined> {
    const [result] = await db.select().from(operationModes).where(eq(operationModes.id, id));
    return result;
  }
  async createOperationMode(data: InsertOperationMode): Promise<OperationMode> {
    const [result] = await db.insert(operationModes).values(data).returning();
    return result;
  }
  async updateOperationMode(id: number, data: Partial<InsertOperationMode>): Promise<OperationMode> {
    const [result] = await db.update(operationModes).set(data).where(eq(operationModes.id, id)).returning();
    return result;
  }
  async deleteOperationMode(id: number): Promise<void> {
    await db.delete(operationModes).where(eq(operationModes.id, id));
  }

  // Establishment Types
  async getEstablishmentTypes(): Promise<EstablishmentType[]> {
    return await db.select().from(establishmentTypes);
  }
  async getEstablishmentType(id: number): Promise<EstablishmentType | undefined> {
    const [result] = await db.select().from(establishmentTypes).where(eq(establishmentTypes.id, id));
    return result;
  }
  async createEstablishmentType(data: InsertEstablishmentType): Promise<EstablishmentType> {
    const [result] = await db.insert(establishmentTypes).values(data).returning();
    return result;
  }
  async updateEstablishmentType(id: number, data: Partial<InsertEstablishmentType>): Promise<EstablishmentType> {
    const [result] = await db.update(establishmentTypes).set(data).where(eq(establishmentTypes.id, id)).returning();
    return result;
  }
  async deleteEstablishmentType(id: number): Promise<void> {
    await db.delete(establishmentTypes).where(eq(establishmentTypes.id, id));
  }

  // Establishments
  async getEstablishments(): Promise<Establishment[]> {
    return await db.select().from(establishments);
  }
  async getEstablishment(id: number): Promise<Establishment | undefined> {
    const [result] = await db.select().from(establishments).where(eq(establishments.id, id));
    return result;
  }
  async createEstablishment(data: InsertEstablishment): Promise<Establishment> {
    const [result] = await db.insert(establishments).values(data).returning();
    return result;
  }
  async updateEstablishment(id: number, data: Partial<InsertEstablishment>): Promise<Establishment> {
    const [result] = await db.update(establishments).set(data).where(eq(establishments.id, id)).returning();
    return result;
  }
  async deleteEstablishment(id: number): Promise<void> {
    await db.delete(establishments).where(eq(establishments.id, id));
  }

  // Meters
  async getMeters(): Promise<any[]> {
    // LEFT JOIN with occupancies to get customer name
    const results = await db
      .select({
        id: meters.id,
        serialNo: meters.serialNo,
        imeiNo: meters.imeiNo,
        clientId: meters.clientId,
        establishmentId: meters.establishmentId,
        operationModeId: meters.operationModeId,
        simcard: meters.simcard,
        type: meters.type,
        meterSize: meters.meterSize,
        technology: meters.technology,
        valveStatus: meters.valveStatus,
        latestReading: meters.latestReading,
        lastReadingTime: meters.lastReadingTime,
        createdAt: meters.createdAt,
        customerName: occupancies.customerName,
      })
      .from(meters)
      .leftJoin(occupancies, eq(occupancies.meterId, meters.id));

    return results;
  }
  async getMeter(id: number): Promise<Meter | undefined> {
    const [result] = await db.select().from(meters).where(eq(meters.id, id));
    return result;
  }
  async createMeter(data: InsertMeter): Promise<Meter> {
    const [result] = await db.insert(meters).values(data).returning();
    return result;
  }
  async updateMeter(id: number, data: Partial<InsertMeter>): Promise<Meter> {
    const [result] = await db.update(meters).set(data).where(eq(meters.id, id)).returning();
    return result;
  }
  async deleteMeter(id: number): Promise<void> {
    await db.delete(meters).where(eq(meters.id, id));
  }

  // Billing Profiles
  async getBillingProfiles(): Promise<BillingProfile[]> {
    return await db.select().from(billingProfiles);
  }
  async getBillingProfile(id: number): Promise<BillingProfile | undefined> {
    const [result] = await db.select().from(billingProfiles).where(eq(billingProfiles.id, id));
    return result;
  }
  async createBillingProfile(data: InsertBillingProfile): Promise<BillingProfile> {
    const [result] = await db.insert(billingProfiles).values(data).returning();
    return result;
  }
  async updateBillingProfile(id: number, data: Partial<InsertBillingProfile>): Promise<BillingProfile> {
    const [result] = await db.update(billingProfiles).set(data).where(eq(billingProfiles.id, id)).returning();
    return result;
  }
  async deleteBillingProfile(id: number): Promise<void> {
    await db.delete(billingProfiles).where(eq(billingProfiles.id, id));
  }

  // Mpesa Keys
  async getMpesaKeys(): Promise<MpesaKey[]> {
    return await db.select().from(mpesaKeys);
  }
  async getMpesaKey(id: number): Promise<MpesaKey | undefined> {
    const [result] = await db.select().from(mpesaKeys).where(eq(mpesaKeys.id, id));
    return result;
  }
  async createMpesaKey(data: InsertMpesaKey): Promise<MpesaKey> {
    const [result] = await db.insert(mpesaKeys).values(data).returning();
    return result;
  }
  async updateMpesaKey(id: number, data: Partial<InsertMpesaKey>): Promise<MpesaKey> {
    const [result] = await db.update(mpesaKeys).set(data).where(eq(mpesaKeys.id, id)).returning();
    return result;
  }
  async deleteMpesaKey(id: number): Promise<void> {
    await db.delete(mpesaKeys).where(eq(mpesaKeys.id, id));
  }

  // Occupancies
  async getOccupanciesByEstablishment(establishmentId: number): Promise<any[]> {
    return await db
      .select({
        id: occupancies.id,
        establishmentId: occupancies.establishmentId,
        unitNumber: occupancies.unitNumber,
        customerName: occupancies.customerName,
        customerPhone: occupancies.customerPhone,
        customerEmail: occupancies.customerEmail,
        meterId: occupancies.meterId,
        status: occupancies.status,
        createdAt: occupancies.createdAt,
        meterSerial: meters.serialNo,
        meterTechnology: meters.technology,
      })
      .from(occupancies)
      .leftJoin(meters, eq(meters.id, occupancies.meterId))
      .where(eq(occupancies.establishmentId, establishmentId));
  }
  async createOccupancy(data: any): Promise<any> {
    const [item] = await db.insert(occupancies).values(data).returning();
    return item;
  }
  async updateOccupancy(id: number, data: any): Promise<any> {
    const [item] = await db.update(occupancies).set(data).where(eq(occupancies.id, id)).returning();
    return item;
  }
  async deleteOccupancy(id: number): Promise<void> {
    await db.delete(occupancies).where(eq(occupancies.id, id));
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    clientsCount: number;
    sitesCount: number;
    metersCount: number;
    adminsCount: number;
    totalRevenue: number;
    monthlyConsumption: number;
  }> {
    const [clientsCount] = await db.select({ count: sql<number>`count(*)` }).from(clients);
    const [sitesCount] = await db.select({ count: sql<number>`count(*)` }).from(sites);
    const [metersCount] = await db.select({ count: sql<number>`count(*)` }).from(meters);
    const [adminsCount] = await db.select({ count: sql<number>`count(*)` }).from(admins);

    const [revenueSum] = await db.select({ sum: sql<number>`sum(cast(${transactions.amount} as numeric))` }).from(transactions).where(eq(transactions.status, 'success'));
    const [consumptionSum] = await db.select({ sum: sql<number>`sum(${transactions.volume})` }).from(transactions);

    return {
      clientsCount: Number(clientsCount.count),
      sitesCount: Number(sitesCount.count),
      metersCount: Number(metersCount.count),
      adminsCount: Number(adminsCount.count),
      totalRevenue: Number(revenueSum?.sum || 0),
      monthlyConsumption: Number(consumptionSum?.sum || 0),
    };
  }

  // Transactions
  async getTransactions(limit: number = 50): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(sql`${transactions.timestamp} DESC`).limit(limit);
  }
  async createTransaction(data: InsertTransaction): Promise<Transaction> {
    const [result] = await db.insert(transactions).values(data).returning();
    return result;
  }

  // Events
  async getEvents(limit: number = 50): Promise<AppEvent[]> {
    return await db.select().from(events).orderBy(sql`${events.timestamp} DESC`).limit(limit);
  }
  async createEvent(data: InsertEvent): Promise<AppEvent> {
    const [result] = await db.insert(events).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
