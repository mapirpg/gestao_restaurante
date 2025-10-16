import { Toast } from "@/components/Toast";
import { API_BASE_URL } from "@/config";
import { 
  AlertProps, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { 
  Api as ApiIcon,
  ExpandMore,
  Person,
  Restaurant,
  ShoppingCart,
  BarChart
} from "@mui/icons-material";
import React from "react";

export default function Home() {
  const [toastMessage, setToastMessage] = React.useState<{ message: string | undefined, type: AlertProps['severity']} | undefined>();
  const [testando, setTestando] = React.useState(false);

  function testeApi() {
    setTestando(true);
    fetch(API_BASE_URL + '/test-connection')
    .then(res => res.json())
    .then((data: { message?: string }) => {
      setToastMessage({ message: data?.message, type: 'success'});
    })
    .catch(err => {
      setToastMessage({ message: 'Erro ao conectar com a API', type: 'error'});
    }).finally(() => {
      setTestando(false);
    });
  }

  const apiGroups = [
    {
      title: 'Conexão',
      icon: <ApiIcon />,
      color: '#667eea',
      apis: [
        { 
          method: 'GET', 
          endpoint: '/api/test-connection', 
          description: 'Testa conexão com MongoDB e lista coleções' 
        },
      ]
    },
    {
      title: 'Clientes',
      icon: <Person />,
      color: '#2196f3',
      apis: [
        { 
          method: 'GET', 
          endpoint: '/api/clientes', 
          description: 'Lista todos os clientes cadastrados' 
        },
        { 
          method: 'POST', 
          endpoint: '/api/clientes', 
          description: 'Cria um novo cliente (nome obrigatório)' 
        },
        { 
          method: 'GET', 
          endpoint: '/api/clientes/[id]', 
          description: 'Busca um cliente específico por ID' 
        },
        { 
          method: 'PUT', 
          endpoint: '/api/clientes/[id]', 
          description: 'Atualiza dados de um cliente' 
        },
        { 
          method: 'DELETE', 
          endpoint: '/api/clientes/[id]', 
          description: 'Remove um cliente do sistema' 
        },
      ]
    },
    {
      title: 'Produtos',
      icon: <Restaurant />,
      color: '#4caf50',
      apis: [
        { 
          method: 'GET', 
          endpoint: '/api/produtos', 
          description: 'Lista produtos com filtros (categoria, disponível, busca, preço, ordenação)' 
        },
        { 
          method: 'POST', 
          endpoint: '/api/produtos', 
          description: 'Cria novo produto (nome, descrição, preço, quantidade, categoria, disponível)' 
        },
        { 
          method: 'GET', 
          endpoint: '/api/produtos/[id]', 
          description: 'Busca um produto específico por ID' 
        },
        { 
          method: 'PUT', 
          endpoint: '/api/produtos/[id]', 
          description: 'Atualiza dados de um produto' 
        },
        { 
          method: 'DELETE', 
          endpoint: '/api/produtos/[id]', 
          description: 'Remove um produto do catálogo' 
        },
      ]
    },
    {
      title: 'Pedidos',
      icon: <ShoppingCart />,
      color: '#ff9800',
      apis: [
        { 
          method: 'GET', 
          endpoint: '/api/pedidos', 
          description: 'Lista pedidos com filtros (status, cliente, busca, data, valor, ordenação)' 
        },
        { 
          method: 'POST', 
          endpoint: '/api/pedidos', 
          description: 'Cria novo pedido (valida estoque e deduz quantidade automaticamente)' 
        },
        { 
          method: 'PUT', 
          endpoint: '/api/pedidos', 
          description: 'Atualiza status do pedido (devolve estoque se cancelado)' 
        },
      ]
    },
    {
      title: 'Estatísticas',
      icon: <BarChart />,
      color: '#9c27b0',
      apis: [
        { 
          method: 'GET', 
          endpoint: '/api/estatisticas', 
          description: 'Retorna estatísticas agregadas (faturamento, pedidos, clientes, produtos mais vendidos)' 
        },
      ]
    }
  ];

  function getMethodColor(method: string) {
    switch (method) {
      case 'GET': return 'info';
      case 'POST': return 'success';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Toast
        open={!!toastMessage}
        onClose={() => setToastMessage(undefined)}
        type={toastMessage?.type}
        message={toastMessage?.message}
      />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="flex-start" textAlign="left" direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Typography variant="h3" component="h1" fontWeight="bold">
                Sistema de Gestão de Restaurante
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Sistema completo com MongoDB demonstrando filtros, agregações, controle de estoque e estatísticas em tempo real
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={testeApi}
                startIcon={<ApiIcon />}
                disabled={testando}
                sx={{
                  mt: 1,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  alignSelf: 'flex-start'
                }}
              >
                {testando ? 'Testando...' : 'Testar Conexão API'}
              </Button>
            </Stack>

            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                p: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: { xs: '100%', md: '400px' }
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Informações Acadêmicas
                </Typography>
                
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Avaliação
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    3ª Avaliação - Projeto de Banco de Dados II
                  </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Instituição
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    IFSC - Campus Gaspar
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Análise e Desenvolvimento de Sistemas
                  </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    Período
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    2025/2 - 2º Semestre
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Prof.ª  Daniela Sbizera Justo
                  </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem', mb: 0.5 }}>
                    Alunos
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    Ellen Caroline Simon Bittencourt
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    Marcel Perin Inacio
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="text.primary">
            Documentação das APIs
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Todas as APIs utilizam o MongoDB para demonstrar queries, filtros, agregações e operações atômicas.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {apiGroups.map((group, groupIndex) => (
            <Accordion key={groupIndex} defaultExpanded={groupIndex === 0}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'grey.50' },
                  borderLeft: `4px solid ${group.color}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box sx={{ color: group.color }}>
                    {group.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {group.title}
                  </Typography>
                  <Chip 
                    label={`${group.apis.length} ${group.apis.length === 1 ? 'endpoint' : 'endpoints'}`} 
                    size="small" 
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'grey.50', p: 0 }}>
                {group.apis.map((api, index) => (
                  <Box key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      p: 2,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}>
                      <Chip 
                        label={api.method} 
                        color={getMethodColor(api.method)}
                        variant="filled"
                        size="small"
                        sx={{ minWidth: 70, fontWeight: 'bold' }}
                      />
                      <Box component="code" sx={{ 
                        fontFamily: 'monospace', 
                        flexGrow: 1,
                        fontSize: '0.875rem',
                        color: 'primary.main',
                        fontWeight: 'bold'
                      }}>
                        {api.endpoint}
                      </Box>
                    </Box>
                    <Box sx={{ px: 2, pb: 2, pt: 0, bgcolor: 'white' }}>
                      <Typography variant="body2" color="text.secondary">
                        {api.description}
                      </Typography>
                    </Box>
                    {index < group.apis.length - 1 && <Divider />}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        {/* Seção de Funcionalidades MongoDB */}
        <Card sx={{ mt: 4, bgcolor: '#f5f5f5', border: '2px solid #667eea' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
              Funcionalidades MongoDB Implementadas
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label="✓" size="small" color="success" />
                <Typography variant="body2">
                  <strong>Filtros Complexos:</strong> Queries com $or, $regex, $gte, $lte para busca e filtragem
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label="✓" size="small" color="success" />
                <Typography variant="body2">
                  <strong>Agregações:</strong> Pipeline com $group, $unwind, $sort, $limit para estatísticas
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label="✓" size="small" color="success" />
                <Typography variant="body2">
                  <strong>Operações Atômicas:</strong> $inc para controle de estoque thread-safe
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label="✓" size="small" color="success" />
                <Typography variant="body2">
                  <strong>Validação de Negócio:</strong> Verificação de estoque antes de criar pedidos
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label="✓" size="small" color="success" />
                <Typography variant="body2">
                  <strong>Ordenação Dinâmica:</strong> Sort por múltiplos campos configuráveis via query params
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Chip label="✓" size="small" color="success" />
                <Typography variant="body2">
                  <strong>Filtros Backend:</strong> Todos os filtros processados no MongoDB para demonstração
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Exemplo de Query */}
        <Card sx={{ mt: 3, bgcolor: '#263238', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Exemplo de Query com Filtros
            </Typography>
            <Box component="pre" sx={{ 
              fontFamily: 'monospace', 
              fontSize: '0.875rem',
              overflow: 'auto',
              bgcolor: '#1e272e',
              p: 2,
              borderRadius: 1,
              mt: 2
            }}>
              {`GET /api/pedidos?status=preparando&clienteId=123&busca=João&ordenacao=valor_desc&dataInicio=2024-01-01&valorMin=50

              // MongoDB Query gerado:
              {
                status: "preparando",
                "cliente._id": "123",
                $or: [
                  { _id: { $regex: "João", $options: "i" } },
                  { "cliente.nome": { $regex: "João", $options: "i" } }
                ],
                createdAt: { $gte: ISODate("2024-01-01") },
                total: { $gte: 50 }
              }
              // Sort: { total: -1 }`}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}