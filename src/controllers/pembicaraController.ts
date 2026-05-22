import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getAllPembicara = async (_req: Request, res: Response) => {
  try {
    const pembicara = await prisma.pembicara.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(pembicara);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getPembicaraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pembicara = await prisma.pembicara.findUnique({
      where: { id: Number(id) },
      include: { events: true },
    });
    if (!pembicara) return res.status(404).json({ message: 'Pembicara tidak ditemukan.' });
    return res.json(pembicara);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const createPembicara = async (req: Request, res: Response) => {
  try {
    const { name, title, expertise, email, phone, bio, photoUrl } = req.body;
    if (!name || !title || !expertise) {
      return res.status(400).json({ message: 'Nama, jabatan, dan keahlian wajib diisi.' });
    }
    const pembicara = await prisma.pembicara.create({
      data: { name, title, expertise, email, phone, bio, photoUrl },
    });
    return res.status(201).json(pembicara);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePembicara = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, title, expertise, email, phone, bio, photoUrl } = req.body;
    const pembicara = await prisma.pembicara.update({
      where: { id: Number(id) },
      data: { name, title, expertise, email, phone, bio, photoUrl },
    });
    return res.json(pembicara);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const deletePembicara = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pembicara.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Pembicara berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
