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
} from "@mui/material";
import { 
  Api as ApiIcon} from "@mui/icons-material";
import React from "react";

export default function Home() {
  const [toastMessage, setToastMessage] = React.useState<{ message: string | undefined, type: AlertProps['severity']} | undefined>();

  function testeApi() {
    fetch(API_BASE_URL + '/test-connection')
    .then(res => res.json())
    .then((data: { message?: string }) => {
      console.log('Resposta da API:', data);
      setToastMessage({ message: data?.message, type: 'success'});
    })
    .catch(err => {
      console.error('Erro na requisição:', err);
      setToastMessage({ message: 'Erro ao conectar com a API', type: 'error'});
    });
  }

  const apis = [
    { method: 'GET', endpoint: '/api/test-connection', description: 'Testa conexão com MongoDB' },
    { method: 'GET', endpoint: '/api/clientes', description: 'Lista todos os clientes' },
    { method: 'POST', endpoint: '/api/clientes', description: 'Cria um novo cliente' },
    { method: 'PUT', endpoint: '/api/clientes/[id]', description: 'Atualiza cliente' },
    { method: 'DELETE', endpoint: '/api/clientes/[id]', description: 'Remove cliente' },
    { method: 'GET', endpoint: '/api/produtos', description: 'Lista produtos' },
    { method: 'POST', endpoint: '/api/produtos', description: 'Cria produto' },
    { method: 'DELETE', endpoint: '/api/produtos/[id]', description: 'Remove produto' }
  ];

  function getMethodColor(method: string) {
    switch (method) {
      case 'GET': return 'info';
      case 'POST': return 'success';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  };

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
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h2" component="h1" fontWeight="bold">
              Sistema de Gestão de Restaurante
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={testeApi}
              startIcon={<ApiIcon />}
              sx={{
                mt: 1,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Testar Conexão API
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="text.primary">
            APIs Disponíveis
          </Typography>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {apis.map((api, index) => (
                <Box key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 1.5,
                    '&:hover': { bgcolor: 'grey.50' }
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
                      fontSize: '0.875rem'
                    }}>
                      {api.endpoint}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                      {api.description}
                    </Typography>
                  </Box>
                  {index < apis.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}