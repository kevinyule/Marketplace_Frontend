import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const NavigationBar: React.FC = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <i className="bi bi-code-square me-2"></i>
            TalentTech Marketplace
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/proyectos">
              <Nav.Link>
                <i className="bi bi-grid me-1"></i>
                Explorar Proyectos
              </Nav.Link>
            </LinkContainer>
            
            {isAuthenticated && (
              <LinkContainer to="/perfil">
                <Nav.Link>
                  <i className="bi bi-person me-1"></i>
                  Mi Perfil
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Hola, <strong>{usuario?.nombre}</strong>
                </Navbar.Text>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button variant="outline-light" size="sm" className="me-2">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                  </Button>
                </LinkContainer>
                <LinkContainer to="/registro">
                  <Button variant="primary" size="sm">
                    <i className="bi bi-person-plus me-1"></i>
                    Registrarse
                  </Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;