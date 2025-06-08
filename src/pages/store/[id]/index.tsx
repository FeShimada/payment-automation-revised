/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';
import type { NextPage } from 'next';
import { api } from '../../../utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React from 'react';
import ItemCard from '../../../components/ItemCard';
import OrderSummaryCard from '../../../components/OrderSummary';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
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

  if (!id) return <CircularProgress />;
  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Erro buscando informações.</div>;
  if (!data || data.length === 0) return <div>Nenhum item encontrado.</div>;

  const pdv = data[0]?.pdv;
  const items = data.map(item => item.item);

  // Handle item quantity change
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

  return (
    <Box sx={{ padding: 2, marginTop: -12 }}>
      <PaymentDialog
        open={dialogOpen}
        text={`Você será redirecionado para a página de pagamento. Se não for redirecionado, clique aqui: `}
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        link={order.payment_link || ''}
      />
      <Typography variant="h4" gutterBottom>
        {pdv?.company}
      </Typography>
      <Grid container marginBottom={8} spacing={2}>
        {items.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <ItemCard
              item={item}
              selectedQuantity={selectedItems[item.id]?.quantity || 0}
              onQuantityChange={quantity =>
                handleQuantityChange(item.id, item, quantity)
              }
            />
          </Grid>
        ))}
      </Grid>
      <OrderSummaryCard
        selectedItems={selectedItems}
        finalizePurchase={finalizePurchase}
      />
    </Box>
  );
};

export default Store;
