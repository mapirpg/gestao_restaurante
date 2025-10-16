 
import { TrendingUp, AttachMoney, Person, Restaurant, Refresh } from "@mui/icons-material";
import { 
  Typography, 
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  Stack,
  ChipProps,
  CircularProgress,
  IconButton,
  Tooltip} from "@mui/material";
import React, { useEffect } from "react";
import { API_BASE_URL, headers } from "@/config";

const apiUrl = API_BASE_URL;

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
  corDoStatus
}: {
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

  const [carregando, setCarregando] = React.useState(false);

  async function buscarEstatisticas() {
    setCarregando(true);
    try {
      const response = await fetch(`${apiUrl}/estatisticas`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const dados: Estatisticas = await response.json();
        console.log('Estatísticas do backend:', dados);
        setEstatisticas(dados);
      } else {
        console.error('Erro ao buscar estatísticas:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarEstatisticas();
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">📊 Estatísticas </Typography>
        <Tooltip title="Atualizar estatísticas">
          <IconButton size="small" onClick={buscarEstatisticas} disabled={carregando}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
        </>
      )}
    </Paper>
  )
}