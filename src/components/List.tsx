import { Box, Card, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from "@mui/icons-material";

export const List = ({
  itens,
  deletarItem,
  editarItem
}: {
  deletarItem: (id: string) => Promise<boolean>;
  editarItem: (id: string) => void;
  itens: any[];
}) => {
    return itens?.length > 0 ? itens.map((item) => (
      <Card
        key={item._id} 
        style={{ 
          margin: '2px', 
          padding: '8px', 
          flexDirection: 'row', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}
      >
        <Typography>Nome: {item.nome}</Typography>
        <Box>
          <IconButton onClick={() => item?._id && editarItem(item._id)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => item?._id && deletarItem(item._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Card>
    )) : null
  }