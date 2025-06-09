/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';
import type { NextPage } from 'next';
import { api } from '../../../utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  IconButton,
  Container,
  Divider
} from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import PaymentDialog from '../../../components/PaymentDialog';

interface IPDV {
  id: string;
  type: string;
  company: string;
}

export interface IItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}
interface IItemsOnPDV {
  id: string;
  quantity: number;
  item: IItem[];
  pdv: IPDV;
}

const Store: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<{
    [itemId: string]: { item: IItem; quantity: number; };
  }>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const createOrderMutation = api.order.create.useMutation();

  // Fetch PDV and items
  const { data, isLoading, isError } = api.items.getByPdvId.useQuery(
    { pdvId: id as string },
    { enabled: !!id }
  );

  const handleQuantityChange = (
    itemId: string,
    item: IItem,
    quantity: number,
  ) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: { item, quantity },
    });
  };

  // Finalizar Compra
  const finalizePurchase = async () => {
    if (Object.keys(selectedItems).length === 0) {
      toast.error('Nenhum item selecionado.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    try {
      // Validações adicionais
      if (!id) {
        throw new Error('ID do PDV não encontrado');
      }

      // Transform selectedItems into the format expected by the mutation
      const itemsArray = Object.values(selectedItems).map(itemData => ({
        itemId: itemData.item.id,
        quantity: itemData.quantity,
      }));

      // Validar items
      if (!itemsArray.every(item => item.itemId && item.quantity > 0)) {
        throw new Error('Dados dos items inválidos');
      }

      // Calculate the total price
      const totalPrice = Object.values(selectedItems).reduce(
        (total, itemData) => total + itemData.item.price * itemData.quantity,
        0,
      );

      // Validar preço total
      if (totalPrice <= 0) {
        throw new Error('Preço total inválido');
      }

      console.log('Dados do pedido:', {
        pdvId: id,
        items: itemsArray,
        price: totalPrice,
      });

      const updatedOrder = await createOrderMutation.mutateAsync({
        pdvId: id as string,
        items: itemsArray,
        price: totalPrice,
      });

      console.log('Resposta da criação do pedido:', updatedOrder);

      setOrder(updatedOrder);
      setDialogOpen(true);

      toast.success('Compra finalizada com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });

      setTimeout(() => {
        if (updatedOrder.payment_link) {
          window.open(updatedOrder.payment_link, '_blank');
          setDialogOpen(false);
        } else {
          toast.error('Link de pagamento não gerado', {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
          });
        }
      }, 8000);

      setSelectedItems({});
    } catch (error) {
      console.error('Erro detalhado ao criar pedido:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao finalizar a compra: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }
  };

  const ProductCard = ({ item }: { item: IItem; }) => {
    const quantity = selectedItems[item.id]?.quantity || 0;

    return (
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {item.description}
          </Typography>
          <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
            R$ {item.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Estoque: 1
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Quantidade:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.id, item, Math.max(0, quantity - 1))}
                disabled={quantity === 0}
              >
                <Remove />
              </IconButton>
              <TextField
                size="small"
                value={quantity}
                inputProps={{
                  style: { textAlign: 'center' },
                  min: 0,
                }}
                sx={{ width: '80px' }}
              />
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.id, item, quantity + 1)}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCart />}
            onClick={() => handleQuantityChange(item.id, item, quantity + 1)}
            sx={{
              mt: 3,
              borderRadius: '8px',
              textTransform: 'none',
              backgroundColor: (theme) => theme.palette.primary.main,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            Adicionar ao Carrinho
          </Button>
        </CardContent>
      </Card>
    );
  };

  const CartCard = () => {
    const hasItems = Object.keys(selectedItems).length > 0;

    return (
      <Paper sx={{
        position: 'fixed',
        right: 24,
        top: 100,
        width: 300,
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        bgcolor: 'background.paper',
      }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCart sx={{ color: 'text.secondary' }} />
            <Typography variant="h6" color="text.primary">Pedido</Typography>
          </Box>

          {!hasItems ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 6
            }}>
              <ShoppingCart
                sx={{
                  fontSize: 80,
                  color: 'text.disabled',
                  mb: 2,
                  opacity: 0.3
                }}
              />
              <Typography color="text.secondary">
                Seu carrinho está vazio
              </Typography>
            </Box>
          ) : (
            <>
              {Object.values(selectedItems).map(({ item, quantity }) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {quantity}x R$ {item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      R$ {(quantity * item.price).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">
                  R$ {Object.values(selectedItems)
                    .reduce((total, { item, quantity }) => total + item.price * quantity, 0)
                    .toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={finalizePurchase}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
              >
                Finalizar Compra
              </Button>
            </>
          )}
        </Box>
      </Paper>
    );
  };

  if (!id) return <CircularProgress />;
  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Erro buscando informações.</div>;
  if (!data || data.length === 0) return <div>Nenhum item encontrado.</div>;

  const pdv = data[0]?.pdv;
  const items = data.map(item => item.item);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <PaymentDialog
        open={dialogOpen}
        text="Você será redirecionado para a página de pagamento. Se não for redirecionado, clique aqui: "
        link={order.payment_link || ''}
      />

      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: 'text.primary',
          fontWeight: 'medium'
        }}
      >
        Produtos Disponíveis
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {items.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <ProductCard item={item} />
          </Grid>
        ))}

      </Grid>

      <CartCard />
    </Container>
  );
};

export default Store;
