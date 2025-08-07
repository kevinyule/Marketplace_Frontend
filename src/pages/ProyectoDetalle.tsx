import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Carousel,
  Modal
} from 'react-bootstrap';
import { proyectoService} from '../services/api';
import type{Proyecto, Usuario } from '../services/api';

const ProyectoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      cargarProyecto();
    }
  }, [id]);

  const cargarProyecto = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await proyectoService.obtenerPorId(id);
      setProyecto(response.data);
    } catch (err: any) {
      setError('Error al cargar el proyecto');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerNombreAutor = (autor: string | Usuario) => {
    if (typeof autor === 'string') return 'Usuario';
    return autor.nombre;
  };

  const obtenerCorreoAutor = (autor: string | Usuario) => {
    if (typeof autor === 'string') return '';
    return autor.correo;
  };

  const abrirImagenModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando proyecto...</p>
      </Container>
    );
  }

  if (error || !proyecto) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || 'Proyecto no encontrado'}
        </Alert>
        <div className="text-center">
          <Button variant="primary" onClick={() => navigate('/proyectos')}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Proyectos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Botón de regreso */}
      <Row className="mb-3">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            className="mb-3"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Regresar
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Columna principal - Información del proyecto */}
        <Col lg={8}>
          {/* Header del proyecto */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="h2 mb-2">{proyecto.nombre}</h1>
                  <div className="text-muted mb-2">
                    <i className="bi bi-person me-2"></i>
                    <strong>Por:</strong> {obtenerNombreAutor(proyecto.autor)}
                    {obtenerCorreoAutor(proyecto.autor) && (
                      <span className="ms-2">({obtenerCorreoAutor(proyecto.autor)})</span>
                    )}
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    Publicado el {formatearFecha(proyecto.fechaCreacion)}
                  </small>
                </div>
              </div>

              {/* Tecnologías */}
              {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                <div className="mb-3">
                  <h6 className="mb-2">Tecnologías utilizadas:</h6>
                  <div>
                    {proyecto.tecnologias.map((tech, index) => (
                      <Badge key={index} bg="secondary" className="me-2 mb-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="d-flex gap-2 flex-wrap">
                {proyecto.enlaceDemo && (
                  <Button
                    variant="primary"
                    href={proyecto.enlaceDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    <i className="bi bi-eye me-2"></i>
                    Ver Demo en Vivo
                  </Button>
                )}

                {proyecto.enlaceRepositorio && (
                  <Button
                    variant="dark"
                    href={proyecto.enlaceRepositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    <i className="bi bi-github me-2"></i>
                    Ver Código Fuente
                  </Button>
                )}

                {proyecto.documentacion && (
                  <Button
                    variant="outline-info"
                    href={proyecto.documentacion}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-file-text me-2"></i>
                    Documentación
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Descripción del proyecto */}
          <Card className="mb-4 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-card-text me-2"></i>
                Descripción del Proyecto
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {proyecto.descripcion}
              </div>
            </Card.Body>
          </Card>

          {/* Galería de imágenes */}
          {proyecto.imagenes && proyecto.imagenes.length > 0 && (
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-images me-2"></i>
                  Galería de Imágenes ({proyecto.imagenes.length})
                </h5>
              </Card.Header>
              <Card.Body>
                {proyecto.imagenes.length === 1 ? (
                  // Una sola imagen
                  <div className="text-center">
                    <img
                      src={proyecto.imagenes[0]}
                      alt={`${proyecto.nombre} - Imagen 1`}
                      className="img-fluid rounded cursor-pointer shadow-sm"
                      style={{ maxHeight: '500px', cursor: 'pointer' }}
                      onClick={() => abrirImagenModal(0)}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
                      }}
                    />
                    <p className="text-muted mt-2 small">
                      Haz clic en la imagen para verla en tamaño completo
                    </p>
                  </div>
                ) : (
                  // Múltiples imágenes en carousel
                  <div>
                    <Carousel 
                      variant="dark" 
                      indicators={true}
                      controls={true}
                      interval={null}
                    >
                      {proyecto.imagenes.map((imagen, index) => (
                        <Carousel.Item key={index}>
                          <div className="text-center">
                            <img
                              src={imagen}
                              alt={`${proyecto.nombre} - Imagen ${index + 1}`}
                              className="img-fluid rounded cursor-pointer"
                              style={{ 
                                maxHeight: '500px', 
                                cursor: 'pointer',
                                objectFit: 'contain',
                                width: '100%'
                              }}
                              onClick={() => abrirImagenModal(index)}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
                              }}
                            />
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    <p className="text-muted mt-3 text-center small">
                      <i className="bi bi-info-circle me-1"></i>
                      Usa las flechas para navegar entre imágenes. Haz clic en cualquier imagen para verla en tamaño completo.
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar - Información adicional */}
        <Col lg={4}>
          {/* Información del autor */}
          <Card className="mb-4 shadow-sm">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Información del Autor
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person-fill text-primary fs-1"></i>
                </div>
                <h6>{obtenerNombreAutor(proyecto.autor)}</h6>
                {obtenerCorreoAutor(proyecto.autor) && (
                  <p className="text-muted small mb-0">
                    {obtenerCorreoAutor(proyecto.autor)}
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Detalles técnicos */}
          <Card className="mb-4 shadow-sm">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Detalles del Proyecto
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="row g-3">
                <div className="col-12">
                  <strong>Fecha de publicación:</strong>
                  <br />
                  <small className="text-muted">
                    {formatearFecha(proyecto.fechaCreacion)}
                  </small>
                </div>

                {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                  <div className="col-12 ">
                    <strong>Tecnologías ({proyecto.tecnologias.length}):</strong>
                    <div className="mt-2">
                      {proyecto.tecnologias.map((tech, index) => (
                        <Badge key={index} bg="outline-secondary" className="me-1 mb-1  text-primary-emphasis">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {proyecto.imagenes && proyecto.imagenes.length > 0 && (
                  <div className="col-12">
                    <strong>Imágenes:</strong>
                    <br />
                    <small className="text-muted">
                      {proyecto.imagenes.length} imagen{proyecto.imagenes.length !== 1 ? 'es' : ''} disponible{proyecto.imagenes.length !== 1 ? 's' : ''}
                    </small>
                  </div>
                )}

                <div className="col-12">
                  <strong>Estado:</strong>
                  <br />
                  <Badge bg={proyecto.activo ? 'success' : 'secondary'}>
                    {proyecto.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Enlaces rápidos */}
          <Card className="shadow-sm">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-link-45deg me-2"></i>
                Enlaces Rápidos
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {proyecto.enlaceDemo && (
                  <Button
                    variant="outline-primary"
                    href={proyecto.enlaceDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    <i className="bi bi-eye me-2"></i>
                    Ver Demo
                  </Button>
                )}

                {proyecto.enlaceRepositorio && (
                  <Button
                    variant="outline-dark"
                    href={proyecto.enlaceRepositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    <i className="bi bi-github me-2"></i>
                    Código Fuente
                  </Button>
                )}

                {proyecto.documentacion && (
                  <Button
                    variant="outline-info"
                    href={proyecto.documentacion}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    <i className="bi bi-file-text me-2"></i>
                    Documentación
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para ver imágenes en tamaño completo */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {proyecto.imagenes && proyecto.imagenes.length > 1 
              ? `Imagen ${selectedImageIndex + 1} de ${proyecto.imagenes.length}`
              : 'Vista de imagen'
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {proyecto.imagenes && (
            <img
              src={proyecto.imagenes[selectedImageIndex]}
              alt={`${proyecto.nombre} - Imagen ${selectedImageIndex + 1}`}
              className="img-fluid"
              style={{ maxHeight: '70vh' }}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
              }}
            />
          )}
        </Modal.Body>
        {proyecto.imagenes && proyecto.imagenes.length > 1 && (
          <Modal.Footer className="justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={() => setSelectedImageIndex(prev => 
                prev > 0 ? prev - 1 : proyecto.imagenes!.length - 1
              )}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Anterior
            </Button>
            <span className="text-muted">
              {selectedImageIndex + 1} / {proyecto.imagenes.length}
            </span>
            <Button
              variant="outline-secondary"
              onClick={() => setSelectedImageIndex(prev => 
                prev < proyecto.imagenes!.length - 1 ? prev + 1 : 0
              )}
            >
              Siguiente
              <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default ProyectoDetalle;