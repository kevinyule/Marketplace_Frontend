import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                TalentTech Marketplace
              </h1>
              <p className="lead mb-4">
                Descubre, comparte y encuentra increíbles proyectos de desarrollo web. 
                Una plataforma donde los desarrolladores muestran su talento y se conectan con oportunidades.
              </p>
              
              {isAuthenticated ? (
                <div>
                  <p className="mb-3">
                    ¡Bienvenido de vuelta, <strong>{usuario?.nombre}</strong>!
                  </p>
                  <div className="d-flex gap-3">
                    <Link to="/proyectos">
                      <Button variant="light" size="lg">
                        <i className="bi bi-grid me-2"></i>
                        Explorar Proyectos
                      </Button>
                    </Link>
                    <Link to="/perfil">
                      <Button variant="outline-light" size="lg">
                        <i className="bi bi-person me-2"></i>
                        Mi Perfil
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-3">
                  <Link to="/registro">
                    <Button variant="light" size="lg">
                      <i className="bi bi-person-plus me-2"></i>
                      Comenzar Gratis
                    </Button>
                  </Link>
                  <Link to="/proyectos">
                    <Button variant="outline-light" size="lg">
                      <i className="bi bi-grid me-2"></i>
                      Ver Proyectos
                    </Button>
                  </Link>
                </div>
              )}
            </Col>
            
            <Col lg={6} className="text-center">
              <div className="bg-light rounded p-4 text-dark">
                <i className="bi bi-code-slash display-1 text-primary"></i>
                <h3 className="mt-3">Muestra tu trabajo</h3>
                <p className="mb-0">
                  Comparte tus proyectos web y conecta con otros desarrolladores
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="mb-3">¿Por qué usar TalentTech Marketplace?</h2>
            <p className="lead text-muted">
              Una plataforma diseñada por desarrolladores, para desarrolladores
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-upload text-primary fs-1"></i>
                </div>
                <h5>Sube tus Proyectos</h5>
                <p className="text-muted">
                  Comparte tus creaciones web con una comunidad de desarrolladores. 
                  Incluye demos, código fuente y documentación.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-search text-success fs-1"></i>
                </div>
                <h5>Descubre Talento</h5>
                <p className="text-muted">
                  Explora proyectos increíbles, encuentra inspiración y descubre 
                  nuevas tecnologías y enfoques de desarrollo.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-people text-info fs-1"></i>
                </div>
                <h5>Conecta y Colabora</h5>
                <p className="text-muted">
                  Conecta con otros desarrolladores, recibe feedback y 
                  encuentra oportunidades de colaboración.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-light py-5">
          <Container>
            <Row className="text-center">
              <Col>
                <h3 className="mb-3">¿Listo para mostrar tu talento?</h3>
                <p className="lead mb-4 text-muted">
                  Únete a nuestra comunidad de desarrolladores y comienza a compartir tus proyectos hoy mismo.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/registro">
                    <Button variant="primary" size="lg">
                      <i className="bi bi-person-plus me-2"></i>
                      Crear Cuenta Gratis
                    </Button>
                  </Link>
                  <Link to="/proyectos">
                    <Button variant="outline-primary" size="lg">
                      <i className="bi bi-grid me-2"></i>
                      Explorar Proyectos
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Home;
