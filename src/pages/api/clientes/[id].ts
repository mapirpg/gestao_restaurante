import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const db = await getDatabase()
  const collection = db.collection('clientes')

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const objectId = new ObjectId(id as string)

  if (req.method === 'GET') {
    try {
      const cliente = await collection.findOne({ _id: objectId })
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' })
      }

      return res.status(200).json(cliente)

    } catch (error: unknown ) {
      throw new Error(JSON.stringify(error) || 'Erro ao buscar cliente')
    }
  } else if (req.method === 'PUT') {
    try {
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      }

      delete updateData._id

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: updateData }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' })
      }

      return res.status(200).json({ message: 'Cliente atualizado com sucesso' })

    } catch (error: unknown ) {
      throw new Error(JSON.stringify(error) || 'Erro ao atualizar cliente')
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: objectId })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' })
      }

      return res.status(200).json({ message: 'Cliente deletado com sucesso' })

    } catch (error: unknown ) {
      throw new Error(JSON.stringify(error) || 'Erro ao deletar cliente')
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }

  
}