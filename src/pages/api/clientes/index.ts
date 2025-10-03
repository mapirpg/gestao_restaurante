import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Cliente } from '@/database/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  const collection = db.collection<Cliente>('clientes')

  if (req.method === 'POST') {
    try {

      const cliente: Cliente = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await collection.insertOne(cliente)

      res.status(201).json({ _id: result.insertedId.toString(), ...cliente })
    } catch (error: unknown ) {
      console.error('Erro ao criar cliente:', error)
      res.status(500).json({ error: 'Erro ao criar cliente' })
    }
  } else if (req.method === 'GET') {
    try {
      const clientes = await collection.find({}).toArray()
      res.status(200).json(clientes)
    } catch (error: unknown ) {
      console.error('Erro ao buscar clientes:', error)
      res.status(500).json({ error: 'Erro ao buscar clientes' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}