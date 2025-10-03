import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Cliente } from '@/database/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  const collection = db.collection<Cliente>('clientes')

  switch (req.method) {
    case 'GET':
      try {
        const clientes = await collection.find({}).toArray()
        res.status(200).json(clientes)
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes' })
      }
      break

    case 'POST':
      try {
        const cliente: Cliente = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const result = await collection.insertOne(cliente)
        res.status(201).json({ id: result.insertedId, ...cliente })
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}