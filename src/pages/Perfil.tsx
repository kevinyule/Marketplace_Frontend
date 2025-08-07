import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Badge,
  Alert,
  Spinner,
  Dropdown,
} from 'react-bootstrap';
import { proyectoService } from '../services/api';
import type { Proyecto } from '../services/api';

import { useAuth } from '../context/AuthContext';
import ProyectoForm from '../components/ProyectoForm';

const Perfil: React.FC = () => {
  const { usuario } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);

  // Estados para operaciones
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState('');

  useEffect(() => {
    if (usuario) {
      cargarProyectos();
    }
  }, [usuario]);

  const cargarProyectos = async () => {
    if (!usuario) return;

    try {
      setLoading(true);
      const response = await proyectoService.obtenerPorUsuario(usuario._id);
      setProyectos(response.data);
    } catch (err: any) {
      setError('Error al cargar tus proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProyecto = async (data: Omit<Proyecto, '_id'>) => {
    try {
      setOperationLoading(true);
      setOperationError('');
      
      await proyectoService.crear(data);
      
      setSuccess('¡Proyecto creado exitosamente!');
      setShowCreateModal(false);
      cargarProyectos();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3006);
    } catch (err: any) {
      setOperationError(err.response?.data?.mensaje || 'Error al crear el proyecto');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditProyecto = async (data: Omit<Proyecto, '_id'>) => {
    if (!selectedProyecto) return;

    try {
      setOperationLoading(true);
      setOperationError('');
      
      await proyectoService.actualizar(selectedProyecto._id!, data);
      
      setSuccess('¡Proyecto actualizado exitosamente!');
      setShowEditModal(false);
      setSelectedProyecto(null);
      cargarProyectos();
      
      setTimeout(() => setSuccess(''), 3006);
    } catch (err: any) {
      setOperationError(err.response?.data?.mensaje || 'Error al actualizar el proyecto');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteProyecto = async () => {
    if (!selectedProyecto) return;

    try {
      setOperationLoading(true);
      
      await proyectoService.eliminar(selectedProyecto._id!);
      
      setSuccess('Proyecto eliminado exitosamente');
      setShowDeleteModal(false);
      setSelectedProyecto(null);
      cargarProyectos();
      
      setTimeout(() => setSuccess(''), 3006);
    } catch (err: any) {
      setError('Error al eliminar el proyecto');
    } finally {
      setOperationLoading(false);
    }
  };

  const openEditModal = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    setShowEditModal(true);
    setOperationError('');
  };

  const openDeleteModal = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    setShowDeleteModal(true);
  };

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!usuario) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          Debes iniciar sesión para ver tu perfil.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header del perfil */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="mb-1">
                    <i className="bi bi-person-circle me-2"></i>
                    {usuario.nombre}
                  </h3>
                  <p className="mb-0 opacity-75">
                    <i className="bi bi-envelope me-2"></i>
                    {usuario.correo}
                  </p>
                </div>
                <Button
                  variant="light"
                  onClick={() => {
                    setShowCreateModal(true);
                    setOperationError('');
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Proyecto
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Mensajes de estado */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess('')}>
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {/* Sección de proyectos */}
      <Row className="mb-3">
        <Col>
          <h4>
            <i className="bi bi-folder me-2"></i>
            Mis Proyectos ({proyectos.length})
          </h4>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando tus proyectos...</p>
        </div>
      ) : proyectos.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Aún no tienes proyectos. ¡Crea tu primer proyecto!
        </Alert>
      ) : (
        <Row>
          {proyectos.map((proyecto) => (
            <Col key={proyecto._id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {proyecto.imagenes && proyecto.imagenes.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={proyecto.imagenes[0]}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Proyecto';
                    }}
                  />
                )}

                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h5">{proyecto.nombre}</Card.Title>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id={`dropdown-${proyecto._id}`}
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => openEditModal(proyecto)}>
                          <i className="bi bi-pencil me-2"></i>
                          Editar
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => openDeleteModal(proyecto)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Eliminar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <Card.Text>
                    {proyecto.descripcion.length > 100
                      ? `${proyecto.descripcion.substring(0, 100)}...`
                      : proyecto.descripcion}
                  </Card.Text>

                  <div className="mb-3">
                    {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                      <div>
                        {proyecto.tecnologias.slice(0, 3).map((tech, index) => (
                          <Badge key={index} bg="secondary" className="me-1 mb-1">
                            {tech}
                          </Badge>
                        ))}
                        {proyecto.tecnologias.length > 3 && (
                          <Badge bg="light" text="dark">
                            +{proyecto.tecnologias.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex gap-2 mb-2">
                      {proyecto.enlaceDemo && (
                        <Button
                          variant="primary"
                          size="sm"
                          href={proyecto.enlaceDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-eye me-1"></i>
                          Demo
                        </Button>
                      )}

                      {proyecto.enlaceRepositorio && (
                        <Button
                          variant="outline-dark"
                          size="sm"
                          href={proyecto.enlaceRepositorio}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-github me-1"></i>
                          Código
                        </Button>
                      )}
                    </div>

                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {formatearFecha(proyecto.fechaCreacion)}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal para crear proyecto */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Crear Nuevo Proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProyectoForm
            onSubmit={handleCreateProyecto}
            loading={operationLoading}
            error={operationError}
          />
        </Modal.Body>
      </Modal>

      {/* Modal para editar proyecto */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil me-2"></i>
            Editar Proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProyectoForm
            proyecto={selectedProyecto || undefined}
            onSubmit={handleEditProyecto}
            loading={operationLoading}
            error={operationError}
          />
        </Modal.Body>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-trash me-2"></i>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que quieres eliminar el proyecto{' '}
            <strong>"{selectedProyecto?.nombre}"</strong>?
          </p>
          <p className="text-muted">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteProyecto}
            disabled={operationLoading}
          >
            {operationLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Eliminando...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Eliminar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Perfil;