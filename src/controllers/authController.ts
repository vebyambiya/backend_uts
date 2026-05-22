import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

export const login = async (req: Request, res: Response) => {
  try {
    const { nim, password } = req.body;
    if (!nim || !password) {
      return res.status(400).json({ message: 'NIM dan Password wajib diisi.' });
    }
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user) {
      return res.status(401).json({ message: 'NIM atau Password salah.' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'NIM atau Password salah.' });
    }
    const token = jwt.sign(
      { id: user.id, nim: user.nim, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    return res.json({ token, user: { id: user.id, nim: user.nim, name: user.name } });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nim, name, password } = req.body;
    if (!nim || !name || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }
    const existing = await prisma.user.findUnique({ where: { nim } });
    if (existing) {
      return res.status(400).json({ message: 'NIM sudah terdaftar.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nim, name, password: hashedPassword },
    });
    return res.status(201).json({ message: 'User berhasil dibuat.', user: { id: user.id, nim: user.nim, name: user.name } });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
