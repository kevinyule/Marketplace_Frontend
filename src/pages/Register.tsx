import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
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

    // Validaciones
    if (!formData.nombre || !formData.correo || !formData.contraseña) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await usuarioService.registro({
        nombre: formData.nombre,
        correo: formData.correo,
        contraseña: formData.contraseña,
      });

      // Si el registro es exitoso, hacer login automáticamente
      if (response.data.usuario) {
        login(response.data.usuario);
        navigate('/perfil');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Crear Cuenta
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
                    <i className="bi bi-person me-2"></i>
                    Nombre completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock-fill me-2"></i>
                    Confirmar contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarContraseña"
                    value={formData.confirmarContraseña}
                    onChange={handleInputChange}
                    placeholder="Repite tu contraseña"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check me-2"></i>
                      Crear Cuenta
                    </>
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Inicia sesión aquí
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

export default Register;