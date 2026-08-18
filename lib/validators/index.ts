import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  businessName: z.string().min(3, 'Nama usaha/mitra minimal 3 karakter').max(100),
  role: z.enum(['coffee_shop', 'pengepul', 'admin'], {
    message: 'Role wajib dipilih',
  }),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const submissionSchema = z.object({
  method: z.enum(['setor_langsung', 'dijemput']),
  estimatedWeightKg: z.number().positive('Estimasi berat harus lebih besar dari 0'),
  scheduledAt: z.string().optional(),
  categories: z.array(z.string()).min(1, 'Pilih minimal 1 kategori sampah'),
}).refine((data) => {
  if (data.method === 'dijemput') {
    return data.estimatedWeightKg >= 2;
  }
  return true;
}, {
  message: 'Metode Dijemput memerlukan minimal estimasi berat 2 kg',
  path: ['estimatedWeightKg'],
});

export const weighingSchema = z.object({
  transactionId: z.string().uuid('ID Transaksi tidak valid'),
  items: z.array(
    z.object({
      categoryId: z.string().min(1, 'Kategori wajib dipilih'),
      weightKg: z.number().positive('Berat harus lebih besar dari 0'),
    })
  ).min(1, 'Input minimal 1 jenis sampah'),
});

export const withdrawalSchema = z.object({
  amount: z.number().positive('Nominal penarikan harus lebih dari 0'),
  bankName: z.string().min(2, 'Nama bank wajib diisi'),
  bankAccount: z.string().min(8, 'Nomor rekening 8–20 digit').max(20),
  accountHolder: z.string().min(3, 'Nama pemilik rekening wajib diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type WeighingInput = z.infer<typeof weighingSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
