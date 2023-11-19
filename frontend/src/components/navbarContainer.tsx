import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../images/SensorLogo.png';

export function NavbarContainer(): JSX.Element {
    //en saanu navbar login nappia toimiin niinku pitäs
    //const [isPopupVisible, setIsPopupVisible] = useState(false);
    return (
        <div>
            <Navbar className='custom-navbar'>
                <Navbar.Brand href="/" className='brand'>
                    <img
                        src={logo}
                        width={300}
                        alt="Sensor Logo" />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/" className="buttons">Home</Nav.Link>
                        <Nav.Link as={Link} to="/graphComparison" className="buttons">Graph Comparison</Nav.Link>
                        <Nav.Link href="/register" className="buttons">Register</Nav.Link>
                        {/* <Nav.Link onClick={() => setIsPopupVisible(!isPopupVisible)}>Login</Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>

                <NavDropdown
                    title="Dropdown"
                    id="basic-nav-dropdown"
                    className="custom-dropdown">

                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                        Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                        Log out
                    </NavDropdown.Item>
                </NavDropdown>

            </Navbar>
            {/* {isPopupVisible && <PopupComponent/>} */}
        </div>
    );
}