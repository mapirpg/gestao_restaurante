 
 
 
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Pedido, Produto } from '@/database/models'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  const pedidosCollection = db.collection<Pedido>('pedidos') // CORRIGIDO: era produtosCollection
  const produtosCollection = db.collection<Produto>('produtos')

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

        const query: any = {}

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

        const pedidos = await pedidosCollection
          .find(query)
          .sort(sort)
          .toArray()

        res.status(200).json(pedidos)
      } catch (error) {
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

        // Verificar estoque disponível antes de criar o pedido
        for (const item of pedido.itens) {
          const produto = await produtosCollection.findOne({ 
            _id: new ObjectId(item.produtoId) 
          })

          if (!produto) {
            return res.status(400).json({ 
              error: `Produto ${item.nome} não encontrado` 
            })
          }

          if (produto.quantidade < item.quantidade) {
            return res.status(400).json({ 
              error: `Estoque insuficiente para ${item.nome}. Disponível: ${produto.quantidade}` 
            })
          }
        }

        // Deduzir quantidade do estoque para cada item
        for (const item of pedido.itens) {
          await produtosCollection.updateOne(
            { _id: new ObjectId(item.produtoId) },
            { 
              $inc: { quantidade: -item.quantidade },
              $set: { updatedAt: new Date() }
            }
          )
        }

        const resultado = await pedidosCollection.insertOne(pedido)
        
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

        // Buscar pedido anterior para verificar mudança de status
        const pedidoAnterior = await pedidosCollection.findOne({ 
          _id: new ObjectId(pedido._id) 
        })

        if (!pedidoAnterior) {
          return res.status(404).json({ error: 'Pedido não encontrado' })
        }

        // Se o pedido foi cancelado, devolver produtos ao estoque
        if (pedido.status === 'cancelado' && pedidoAnterior.status !== 'cancelado') {
          for (const item of pedidoAnterior.itens) {
            await produtosCollection.updateOne(
              { _id: new ObjectId(item.produtoId) },
              { 
                $inc: { quantidade: item.quantidade },
                $set: { updatedAt: new Date() }
              }
            )
          }
        }

        const { _id, ...atualizacoes } = pedido

        const resultado = await pedidosCollection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { ...atualizacoes, updatedAt: new Date() } }
        )

        if (resultado.matchedCount === 0) {
          return res.status(404).json({ error: 'Pedido não encontrado' })
        }

        res.status(200).json({ ...pedido })
      } catch (error) {
        res.status(500).json({ error: `Erro ao atualizar pedido: ${JSON.stringify(error)}` })
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