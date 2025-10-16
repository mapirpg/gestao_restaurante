import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Produto } from '@/database/models'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const db = await getDatabase()
  const collection = db.collection<Produto & { _id: ObjectId }>('produtos')

  switch (req.method) {
    case 'PUT':
      try {
        const updateData = req.body
        
        const result = await collection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { 
            $set: {
              ...updateData,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        )

        if (!result) {
          res.status(404).json({ error: 'Produto não encontrado' })
          return
        }

        res.status(200).json(result)
      } catch (error) {
        console.error('Erro ao atualizar produto:', error)
        res.status(500).json({ error: 'Erro ao atualizar produto' })
      }
      break

    case 'DELETE':
      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Produto não encontrado' })
        }

        res.status(200).json({ message: 'Produto deletado com sucesso' })
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
        res.status(500).json({ error: 'Erro ao deletar produto' })
      }
      break

    default:
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}