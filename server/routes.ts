
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Dashboard Stats
  app.get(api.dashboard.stats.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Admins
  app.get(api.admins.list.path, async (req, res) => {
    const items = await storage.getAdmins();
    res.json(items);
  });
  app.get(api.admins.get.path, async (req, res) => {
    const item = await storage.getAdmin(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });
  app.post(api.admins.create.path, async (req, res) => {
    try {
      const input = api.admins.create.input.parse(req.body);
      const item = await storage.createAdmin(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        throw err;
      }
    }
  });
  app.put(api.admins.update.path, async (req, res) => {
    try {
      const input = api.admins.update.input.parse(req.body);
      const item = await storage.updateAdmin(Number(req.params.id), input);
      res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.admins.delete.path, async (req, res) => {
    await storage.deleteAdmin(Number(req.params.id));
    res.status(204).send();
  });

  // Clients
  app.get(api.clients.list.path, async (req, res) => {
    const items = await storage.getClients();
    res.json(items);
  });
  app.get(api.clients.get.path, async (req, res) => {
    const item = await storage.getClient(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });
  app.post(api.clients.create.path, async (req, res) => {
    try {
        const input = api.clients.create.input.parse(req.body);
        const item = await storage.createClient(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.clients.update.path, async (req, res) => {
    try {
        const input = api.clients.update.input.parse(req.body);
        const item = await storage.updateClient(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.clients.delete.path, async (req, res) => {
    await storage.deleteClient(Number(req.params.id));
    res.status(204).send();
  });

  // Sites
  app.get(api.sites.list.path, async (req, res) => {
    const items = await storage.getSites();
    res.json(items);
  });
  app.post(api.sites.create.path, async (req, res) => {
    try {
        const input = api.sites.create.input.parse(req.body);
        const item = await storage.createSite(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.sites.update.path, async (req, res) => {
    try {
        const input = api.sites.update.input.parse(req.body);
        const item = await storage.updateSite(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.sites.delete.path, async (req, res) => {
    await storage.deleteSite(Number(req.params.id));
    res.status(204).send();
  });

  // Operation Modes
  app.get(api.operationModes.list.path, async (req, res) => {
    const items = await storage.getOperationModes();
    res.json(items);
  });
  app.post(api.operationModes.create.path, async (req, res) => {
    try {
        const input = api.operationModes.create.input.parse(req.body);
        const item = await storage.createOperationMode(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.operationModes.update.path, async (req, res) => {
    try {
        const input = api.operationModes.update.input.parse(req.body);
        const item = await storage.updateOperationMode(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.operationModes.delete.path, async (req, res) => {
    await storage.deleteOperationMode(Number(req.params.id));
    res.status(204).send();
  });

  // Establishment Types
  app.get(api.establishmentTypes.list.path, async (req, res) => {
    const items = await storage.getEstablishmentTypes();
    res.json(items);
  });
  app.post(api.establishmentTypes.create.path, async (req, res) => {
    try {
        const input = api.establishmentTypes.create.input.parse(req.body);
        const item = await storage.createEstablishmentType(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.establishmentTypes.update.path, async (req, res) => {
    try {
        const input = api.establishmentTypes.update.input.parse(req.body);
        const item = await storage.updateEstablishmentType(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.establishmentTypes.delete.path, async (req, res) => {
    await storage.deleteEstablishmentType(Number(req.params.id));
    res.status(204).send();
  });

  // Establishments
  app.get(api.establishments.list.path, async (req, res) => {
    const items = await storage.getEstablishments();
    res.json(items);
  });
  app.post(api.establishments.create.path, async (req, res) => {
    try {
        const input = api.establishments.create.input.parse(req.body);
        const item = await storage.createEstablishment(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.establishments.update.path, async (req, res) => {
    try {
        const input = api.establishments.update.input.parse(req.body);
        const item = await storage.updateEstablishment(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.establishments.delete.path, async (req, res) => {
    await storage.deleteEstablishment(Number(req.params.id));
    res.status(204).send();
  });

  // Meters
  app.get(api.meters.list.path, async (req, res) => {
    const items = await storage.getMeters();
    res.json(items);
  });
  app.post(api.meters.create.path, async (req, res) => {
    try {
        const input = api.meters.create.input.parse(req.body);
        const item = await storage.createMeter(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.meters.update.path, async (req, res) => {
    try {
        const input = api.meters.update.input.parse(req.body);
        const item = await storage.updateMeter(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.meters.delete.path, async (req, res) => {
    await storage.deleteMeter(Number(req.params.id));
    res.status(204).send();
  });

  // Billing Profiles
  app.get(api.billingProfiles.list.path, async (req, res) => {
    const items = await storage.getBillingProfiles();
    res.json(items);
  });
  app.post(api.billingProfiles.create.path, async (req, res) => {
    try {
        const input = api.billingProfiles.create.input.parse(req.body);
        const item = await storage.createBillingProfile(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.billingProfiles.update.path, async (req, res) => {
    try {
        const input = api.billingProfiles.update.input.parse(req.body);
        const item = await storage.updateBillingProfile(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.billingProfiles.delete.path, async (req, res) => {
    await storage.deleteBillingProfile(Number(req.params.id));
    res.status(204).send();
  });

  // Mpesa Keys
  app.get(api.mpesaKeys.list.path, async (req, res) => {
    const items = await storage.getMpesaKeys();
    res.json(items);
  });
  app.post(api.mpesaKeys.create.path, async (req, res) => {
    try {
        const input = api.mpesaKeys.create.input.parse(req.body);
        const item = await storage.createMpesaKey(input);
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            throw err;
        }
    }
  });
  app.put(api.mpesaKeys.update.path, async (req, res) => {
    try {
        const input = api.mpesaKeys.update.input.parse(req.body);
        const item = await storage.updateMpesaKey(Number(req.params.id), input);
        res.json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
  });
  app.delete(api.mpesaKeys.delete.path, async (req, res) => {
    await storage.deleteMpesaKey(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  if ((await storage.getOperationModes()).length === 0) {
    console.log("Seeding operation modes...");
    await storage.createOperationMode({ modeName: "Active", modeDescription: "Meter is fully operational" });
    await storage.createOperationMode({ modeName: "Inactive", modeDescription: "Meter is temporarily disabled" });
    await storage.createOperationMode({ modeName: "Maintenance", modeDescription: "Meter is under maintenance" });
  }

  if ((await storage.getEstablishmentTypes()).length === 0) {
    console.log("Seeding establishment types...");
    await storage.createEstablishmentType({ typeName: "Residential" });
    await storage.createEstablishmentType({ typeName: "Commercial" });
    await storage.createEstablishmentType({ typeName: "Industrial" });
  }

  if ((await storage.getAdmins()).length === 0) {
    console.log("Seeding initial admin...");
    await storage.createAdmin({ 
        name: "Super Admin", 
        email: "admin@waterhub.com", 
        address: "HQ", 
        phone: "0700000000" 
    });
  }

  return httpServer;
}
