/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../assets/images/logo.png';
import Image from 'next/image';
import Head from 'next/head';
import { type NextPage } from 'next';
import { api } from '../utils/api';
import { useRouter } from 'next/router';
import Copyright from '../components/Copyright';
import { toast } from 'react-toastify';
import { useFormik, Field, FormikProvider } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import z from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Digite um e-mail válido'),
  password: z
    .string({ required_error: 'Campo obrigatório' })
    .min(4, 'A senha tem no mínimo 4 caracteres'),
});

const Home: NextPage = () => {
  const router = useRouter();
  const login = api.auth.login.useMutation({
    onSuccess: async data => {
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      await router.push('/pdv');
    },
    onError: err => {
      toast.error('Ocorreu um erro. Verifique suas credenciais.');
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: values => {
      login.mutate({
        email: values.email,
        password: values.password,
      });
    },
  });

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Head>
        <title>QuickPay</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Image
            src={logo}
            alt="Logo da Empresa QuickPay"
            style={{
              width: '80px',
              height: '80px',
            }}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 1 }}>
            Login de Administrador QuickPay
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Acesse o painel administrativo
          </Typography>
          <FormikProvider value={formik}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Field
                name="email"
                type="email"
                label="E-mail"
                margin="normal"
                fullWidth
                value={formik.values.email}
                as={TextField}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ mb: 2 }}
              />
              <Field
                name="password"
                type="password"
                label="Senha"
                margin="normal"
                fullWidth
                value={formik.values.password}
                as={TextField}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 3,
                  py: 1.5,
                  backgroundColor: '#14B02B',
                  '&:hover': {
                    backgroundColor: '#119324',
                  },
                }}
                disabled={login.isLoading}
              >
                {login.isLoading ? <CircularProgress size={24} /> : 'ENTRAR'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link href="/access" style={{ textDecoration: 'none' }}>
                  <Typography color="#14B02B" sx={{ fontWeight: 500 }}>
                    Acesso para o painel de loja
                  </Typography>
                </Link>
              </Box>
            </form>
          </FormikProvider>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};

export default Home;
