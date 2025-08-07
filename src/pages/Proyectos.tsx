import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { proyectoService} from '../services/api';
import type { Proyecto, Usuario } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Proyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [proyectosFiltrados, setProyectosFiltrados] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

const navigate = useNavigate();


  useEffect(() => {
    cargarProyectos();
  }, []);

  useEffect(() => {
    filtrarProyectos();
  }, [busqueda, proyectos]);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const response = await proyectoService.obtenerTodos();
      setProyectos(response.data);
    } catch (err: any) {
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const filtrarProyectos = () => {
    if (!busqueda) {
      setProyectosFiltrados(proyectos);
      return;
    }

    const proyectosFiltrados = proyectos.filter(proyecto =>
      proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      proyecto.tecnologias?.some(tech => 
        tech.toLowerCase().includes(busqueda.toLowerCase())
      )
    );

    setProyectosFiltrados(proyectosFiltrados);
  };

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerNombreAutor = (autor: string | Usuario) => {
    if (typeof autor === 'string') return 'Usuario';
    return autor.nombre;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando proyectos...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <i className="bi bi-grid me-2"></i>
            Explorar Proyectos
          </h2>
          
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar proyectos por nombre, descripción o tecnología..."
              value={busqueda}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''} encontrado{proyectosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </Col>
      </Row>

      <Row>
        {proyectosFiltrados.length === 0 ? (
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              {busqueda ? 'No se encontraron proyectos que coincidan con tu búsqueda.' : 'No hay proyectos disponibles aún.'}
            </Alert>
          </Col>
        ) : (
          proyectosFiltrados.map((proyecto) => (
            <Col key={proyecto._id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm"
               onClick={() => navigate(`/proyectos/${proyecto._id}`)}
  style={{ cursor: 'pointer' }}
              >
                {proyecto.imagenes && proyecto.imagenes.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={proyecto.imagenes[0]}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Proyecto';
                    }}
                  />
                )}
                
                <Card.Body className="d-flex flex-column">
                  <div>
                    <Card.Title className="h5">
                      {proyecto.nombre}
                    </Card.Title>
                    
                    <Card.Text className="text-muted small mb-2">
                      <i className="bi bi-person me-1"></i>
                      Por {obtenerNombreAutor(proyecto.autor)}
                    </Card.Text>
                    
                    <Card.Text>
                      {proyecto.descripcion.length > 100
                        ? `${proyecto.descripcion.substring(0, 100)}...`
                        : proyecto.descripcion
                      }
                    </Card.Text>
                  </div>

                  <div className="mb-3">
                    {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                      <div className="mb-2">
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
          ))
        )}
      </Row>
    </Container>
  );
};

export default Proyectos;