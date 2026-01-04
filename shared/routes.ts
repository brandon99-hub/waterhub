
import { z } from 'zod';
import { 
  insertAdminSchema, admins,
  insertClientSchema, clients,
  insertSiteSchema, sites,
  insertOperationModeSchema, operationModes,
  insertEstablishmentTypeSchema, establishmentTypes,
  insertEstablishmentSchema, establishments,
  insertMeterSchema, meters,
  insertBillingProfileSchema, billingProfiles,
  insertMpesaKeySchema, mpesaKeys
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  admins: {
    list: {
      method: 'GET' as const,
      path: '/api/admins',
      responses: {
        200: z.array(z.custom<typeof admins.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/admins/:id',
      responses: {
        200: z.custom<typeof admins.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/admins',
      input: insertAdminSchema,
      responses: {
        201: z.custom<typeof admins.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/admins/:id',
      input: insertAdminSchema.partial(),
      responses: {
        200: z.custom<typeof admins.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/admins/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  clients: {
    list: {
      method: 'GET' as const,
      path: '/api/clients',
      responses: {
        200: z.array(z.custom<typeof clients.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/clients/:id',
      responses: {
        200: z.custom<typeof clients.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/clients',
      input: insertClientSchema,
      responses: {
        201: z.custom<typeof clients.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/clients/:id',
      input: insertClientSchema.partial(),
      responses: {
        200: z.custom<typeof clients.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/clients/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  sites: {
    list: {
      method: 'GET' as const,
      path: '/api/sites',
      responses: {
        200: z.array(z.custom<typeof sites.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sites',
      input: insertSiteSchema,
      responses: {
        201: z.custom<typeof sites.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sites/:id',
      input: insertSiteSchema.partial(),
      responses: {
        200: z.custom<typeof sites.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sites/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  operationModes: {
    list: {
      method: 'GET' as const,
      path: '/api/operation-modes',
      responses: {
        200: z.array(z.custom<typeof operationModes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/operation-modes',
      input: insertOperationModeSchema,
      responses: {
        201: z.custom<typeof operationModes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/operation-modes/:id',
      input: insertOperationModeSchema.partial(),
      responses: {
        200: z.custom<typeof operationModes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/operation-modes/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  establishmentTypes: {
    list: {
      method: 'GET' as const,
      path: '/api/establishment-types',
      responses: {
        200: z.array(z.custom<typeof establishmentTypes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/establishment-types',
      input: insertEstablishmentTypeSchema,
      responses: {
        201: z.custom<typeof establishmentTypes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/establishment-types/:id',
      input: insertEstablishmentTypeSchema.partial(),
      responses: {
        200: z.custom<typeof establishmentTypes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/establishment-types/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  establishments: {
    list: {
      method: 'GET' as const,
      path: '/api/establishments',
      responses: {
        200: z.array(z.custom<typeof establishments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/establishments',
      input: insertEstablishmentSchema,
      responses: {
        201: z.custom<typeof establishments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/establishments/:id',
      input: insertEstablishmentSchema.partial(),
      responses: {
        200: z.custom<typeof establishments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/establishments/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  meters: {
    list: {
      method: 'GET' as const,
      path: '/api/meters',
      responses: {
        200: z.array(z.custom<typeof meters.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/meters',
      input: insertMeterSchema,
      responses: {
        201: z.custom<typeof meters.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/meters/:id',
      input: insertMeterSchema.partial(),
      responses: {
        200: z.custom<typeof meters.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/meters/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  billingProfiles: {
    list: {
      method: 'GET' as const,
      path: '/api/billing-profiles',
      responses: {
        200: z.array(z.custom<typeof billingProfiles.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/billing-profiles',
      input: insertBillingProfileSchema,
      responses: {
        201: z.custom<typeof billingProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/billing-profiles/:id',
      input: insertBillingProfileSchema.partial(),
      responses: {
        200: z.custom<typeof billingProfiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/billing-profiles/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  mpesaKeys: {
    list: {
      method: 'GET' as const,
      path: '/api/mpesa-keys',
      responses: {
        200: z.array(z.custom<typeof mpesaKeys.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/mpesa-keys',
      input: insertMpesaKeySchema,
      responses: {
        201: z.custom<typeof mpesaKeys.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/mpesa-keys/:id',
      input: insertMpesaKeySchema.partial(),
      responses: {
        200: z.custom<typeof mpesaKeys.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/mpesa-keys/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          clientsCount: z.number(),
          sitesCount: z.number(),
          metersCount: z.number(),
          adminsCount: z.number(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
