import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.categoryEvent.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.categoryEvent.findUnique({
      where: { id: Number(id) },
      include: { events: true },
    });
    if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    const category = await prisma.categoryEvent.create({
      data: { name, description, color: color || '#6366f1' },
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    const category = await prisma.categoryEvent.update({
      where: { id: Number(id) },
      data: { name, description, color },
    });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.categoryEvent.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
