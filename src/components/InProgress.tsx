import { Cliente, Pedido, Produto } from "@/database/models";
import { Search, FilterList, CalendarToday, Restaurant, ExpandMore, ExpandLess, Refresh } from "@mui/icons-material";
import { 
  FormControl, 
  TextField, 
  Typography, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  CircularProgress,
  Grid,
  Box,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Chip,
  ChipProps,
  Menu,
  Paper,
  Divider,
  Collapse,
  Badge,
  Tooltip,
  InputAdornment
} from "@mui/material";
import React from "react";

export interface Filtros {
  busca: string;
  status: string;
  cliente: string;
  ordenacao: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc';
  dataInicio: string;
  dataFim: string;
  valorMin: string;
  valorMax: string;
}

export const InProgress = ({
  pedidos,
  clientes,
  carregandoPedidos,
  atualizarPedidos,
  filtros,
  setFiltros,
  limparFiltros,
  pedidosFiltrados,
  filtrosAbertos,
  setFiltrosAbertos,
  corDoStatus,
  ancoraStatusMenu,
  abrirMenuStatus,
  fecharMenuStatus,
  alterarStatusPedido
}: {
  pedidos: Pedido[];
  clientes: Cliente[];
  produtos: Produto[];
  carregandoPedidos: boolean;
  atualizarPedidos: () => void;
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  limparFiltros: () => void;
  pedidosFiltrados: Pedido[];
  filtrosAbertos: boolean;
  setFiltrosAbertos: React.Dispatch<React.SetStateAction<boolean>>;
  corDoStatus: (status: string) => ChipProps['color'];
  ancoraStatusMenu: null | HTMLElement;
  abrirMenuStatus: (event: React.MouseEvent<HTMLElement>, pedido: Pedido) => void;
  fecharMenuStatus: () => void;
  alterarStatusPedido: (status: Pedido['status']) => void;
}) => {
   return (      
    <Box>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">🔍 Filtros Avançados</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Atualizar dados">
              <IconButton size="small" onClick={() => atualizarPedidos()}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button size="small" variant="outlined" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
            <IconButton size="small" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
              {filtrosAbertos ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={filtrosAbertos}>
          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField
                fullWidth
                size="small"
                label="Buscar (ID ou Cliente)"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Status"
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="preparando">Preparando</MenuItem>
                  <MenuItem value="pronto">Pronto</MenuItem>
                  <MenuItem value="entregue">Entregue</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={filtros.cliente}
                  label="Cliente"
                  onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {clientes.map(cliente => (
                    <MenuItem key={cliente._id} value={cliente._id}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filtros.ordenacao}
                  label="Ordenar por"
                  onChange={(e) => setFiltros({ ...filtros, ordenacao: e.target.value as typeof filtros.ordenacao })}
                >
                  <MenuItem value="data_desc">Data (Mais recente)</MenuItem>
                  <MenuItem value="data_asc">Data (Mais antigo)</MenuItem>
                  <MenuItem value="valor_desc">Valor (Maior)</MenuItem>
                  <MenuItem value="valor_asc">Valor (Menor)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={2}>
              <Badge badgeContent={filtrosAbertos ? pedidosFiltrados.length : pedidos.length} color="primary">
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  fullWidth
                >
                  Resultados
                </Button>
              </Badge>
            </Grid>

            <Grid size={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Data Início"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Data Fim"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Valor Mínimo"
                value={filtros.valorMin}
                onChange={(e) => setFiltros({ ...filtros, valorMin: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Valor Máximo"
                value={filtros.valorMax}
                onChange={(e) => setFiltros({ ...filtros, valorMax: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {carregandoPedidos ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          sx={{
            gap: 2,
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: pedidosFiltrados.length ? 'flex-start' : 'center',
            justifyContent: pedidosFiltrados.length ? 'flex-start' : 'center',
          }}
        >
          {pedidosFiltrados.length ? pedidosFiltrados.map((pedido) => (
            <Card key={pedido._id} style={{ width: '23%', position: 'relative' }}>
              <CardHeader 
                title={`Pedido #${pedido._id?.slice(-5)}`} 
                subheader={
                  <Box>
                    <Typography variant="caption" display="block">
                      Cliente: {pedido.cliente?.nome}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pedido.createdAt ? new Date(pedido.createdAt).toLocaleString('pt-BR') : 'Data desconhecida'}
                    </Typography>
                  </Box>
                }
              />
              
              <Menu
                id="basic-menu"
                anchorEl={ancoraStatusMenu}
                open={Boolean(ancoraStatusMenu)}
                onClose={fecharMenuStatus}
                slotProps={{
                  list: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                <MenuItem onClick={() => alterarStatusPedido('pendente')}>Pendente</MenuItem>
                <MenuItem onClick={() => alterarStatusPedido('preparando')}>Preparando</MenuItem>
                <MenuItem onClick={() => alterarStatusPedido('pronto')}>Pronto</MenuItem>
                <MenuItem onClick={() => alterarStatusPedido('entregue')}>Entregue</MenuItem>
                <Divider />
                <MenuItem onClick={() => alterarStatusPedido('cancelado')} sx={{ color: 'error.main' }}>
                  Cancelar
                </MenuItem>
              </Menu>  

              <Tooltip title="Clique para alterar status">
                <Chip
                  onClick={(e) => abrirMenuStatus(e, pedido)}
                  label={pedido.status} 
                  color={corDoStatus(pedido.status)} 
                  sx={{
                    top: 16,
                    right: 16,
                    cursor: 'pointer',
                    position: 'absolute',
                  }}
                />
              </Tooltip>

              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Itens:</Typography>
                {pedido.itens.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {item.nome} x{item.quantidade}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    R$ {pedido.total.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Restaurant sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhum pedido encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filtros.status !== 'todos' || filtros.cliente !== 'todos' || filtros.busca
                  ? 'Tente ajustar os filtros'
                  : 'Crie um novo pedido para começar'}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}