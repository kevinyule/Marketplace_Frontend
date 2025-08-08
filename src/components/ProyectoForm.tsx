import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import type { Proyecto } from '../services/api';
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
    imagenes: [] as string[], // ahora siempre es array
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
        imagenes: proyecto.imagenes || [], // si viene array, se setea directo
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readers = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((imagesBase64) => {
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...imagesBase64] // acumulamos
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const tecnologias = formData.tecnologias
      .split(',')
      .map(tech => tech.trim())
      .filter(Boolean);

    const proyectoData: Omit<Proyecto, '_id'> = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      imagenes: formData.imagenes, // ya es array real
      documentacion: formData.documentacion.trim() || undefined,
      tecnologias,
      enlaceDemo: formData.enlaceDemo.trim() || undefined,
      enlaceRepositorio: formData.enlaceRepositorio.trim() || undefined,
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
            placeholder="Describe tu proyecto..."
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-images me-2"></i>
                Imágenes del proyecto
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                Puedes subir varias imágenes, se convertirán automáticamente en Base64
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
                placeholder="React, Node.js, MongoDB, CSS3"
              />
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
          <Button type="submit" variant="primary" disabled={loading}>
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
      </Form>
    </>
  );
};

export default ProyectoForm;
