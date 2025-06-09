/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Header } from "../../components/Header";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface IPDVData {
  id: string;
  isActive: boolean;
  type: string;
  company: string;
  login: string;
  password: string;
}

const PDV: NextPage = () => {
  const router = useRouter();

  const getpdv = api.pdvs.getAll.useMutation({
    onSuccess: (data: IPDVData[]) => {
      if (data && data.length > 0) {
        setpdv(data);
      }
    },
    onError: (err) => {
      toast.error(`Ocorreu um erro. ${err.message.toString()}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const [pdv, setpdv] = useState<IPDVData[]>([] as IPDVData[]);
  const [filteredPDV, setFilteredPDV] = useState<IPDVData[]>([] as IPDVData[]);

  useEffect(() => {
    getpdv.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.reload]);

  useEffect(() => {
    setFilteredPDV(pdv);
  }, [pdv]);

  const handleAddPDV = () => {
    void router.push("/pdv/create");
  };

  const handleEditPDV = (id: string) => {
    const findPDV = pdv.find((PDV) => PDV.id === id) as IPDVData;
    const formattedPDV = JSON.stringify(findPDV);
    void router.push(
      {
        pathname: `/pdv/edit/[id]`,
        query: {
          id,
          PDVData: formattedPDV,
        },
      },
      `/pdv/edit/${id}`
    );
  };

  return (
    <>
      <Header />
      <Container maxWidth={false} sx={{ p: 3 }}>
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500, color: '#333' }}>
              Pontos de Vendas
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddPDV}
              sx={{
                backgroundColor: '#14B02B',
                '&:hover': {
                  backgroundColor: '#119324',
                },
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
              }}
            >
              Adicionar
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{
                    fontWeight: 500,
                    color: '#666',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff',
                  }}>
                    COMPANHIA
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 500,
                    color: '#666',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff',
                  }}>
                    LOGIN
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 500,
                    color: '#666',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff',
                  }}>
                    TIPO
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 500,
                    color: '#666',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff',
                  }}>
                    ATIVO
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 500,
                    color: '#666',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff',
                  }}>
                    AÇÕES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPDV.map((PDVData: IPDVData) => (
                  <TableRow
                    key={PDVData?.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}>
                      {PDVData.company}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}>
                      {PDVData.login}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}>
                      <Chip
                        label={PDVData.type}
                        size="small"
                        sx={{
                          backgroundColor: PDVData.type === 'manual' ? '#E3F5FF' : '#F0F8FF',
                          color: PDVData.type === 'manual' ? '#0078D4' : '#333',
                          borderRadius: '4px',
                          textTransform: 'lowercase',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}>
                      <Chip
                        label="Ativo"
                        size="small"
                        sx={{
                          backgroundColor: '#E6F6EA',
                          color: '#14B02B',
                          borderRadius: '4px',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditPDV(PDVData?.id)}
                          sx={{
                            color: '#666',
                            '&:hover': { color: '#333' },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#666',
                            '&:hover': { color: '#d32f2f' },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            color: '#666',
            fontSize: '0.875rem',
          }}>
            <Typography variant="body2">
              Linhas por página: 5
            </Typography>
            <Typography variant="body2">
              1-2 de 2
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PDV;
