import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/database'
import { Cliente } from '@/database/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const db = await getDatabase()
  const collection = db.collection<Cliente>('clientes')

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const objectId = new ObjectId(id as string)

  switch (req.method) {
    case 'GET':
      try {
        const cliente = await collection.findOne({ _id: objectId })
        if (!cliente) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }
        res.status(200).json(cliente)
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente' })
      }
      break

    case 'PUT':
      try {
        const updateData = {
          ...req.body,
          updatedAt: new Date()
        }
        delete updateData._id // Remove o _id para evitar conflitos

        const result = await collection.updateOne(
          { _id: objectId },
          { $set: updateData }
        )

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }

        res.status(200).json({ message: 'Cliente atualizado com sucesso' })
      } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' })
      }
      break

    case 'DELETE':
      try {
        const result = await collection.deleteOne({ _id: objectId })
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }
        res.status(200).json({ message: 'Cliente deletado com sucesso' })
      } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cliente' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}