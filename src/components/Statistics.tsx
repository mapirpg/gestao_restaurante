 
import { Pedido } from "@/database/models";
import { TrendingUp, AttachMoney, Person, Restaurant } from "@mui/icons-material";
import { 
  Typography, 
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  Stack,
  ChipProps} from "@mui/material";
import React, { useEffect } from "react";

export interface Estatisticas {
  totalPedidos: number;
  totalFaturamento: number;
  ticketMedio: number;
  pedidosPorStatus: Record<string, number>;
  clienteMaisFrequente?: { nome: string; total: number };
  produtoMaisVendido?: { nome: string; quantidade: number };
  faturamentoPorCliente: { nome: string; total: number }[];
}

export const Statistics = ({
  pedidos,
  corDoStatus
}: {
  pedidos: Pedido[],
  corDoStatus: (status: string) => ChipProps['color']
}) => {
  const [estatisticas, setEstatisticas] = React.useState<Estatisticas>({
    totalPedidos: 0,
    totalFaturamento: 0,
    ticketMedio: 0,
    pedidosPorStatus: {},
    clienteMaisFrequente: undefined,
    produtoMaisVendido: undefined,
    faturamentoPorCliente: []
  });

  function calcularEstatisticas(listaPedidos: Pedido[]) {
    const totalPedidos = listaPedidos.length;
    const totalFaturamento = listaPedidos.reduce((acc, p) => acc + p.total, 0);
    const ticketMedio = totalPedidos > 0 ? totalFaturamento / totalPedidos : 0;

    const pedidosPorStatus = listaPedidos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Cliente mais frequente
    const clientesMap = listaPedidos.reduce((acc, p) => {
      const nome = p.cliente?.nome || 'Sem nome';
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clienteMaisFrequente = Object.entries(clientesMap).sort((a, b) => b[1] - a[1])[0];

    // Produto mais vendido
    const produtosMap = listaPedidos.reduce((acc, p) => {
      p.itens.forEach(item => {
        acc[item.nome] = (acc[item.nome] || 0) + item.quantidade;
      });
      return acc;
    }, {} as Record<string, number>);

    const produtoMaisVendido = Object.entries(produtosMap).sort((a, b) => b[1] - a[1])[0];

    // Faturamento por cliente
    const faturamentoPorClienteMap = listaPedidos.reduce((acc, p) => {
      const nome = p.cliente?.nome || 'Sem nome';
      acc[nome] = (acc[nome] || 0) + p.total;
      return acc;
    }, {} as Record<string, number>);

    const faturamentoPorCliente = Object.entries(faturamentoPorClienteMap)
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setEstatisticas({
      totalPedidos,
      totalFaturamento,
      ticketMedio,
      pedidosPorStatus,
      clienteMaisFrequente: clienteMaisFrequente ? { nome: clienteMaisFrequente[0], total: clienteMaisFrequente[1] } : undefined,
      produtoMaisVendido: produtoMaisVendido ? { nome: produtoMaisVendido[0], quantidade: produtoMaisVendido[1] } : undefined,
      faturamentoPorCliente
    });
  }

  useEffect(() => {
    calcularEstatisticas(pedidos);
  }, [pedidos]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">📊 Estatísticas</Typography>

      </Box>

        <Grid container spacing={2}>
          <Grid size={2.4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: '#e3f2fd', textAlign: 'center' }}>
              <Restaurant color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4">{estatisticas.totalPedidos}</Typography>
              <Typography variant="body2" color="text.secondary">Total de Pedidos</Typography>
            </Paper>
          </Grid>

          <Grid size={2.4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: '#e8f5e9', textAlign: 'center' }}>
              <AttachMoney color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h4">R$ {estatisticas.totalFaturamento.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">Faturamento Total</Typography>
            </Paper>
          </Grid>

          <Grid size={2.4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: '#fff3e0', textAlign: 'center' }}>
              <TrendingUp color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h4">R$ {estatisticas.ticketMedio.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">Ticket Médio</Typography>
            </Paper>
          </Grid>

          <Grid size={2.4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: '#f3e5f5', textAlign: 'center' }}>
              <Person color="secondary" sx={{ fontSize: 40 }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                {estatisticas.clienteMaisFrequente?.nome || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cliente mais frequente ({estatisticas.clienteMaisFrequente?.total || 0} pedidos)
              </Typography>
            </Paper>
          </Grid>

          <Grid size={2.4}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: '#fce4ec', textAlign: 'center' }}>
              <Restaurant sx={{ fontSize: 40, color: '#c2185b' }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                {estatisticas.produtoMaisVendido?.nome || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Produto mais vendido ({estatisticas.produtoMaisVendido?.quantidade || 0} unidades)
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Status dos Pedidos:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(estatisticas.pedidosPorStatus).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  color={corDoStatus(status)}
                  size="small"
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Top 5 Clientes (Faturamento):</Typography>
            {estatisticas.faturamentoPorCliente.slice(0, 5).map((cliente, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{index + 1}. {cliente.nome}</Typography>
                <Typography variant="body2" fontWeight="bold">R$ {cliente.total.toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
    </Paper>
  )
}