/* eslint-disable @typescript-eslint/no-unused-vars */
 
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Pedido } from '@/database/models'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  const collection = db.collection<Pedido>('pedidos')

  switch (req.method) {
    case 'GET':
      try {
        const pedidos = await collection.find().toArray()
        res.status(200).json(pedidos)
      } catch (error) {
        res.status(500).json({ error: 'Erro ao listar pedidos' })
      }
      break
    case 'POST':
      try {
        const pedido: Pedido = req.body

        const resultado = await collection.insertOne(pedido)
        res.status(201).json({ ...pedido, _id: resultado.insertedId.toString() })
      } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar pedido' })
      }
      break
    case 'PUT':
      try {
        const pedido: Pedido = req.body

        if (!pedido._id) {
          return res.status(400).json({ error: 'ID do pedido é obrigatório' })
        }

        const { _id, ...atualizacoes } = pedido

        const resultado = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: atualizacoes }
        )

        if (resultado.matchedCount === 0) {
          return res.status(404).json({ error: 'Pedido não encontrado' })
        }

        res.status(200).json({ ...pedido })
      } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar pedido' })
      }
      break
    case 'DELETE':
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break  
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}