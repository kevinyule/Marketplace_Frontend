import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.correo || !formData.contraseña) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await usuarioService.login(formData);
      
      if (response.data.usuario) {
        login(response.data.usuario);
        navigate('/perfil');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-envelope me-2"></i>
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    placeholder="Tu contraseña"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/registro" className="text-decoration-none">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;