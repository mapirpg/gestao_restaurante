/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
 
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
        const { 
          status, 
          clienteId, 
          busca, 
          ordenacao,
          dataInicio,
          dataFim,
          valorMin,
          valorMax
        } = req.query

        const query: Query = {}

        if (status && status !== 'todos') {
          query.status = status
        }

        if (clienteId && clienteId !== 'todos') {
          query['cliente._id'] = clienteId
        }

        if (busca && busca !== '') {
          query.$or = [
            { _id: { $regex: busca, $options: 'i' } },
            { 'cliente.nome': { $regex: busca, $options: 'i' } }
          ]
        }

        if (dataInicio || dataFim) {
          query.createdAt = {}
          
          if (dataInicio) {
            const dataInicioDate = new Date(dataInicio as string)
            dataInicioDate.setHours(0, 0, 0, 0)
            query.createdAt.$gte = dataInicioDate
          }
          
          if (dataFim) {
            const dataFimDate = new Date(dataFim as string)
            dataFimDate.setHours(23, 59, 59, 999)
            query.createdAt.$lte = dataFimDate
          }
        }

        if (valorMin || valorMax) {
          query.total = {}
          
          if (valorMin) {
            query.total.$gte = parseFloat(valorMin as string)
          }
          
          if (valorMax) {
            query.total.$lte = parseFloat(valorMax as string)
          }
        }

        let sort: any = { createdAt: -1 } 

        if (ordenacao) {
          switch (ordenacao) {
            case 'data_desc':
              sort = { createdAt: -1 }
              break
            case 'data_asc':
              sort = { createdAt: 1 }
              break
            case 'valor_desc':
              sort = { total: -1 }
              break
            case 'valor_asc':
              sort = { total: 1 }
              break
          }
        }

        const pedidos = await collection
          .find(query)
          .sort(sort)
          .toArray()

        console.log('Query MongoDB:', JSON.stringify(query, null, 2))
        console.log('Total de pedidos encontrados:', pedidos.length)

        res.status(200).json(pedidos)
      } catch (error) {
        console.error('Erro ao listar pedidos:', error)
        res.status(500).json({ error: 'Erro ao listar pedidos' })
      }
      break

    case 'POST':
      try {
        const pedido: Pedido = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        }

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
          { _id: new ObjectId(_id) } as any,
          { $set: { ...atualizacoes, updatedAt: new Date() } }
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