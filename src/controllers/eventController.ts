import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
        pembicara: true,
      },
      orderBy: { date: 'asc' },
    });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: { category: true, pembicara: true },
    });
    if (!event) return res.status(404).json({ message: 'Event tidak ditemukan.' });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, time, location, capacity, status, imageUrl, categoryId, pembicaraId } = req.body;
    if (!title || !date || !time || !location || !categoryId || !pembicaraId) {
      return res.status(400).json({ message: 'Field wajib: title, date, time, location, category, pembicara.' });
    }
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
        capacity: Number(capacity) || 0,
        status: status || 'upcoming',
        imageUrl,
        categoryId: Number(categoryId),
        pembicaraId: Number(pembicaraId),
      },
      include: { category: true, pembicara: true },
    });
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, capacity, status, imageUrl, categoryId, pembicaraId } = req.body;
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        time,
        location,
        capacity: capacity ? Number(capacity) : undefined,
        status,
        imageUrl,
        categoryId: categoryId ? Number(categoryId) : undefined,
        pembicaraId: pembicaraId ? Number(pembicaraId) : undefined,
      },
      include: { category: true, pembicara: true },
    });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Event berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
