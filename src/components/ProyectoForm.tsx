import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import type{ Proyecto } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProyectoFormProps {
  proyecto?: Proyecto;
  onSubmit: (data: Omit<Proyecto, '_id'>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const ProyectoForm: React.FC<ProyectoFormProps> = ({
  proyecto,
  onSubmit,
  loading = false,
  error = ''
}) => {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagenes: '',
    documentacion: '',
    tecnologias: '',
    enlaceDemo: '',
    enlaceRepositorio: '',
  });

  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        imagenes: proyecto.imagenes?.join(', ') || '',
        documentacion: proyecto.documentacion || '',
        tecnologias: proyecto.tecnologias?.join(', ') || '',
        enlaceDemo: proyecto.enlaceDemo || '',
        enlaceRepositorio: proyecto.enlaceRepositorio || '',
      });
    }
  }, [proyecto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) return;

    // Procesar arrays
    const imagenes = formData.imagenes
      .split(',')
      .map(img => img.trim())
      .filter(img => img.length > 0);

    const tecnologias = formData.tecnologias
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    const proyectoData: Omit<Proyecto, '_id'> = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      imagenes,
      documentacion: formData.documentacion || undefined,
      tecnologias,
      enlaceDemo: formData.enlaceDemo || undefined,
      enlaceRepositorio: formData.enlaceRepositorio || undefined,
      autor: usuario._id,
    };

    await onSubmit(proyectoData);
  };

  return (
    <>
      {error && (
        <Alert variant="danger" className="mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-tag me-2"></i>
                Nombre del proyecto *
              </Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Mi App Web Increíble"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-link-45deg me-2"></i>
                Enlace de demostración
              </Form.Label>
              <Form.Control
                type="url"
                name="enlaceDemo"
                value={formData.enlaceDemo}
                onChange={handleInputChange}
                placeholder="https://mi-proyecto-demo.com"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>
            <i className="bi bi-card-text me-2"></i>
            Descripción *
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe tu proyecto, sus funcionalidades principales y qué problema resuelve..."
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-images me-2"></i>
                URLs de imágenes
              </Form.Label>
              <Form.Control
                type="text"
                name="imagenes"
                value={formData.imagenes}
                onChange={handleInputChange}
                placeholder="URL1, URL2, URL3 (separadas por comas)"
              />
              <Form.Text className="text-muted">
                Separa múltiples URLs con comas
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-github me-2"></i>
                Repositorio de código
              </Form.Label>
              <Form.Control
                type="url"
                name="enlaceRepositorio"
                value={formData.enlaceRepositorio}
                onChange={handleInputChange}
                placeholder="https://github.com/usuario/proyecto"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-gear me-2"></i>
                Tecnologías utilizadas
              </Form.Label>
              <Form.Control
                type="text"
                name="tecnologias"
                value={formData.tecnologias}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB, CSS3 (separadas por comas)"
              />
              <Form.Text className="text-muted">
                Separa las tecnologías con comas
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-file-text me-2"></i>
                Documentación
              </Form.Label>
              <Form.Control
                type="text"
                name="documentacion"
                value={formData.documentacion}
                onChange={handleInputChange}
                placeholder="URL del README o documentación"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2 justify-content-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {proyecto ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <i className={`bi ${proyecto ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                {proyecto ? 'Actualizar Proyecto' : 'Crear Proyecto'}
              </>
            )}
          </Button>
        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col-12">
            <small className="text-muted">
              <strong>Consejos:</strong>
            </small>
            <ul className="small text-muted mt-2">
              <li>Usa una descripción clara y concisa que explique qué hace tu proyecto</li>
              <li>Incluye capturas de pantalla para mostrar la interfaz</li>
              <li>Agrega un enlace de demostración en vivo si está disponible</li>
              <li>Lista las tecnologías principales que utilizaste</li>
            </ul>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ProyectoForm;