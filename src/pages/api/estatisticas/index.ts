import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Pedido } from '@/database/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDatabase()
    const collection = db.collection<Pedido>('pedidos')

    const estatisticasGerais = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalPedidos: { $sum: 1 },
          totalFaturamento: { $sum: '$total' },
          ticketMedio: { $avg: '$total' }
        }
      }
    ]).toArray()

    const pedidosPorStatus = await collection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray()

    const clienteMaisFrequente = await collection.aggregate([
      {
        $group: {
          _id: '$cliente.nome',
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]).toArray()

    const produtoMaisVendido = await collection.aggregate([
      { $unwind: '$itens' },
      {
        $group: {
          _id: '$itens.nome',
          quantidade: { $sum: '$itens.quantidade' }
        }
      },
      { $sort: { quantidade: -1 } },
      { $limit: 1 }
    ]).toArray()

    const faturamentoPorCliente = await collection.aggregate([
      {
        $group: {
          _id: '$cliente.nome',
          total: { $sum: '$total' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          nome: '$_id',
          total: 1
        }
      }
    ]).toArray()

    const estatisticas = {
      totalPedidos: estatisticasGerais[0]?.totalPedidos || 0,
      totalFaturamento: estatisticasGerais[0]?.totalFaturamento || 0,
      ticketMedio: estatisticasGerais[0]?.ticketMedio || 0,
      pedidosPorStatus: pedidosPorStatus.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {} as Record<string, number>),
      clienteMaisFrequente: clienteMaisFrequente[0] ? {
        nome: clienteMaisFrequente[0]._id,
        total: clienteMaisFrequente[0].total
      } : undefined,
      produtoMaisVendido: produtoMaisVendido[0] ? {
        nome: produtoMaisVendido[0]._id,
        quantidade: produtoMaisVendido[0].quantidade
      } : undefined,
      faturamentoPorCliente
    }

    res.status(200).json(estatisticas)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular estatísticas' })
  }
}